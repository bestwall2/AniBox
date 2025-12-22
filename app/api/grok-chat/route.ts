"use server";

let savedJSON: any = null; // in-memory JSON storage

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data || typeof data !== "object") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "JSON body is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    savedJSON = data;

    return new Response(
      JSON.stringify({
        success: true,
        message: "JSON saved successfully",
        data: savedJSON,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      data: savedJSON,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
