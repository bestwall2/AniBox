const SHEETY_URL = "https://api.sheety.co/cd425ccdc45111cd97f9d05d3316af2e/serverData/data";

// GET → جلب العنصر الحالي
export async function GET() {
  try {
    const res = await fetch(SHEETY_URL);
    const json = await res.json(); // { data: [...] }

    // نأخذ العنصر الأول فقط إذا موجود
    const dataOnly = json.data.length ? json.data[0] : null;

    return new Response(JSON.stringify({
      success: true,
      data: dataOnly ? [dataOnly] : []
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
    // parsed يجب أن يكون بهذا الشكل:
    // { id, img, name, token, source }

    // جلب العنصر القديم لمعرفة الـ id
    const oldRes = await fetch(SHEETY_URL);
    const oldJson = await oldRes.json();

    const itemId = oldJson.data.length ? oldJson.data[0].id : null;

    const method = "PUT";
    const patchUrl = itemId ? `${SHEETY_URL}/${itemId}` : SHEETY_URL;

    const res = await fetch(patchUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: parsed })
    });

    const responseData = await res.json();

    return new Response(JSON.stringify({
      success: true,
      data: [responseData.data]
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
