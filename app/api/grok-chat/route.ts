const SHEETY_URL =
  "https://api.sheety.co/cd425ccdc45111cd97f9d05d3316af2e/serverData/data";

/* ================= GET ================= */
export async function GET() {
  const res = await fetch(SHEETY_URL);
  const json = await res.json();

  // نعيد صف واحد فقط
  return new Response(
    JSON.stringify({
      success: true,
      data: json.data.length ? [json.data[0]] : [],
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

/* ================= POST (REPLACE) ================= */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("data");
  if (!raw) {
    return Response.json({ success: false, error: "Missing data" }, { status: 400 });
  }

  const newData = JSON.parse(raw);

  // 1️⃣ جلب الصف الحالي
  const oldRes = await fetch(SHEETY_URL);
  const oldJson = await oldRes.json();

  // 2️⃣ لو لا يوجد صف → أنشئ واحد
  if (!oldJson.data.length) {
    const create = await fetch(SHEETY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newData }),
    });

    const created = await create.json();
    return Response.json({ success: true, data: [created.data] });
  }

  // 3️⃣ لو يوجد صف → استبدله
  const rowId = oldJson.data[0].id;

  const update = await fetch(`${SHEETY_URL}/${rowId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: newData }),
  });

  const updated = await update.json();

  return Response.json({
    success: true,
    data: [updated.data],
  });
}
