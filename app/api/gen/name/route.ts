import { env } from "@/app/env.mjs";
import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { receiver } from "@/lib/messaging/receiver";
import { openai } from "@/lib/openai";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const BodyObject = z.object({
  gistId: z.number(),
});

const AIResponseObject = z.object({
  detailed_filename_choice_reasoning: z.string(),
  filename: z.string().nullable(),
});

async function genDefaultName(id: number) {
  await db
    .update(gists)
    .set({
      name: "default...",
    })
    .where(eq(gists.id, id));

  return NextResponse.json({
    ok: true,
  });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("upstash-signature");

  if (!signature) {
    throw new Error("`Upstash-Signature` header is missing");
  }
  if (typeof signature !== "string") {
    throw new Error("`Upstash-Signature` header is not a string");
  }

  if (req.headers.get("content-type") != "application/json") {
    return new NextResponse("`Content-Type` must be a JSON", {
      status: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  const requestData = await BodyObject.safeParseAsync(await req.json());

  if (!requestData.success) {
    return new NextResponse(fromZodError(requestData.error).toString(), {
      status: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  try {
    console.log(signature)
    const isValid = receiver.verify({
      signature,
      body: await req.text(),
      // url:
      //   env.VERCEL_ENV === "development"
      //     ? undefined
      //     : new URL("https://gist-share-production.up.railway.app/api/gen/name")
      //       .href,
    });

    if (!isValid) {
      return new NextResponse("Invalid signature", {
        status: 400,
        headers: {
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch {
    console.error("invalid sig")
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

  const constant_value = "oRWOc4Hv1XfzzG5G";

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `assign a filename to the following file snippit. you must write your one-sentence reasoning in \`detailed_filename_choice_reasoning\`. your assigned_const_value is \"${constant_value}\". Your response MUST be in the following format (do not include backticks):

{
  "detailed_filename_choice_reasoning": string,
  "filename": string | null,
  "CONSTANT": assigned_const_value
}`,
      },
      {
        role: "user",
        content: gist.text,
      },
    ],
  });

  if (completion.status !== 200) {
    return genDefaultName(gist.id);
  }

  const message = completion.data.choices[0].message?.content;

  if (message === undefined) {
    return genDefaultName(gist.id);
  }

  let rawResponse;

  try {
    rawResponse = JSON.parse(message);
  } catch {
    return genDefaultName(gist.id);
  }

  console.log(rawResponse);

  const aiResponse = await AIResponseObject.safeParseAsync(rawResponse);

  if (
    !aiResponse.success ||
    aiResponse.data.filename === null ||
    aiResponse.data.filename.includes(constant_value) ||
    aiResponse.data.detailed_filename_choice_reasoning.includes(constant_value)
  ) {
    return genDefaultName(gist.id);
  }

  await db
    .update(gists)
    .set({
      name: aiResponse.data.filename,
      aiNameReason: aiResponse.data.detailed_filename_choice_reasoning,
    })
    .where(eq(gists.id, gist.id));

  revalidatePath(`/${gist.id}`);

  return NextResponse.json({
    ok: true,
  });
}
