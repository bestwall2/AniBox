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
      "authority": "grok.dairoot.cn",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "baggage":
        "sentry-environment=production,sentry-release=lNyyNzeKazl-tcWj3PYF6,sentry-public_key=b311e0f2690c81f25e2c4cf6d4f7ce1c,sentry-trace_id=2122298b999f43b4a71dba18b30aa425,sentry-sample_rate=0,sentry-sampled=false",
      "content-type": "application/json",
      "cookie":
        "user-gateway-token=random-8WKXFIjeni222l94y1MDw8CM3BFLm3mO; i18nextLng=en; cf_clearance=wi7LplTc0bGQ.oeJ5da7AIlTDv9kcP.whNEkwj28brE-1749802564-1.2.1.1-tEvIA3vJN1hiz75mapKnWFIv5lcQQD7Cd5oRo9rRfCw4I6l3iP83GVSU6aVzNYhUwfqHZT_ijyn7hgDRLcTKq36WcxXu6kphGZYOb86kJhDpSd1Z80MgGKnTn.d894iuYuqPMXowtWIMZEn7_lkhJxwNvxxKayTUhw.ZbLgT37QjfDVt16PcNuB__ZvmAV9XmOFqx1CbkJ6TZM_LH.L2u_u8jPjE5Garp0V1RsvzzEFCf5u3GalgjaJ76tffVWdHTITMIZV_Q2Xc0365X_GUuweo9w9iambmxDWFf5Fv17OxuicpI1iw9HwHNsFdlDzr91uVwbgxoy4r2SbFK_XoXZeI4hQe7F_UfBKln8qSDnE; _ga=GA1.1.70529051.1749802565; FCNEC=%5B%5B%22AKsRol8_o2pdY4WHxB0pfimQNplcdojS7WuEzH94uR5rU7nM50vEcvOizL7JF8LoSOQ-MfE_kz5C2WhkqZNI0xd-pCBasGhqagzG1xUmQ5yFHPfCW59_MDCbWZujJBpdIOQlFbx-rMqpHLsI6h_ZtZVqrvLc084LRA%3D%3D%22%5D%5D; __gads=ID=1574b2dde2d4618a:T=1749802559:RT=1749802559:S=ALNI_MaDstVBLTjVC_t9QtgDbYIq2nCY6g; __gpi=UID=0000111e8098561f:T=1749802559:RT=1749802559:S=ALNI_MZ0c5OcV6hrLHNr1GhWODi1-5Mm3w; __eoi=ID=7afbb4ef326b63ec:T=1749802559:RT=1749802559:S=AA-AfjbmGYpYBA3q3qd4pZvyGXMY; _ga_8FEWB057YH=GS2.1.s1749802565$o1$g0$t1749802600$j25$l0$h0",
      "origin": "https://grok.dairoot.cn",
      "referer": "https://grok.dairoot.cn/",
      "sec-ch-ua": `"Chromium";v="137", "Not/A)Brand";v="24"`,
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": `"Android"`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sentry-trace": "2122298b999f43b4a71dba18b30aa425-ac8dfd379a398411-0",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      "x-statsig-id":
        "g8e02+v7GtvcijKvklp4YKZlRe3D8iAn12jvejSP/x2TAFF7fDh0ry/iALgpKTTASHv5f4AJOCa4cmFZjrY2I3V3umjrgA",
      "x-xai-request-id": "81e8be11-5b68-4788-a457-732cfee05aef",
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