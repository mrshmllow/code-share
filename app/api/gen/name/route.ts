import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { receiver } from "@/lib/messaging/receiver";
import { openai } from "@/lib/openai";
import { pusher } from "@/lib/pusher";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid/async";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const BodyObject = z.object({
  gistId: z.string(),
});

const AIResponseObject = z.object({
  reasoning: z.string(),
  filename: z.string().nullable(),
});

async function revalidate(
  gist_id: string,
  data: {
    name: string | null;
    aiNameReason: string | null;
  },
) {
  revalidatePath(`/${gist_id}`);

  await pusher.trigger(`gist-update.${gist_id}`, "name", data);
}

async function genDefaultName(id: string) {
  await db
    .update(gists)
    .set({
      aiCompleted: true,
    })
    .where(eq(gists.id, id));

  await revalidate(id, {
    name: null,
    aiNameReason: null,
  });

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("upstash-signature");
  const text = await req.text();

  if (!signature) {
    return new NextResponse("`Upstash-Signature` header is missing", {
      status: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  if (req.headers.get("content-type") != "application/json") {
    return new NextResponse("`Content-Type` must be a JSON", {
      status: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  const requestData = await BodyObject.safeParseAsync(JSON.parse(text));

  if (!requestData.success) {
    return new NextResponse(fromZodError(requestData.error).toString(), {
      status: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  try {
    const isValid = receiver.verify({
      signature,
      body: text,
    });

    if (!isValid) {
      return new NextResponse("Invalid signature", {
        status: 400,
        headers: {
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch (e) {
    return genDefaultName(requestData.data.gistId);
  }

  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, requestData.data.gistId),
    columns: {
      id: true,
      text: true,
      name: true,
    },
  });

  if (gist === undefined) {
    return new NextResponse("gist not found", {
      status: 404,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  if (gist.name !== null) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  const constant_value = await nanoid();

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    temperature: 0,
    frequency_penalty: 1,
    messages: [
      {
        role: "system",
        content: `Request ID: ${constant_value}`,
      },
      {
        role: "system",
        content:
          "assign a filename to the following file snippet. think it through step-by-step.",
      },
      {
        role: "user",
        content: gist.text,
      },
    ],
    function_call: {
      name: "updateSnippetName",
    },
    functions: [
      {
        name: "updateSnippetName",
        description: "Update snippet name",
        parameters: {
          type: "object",
          properties: {
            reasoning: {
              type: "string",
              description:
                "Detailed step-by-step reasoning for filename choice",
            },
            filename: {
              type: ["string", "null"],
              description: "The name of the snippet",
            },
          },
          required: ["reasoning", "filename"],
        },
      },
    ],
  });

  if (completion.status !== 200) {
    return genDefaultName(gist.id);
  }

  const message = completion.data.choices[0]?.message?.function_call;

  if (
    message?.name === undefined ||
    message.name !== "updateSnippetName" ||
    message.arguments === undefined
  ) {
    return genDefaultName(gist.id);
  }

  let rawResponse;

  try {
    rawResponse = JSON.parse(message.arguments);
  } catch {
    return genDefaultName(gist.id);
  }

  const aiResponse = await AIResponseObject.safeParseAsync(rawResponse);

  if (
    !aiResponse.success ||
    aiResponse.data.filename === null ||
    aiResponse.data.filename.includes(constant_value) ||
    aiResponse.data.reasoning.includes(constant_value)
  ) {
    return genDefaultName(gist.id);
  }

  await db
    .update(gists)
    .set({
      name: aiResponse.data.filename,
      aiNameReason: aiResponse.data.reasoning,
      aiCompleted: true,
    })
    .where(eq(gists.id, gist.id));

  await revalidate(gist.id, {
    name: aiResponse.data.filename,
    aiNameReason: aiResponse.data.reasoning,
  });

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
