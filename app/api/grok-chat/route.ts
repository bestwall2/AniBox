export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://ovubovyckalyentrgahb.supabase.co";
const SUPABASE_KEY = "sb_publishable_D1BH-HDP_S_myTuLK_q0gg_LbWZ0g5K";
const TABLE_NAME = "serdata";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// ===== GET =====
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*`, {
      method: "GET",
      headers,
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    const json = await res.json();

    return new Response(JSON.stringify({
      success: true,
      data: json,
    }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), {
      status: 500,
    });
  }
}

// ===== PUT (Replace all data) =====
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.data) {
      return new Response(JSON.stringify({
        success: false,
        error: "data field is required",
      }), { status: 400 });
    }

    // 1️⃣ حذف كل الصفوف القديمة
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?`, {
      method: "DELETE",
      headers,
    });

    if (!deleteRes.ok) throw new Error("Failed to clear old data");

    // 2️⃣ إدخال البيانات الجديدة
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: "POST",
      headers,
      body: JSON.stringify([{ data: body.data }]),
    });

    if (!insertRes.ok) throw new Error("Failed to insert new data");

    return new Response(JSON.stringify({
      success: true,
      message: "Data replaced successfully",
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), { status: 500 });
  }
}
