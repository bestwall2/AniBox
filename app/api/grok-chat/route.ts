"use server";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ✅ Google Apps Script API endpoint (your working one)
    const sheetApiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiFimUVa3_3UVqe2vwZMzpPkOOKTzbR8Z4FQUEyGg6AMNKpd5UPIbkty-YmhgSViGrdyVSU-WqblJ_VXvS-TEeflSPiK_3Db8b1kGX5MAUXKoHkHq5RYvBmQydN2sVXRKk9cxT-UznvrP9pPWb5S_XXL5f7rQVbZ95P5LlILOOpphrgg-zm1YFTZmFTEawMTc6FwmGqytSGp4oq7P0d0umIufbFf4U-ixyI6l4JFFregZ_sl4aQLXEJf2Bg5rXBGirtlhKboU7CCUaKnaiMdGWyk-4ieco7ik11GekM&lib=MpSXkmj9LuxY7Fljhye24KBPO_DWXebR_";

    // ✅ Fetch data from your Sheet API
    const res = await fetch(sheetApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Prevent caching to always get fresh data
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: "error", message: "Failed to fetch from Google Sheet" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // ✅ Return it directly to your frontend
    return NextResponse.json({
      status: "success",
      source: "google-sheet",
      data: data.data || [],
    });
  } catch (error) {
    console.error("Error fetching data from Google Sheet:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
