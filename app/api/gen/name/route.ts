import { env } from "@/app/env.mjs";
import { db } from "@/db/db";
import { gists } from "@/db/schema";
import { receiver } from "@/lib/messaging/receiver";
import { openai } from "@/lib/openai";
import { eq } from "drizzle-orm";
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

export async function GET(req: NextRequest) {
  const signature = req.headers.get("upstash-signature");

  if (!signature) {
    throw new Error("`Upstash-Signature` header is missing");
  }
  if (typeof signature !== "string") {
    throw new Error("`Upstash-Signature` header is not a string");
  }

  if (req.headers.get("content-type") != "application/json") {
    throw new Error("`Content-Type` must be a JSON");
  }

  const isValid = receiver.verify({
    signature,
    body: await req.text(),
    url: env.VERCEL_ENV === "development" ? undefined : new URL(req.url).href,
  });

  if (!isValid) {
    return new NextResponse("Invalid signature", {
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

  const gist = await db.query.gists.findFirst({
    where: eq(gists.id, requestData.data.gistId),
    columns: {
      id: true,
      text: true,
      name: true
    }
  });

  if (gist === undefined) {
    return new NextResponse("gist not found", {
      status: 404,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  if (gist.name === undefined) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `assign a filename to the following file contents. you must provide detailed reasoning in \`detailed_filename_choice_reasoning\`. Your response MUST be in the following format:
{
  "detailed_filename_choice_reasoning": string,
  "filename": string | null
}`,
      },
      {
        role: "user",
        content: gist.text
      }
    ],
  });

  if (completion.status !== 200) {
    // gen default name
  }

  const message = completion.data.choices[0].message?.content;

  if (message === undefined) {
    // gen default name
    return;
  }

  let rawResponse;

  try {
    rawResponse = JSON.parse(message);
  } catch {
    // gen default name
    return;
  }

  const aiData = await AIResponseObject.safeParseAsync(rawResponse);

  if (!aiData.success || aiData.data.filename === null) {
    // gen default name
    return;
  }

  return NextResponse.json({
    hello: "string",
  });
}
