"use server";

// File: /app/api/ep-servers/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Original episode URL (no proxy)
    const episodeUrl = "https://wb.animeluxe.org/episodes/sanda-الحلقة-1/";

    // ReqBin payload
    const reqBinPayload = {
      id: "0",
      parentId: "0",
      histKey: "",
      name: "",
      changed: true,
      errors: "",
      json: JSON.stringify({
        method: "GET",
        url: episodeUrl,
        apiNode: "US",
        contentType: "",
        headers: "",
        errors: "",
        curlCmd: "",
        codeCmd: "",
        jsonCmd: "",
        xmlCmd: "",
        lang: "",
        auth: {
          auth: "noAuth",
          bearerToken: "",
          basicUsername: "",
          basicPassword: "",
          customHeader: "",
          encrypted: "",
        },
        compare: false,
        idnUrl: episodeUrl,
      }),
      sessionId: 1764376141051,
      deviceId: "9ae63925-24b3-41be-aa21-25d9a5661ae4R",
    };

    // Send POST request to ReqBin
    const response = await fetch("https://apius.reqbin.com/api/v1/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBinPayload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `ReqBin request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ message: "No data returned from ReqBin." });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
