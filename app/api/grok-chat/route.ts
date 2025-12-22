export const dynamic = "force-dynamic";

// ====== CONFIG ======
const SHEET_API_URL = "https://www.sheetsdb.io/api/v1/getsheet"; // استخدم الرابط الفعلي بعد الإعداد
const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFobWVkLmRpa2hhMjZAZ21haWwuY29tIiwibmFtZSI6InNlcnZlciIsInJlZnJlc2hDb3VudCI6MCwiY3JlYXRlZE9uIjoiMjAyNS0xMi0yMlQyMTowMjoyMS42NjFaIn0.NAqEup1m6FP_cqJuAXbCsxs6agQ0GW7meCKVtp03h6A"; // استخدم التوكن الخاص بك
const SHEET_REF = "https://docs.google.com/spreadsheets/d/1AhwQd6nM7Gmn42hqs3pNgMmCF5PhQebNkUanvooMhtA/edit?usp=sharing";

// ====== GET ======
// جلب قيمة العمود A
export async function GET() {
  try {
    const res = await fetch(SHEET_API_URL, {
      method: "POST",
      headers: {
        Authorization: API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetRef: SHEET_REF,
        hasHeader: true,
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch sheet data");

    const json = await res.json();

    const value = json[0]?.A ?? "";

    return Response.json({
      success: true,
      data: value,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ====== PUT ======
// استبدال القيمة في العمود A
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.data) {
      return Response.json(
        { success: false, error: "data field is required" },
        { status: 400 }
      );
    }

    const res = await fetch(SHEET_API_URL, {
      method: "POST",
      headers: {
        Authorization: API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetRef: SHEET_REF,
        hasHeader: true,
        data: [
          {
            A: body.data,
          },
        ],
      }),
    });

    if (!res.ok) throw new Error("Failed to update sheet");

    return Response.json({
      success: true,
      message: "Data replaced successfully",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
