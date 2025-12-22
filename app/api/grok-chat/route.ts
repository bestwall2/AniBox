"use server";

import { getStore } from "@netlify/blobs";

const store = getStore("my-data");
const BLOB_KEY = "data.json"; // اسم الملف الدائم

export async function POST(req: Request) {
  try {
    // قراءة data من query params
    const url = new URL(req.url);
    const rawData = url.searchParams.get("data");

    if (!rawData) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing data param" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // تحويل النص إلى JSON
    let parsedData;
    try {
      parsedData = JSON.parse(rawData);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // قراءة البيانات الحالية من Blob
    const currentData = (await store.get(BLOB_KEY, { type: "json" })) || [];

    // إضافة البيانات الجديدة
    currentData.push({
      id: Date.now(),
      ...parsedData,
    });

    // حفظ البيانات مرة أخرى في Blob
    await store.set(BLOB_KEY, currentData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "JSON saved successfully",
        data: currentData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const data = (await store.get(BLOB_KEY, { type: "json" })) || [];

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Failed to read data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
