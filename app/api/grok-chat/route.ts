export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://ovubovyckalyentrgahb.supabase.co";
const SUPABASE_KEY = "sb_publishable_D1BH-HDP_S_myTuLK_q0gg_LbWZ0g5K";
const TABLE = "serdata";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

/* ================= GET ================= */
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.1&select=data`,
      { headers }
    );

    if (!res.ok) throw new Error("Failed to fetch data");

    const json = await res.json();

    return Response.json({
      success: true,
      data: json[0]?.data ?? null,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ================= PUT (replace data in id=1) ================= */
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.data) {
      return Response.json(
        { success: false, error: "data is required" },
        { status: 400 }
      );
    }

    /* 1️⃣ حاول تحديث الصف id=1 */
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.1`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ data: body.data }),
      }
    );

    /* 2️⃣ إذا لم يكن الصف موجودًا → أنشئه */
    if (updateRes.status === 404 || updateRes.status === 406) {
      const insertRes = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify([{ id: 1, data: body.data }]),
        }
      );

      if (!insertRes.ok) throw new Error("Insert failed");
    }

    return Response.json({
      success: true,
      message: "Data saved in id=1",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
