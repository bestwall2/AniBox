"use server";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const url = "https://grok.dairoot.cn/rest/app-chat/conversations/new";

    const headers = {
      "accept": "*/*",
      "content-type": "application/json",
      "user-agent": "Next.js Proxy",
    };

    const body = JSON.stringify({
      temporary: false,
      modelName: "grok-3",
      message,
      fileAttachments: [],
      imageAttachments: [],
      disableSearch: false,
      enableImageGeneration: true,
      returnImageBytes: false,
      returnRawGrokInXaiRequest: false,
      enableImageStreaming: true,
      imageGenerationCount: 2,
      forceConcise: false,
      toolOverrides: {},
      enableSideBySide: false,
      sendFinalMetadata: true,
      customPersonality: "",
      isReasoning: false,
      webpageUrls: [],
      disableTextFollowUps: true,
      disableArtifact: false,
      responseMetadata: {
        isMozart: false,
      },
    });

    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const text = await res.text();

    // Parse JSON or plain text (in case response is not valid JSON)
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error sending message to Grok:", error);
    return NextResponse.json(
      { error: "Failed to send message to Grok" },
      { status: 500 }
    );
  }
}