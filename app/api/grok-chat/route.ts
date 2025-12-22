export const PATCH_URL = "https://www.npoint.io/documents/d97c2498562fa60d8693";
export const GET_URL = "https://api.npoint.io/d97c2498562fa60d8693";

// GET endpoint → fetch data from nPoint
export async function GET() {
  try {
    const res = await fetch(GET_URL);
    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST endpoint → send new data to nPoint
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const rawData = url.searchParams.get("data");

    if (!rawData) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing data param" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // تحويل البيانات المرسلة
    let parsed;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // إرسال PATCH إلى nPoint
    const res = await fetch(PATCH_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "x-csrf-token":
          "0NAYobk6OuwpOF4gPIqHjK5zHrMvaGuPgL665BjFu15Ihd8UlTgjUVI/zPJ1hlKgYE65GtMPFWxFLLcxUQcsdw==",
        accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        contents: JSON.stringify([parsed]), // تضيف البيانات الجديدة
        original_contents: "[]",
        schema: null,
        original_schema: "",
      }),
    });

    if (!res.ok) throw new Error("Failed to update nPoint");

    const responseData = await res.json();

    return new Response(
      JSON.stringify({ success: true, message: "Saved successfully", responseData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
