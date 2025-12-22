const SHEETY_URL = "https://api.sheety.co/cd425ccdc45111cd97f9d05d3316af2e/serverData/data";

// GET → جلب العنصر الحالي
export async function GET() {
  try {
    const res = await fetch(SHEETY_URL);
    const json = await res.json(); // { data: [...] }

    // أخذ العنصر الأول فقط إذا موجود
    const dataOnly = json.data.length ? { data: json.data[0].data } : null;

    return new Response(JSON.stringify({
      success: true,
      data: dataOnly
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST → استبدال العنصر الحالي بالبيانات الجديدة
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const rawData = url.searchParams.get("data");
    if (!rawData) throw new Error("Missing data param");

    const parsed = JSON.parse(rawData);

    // جلب العنصر القديم لمعرفة الـ id
    const oldRes = await fetch(SHEETY_URL);
    const oldJson = await oldRes.json();

    let itemId = oldJson.data.length ? oldJson.data[0].id : null;

    let method = itemId ? "PUT" : "POST";
    let patchUrl = itemId ? `${SHEETY_URL}/${itemId}` : SHEETY_URL;

    const res = await fetch(patchUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: parsed })
    });

    const responseData = await res.json();

    return new Response(JSON.stringify({
      success: true,
      data: responseData.data
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
