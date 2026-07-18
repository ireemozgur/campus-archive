import { NextResponse } from "next/server";

const SUPABASE_URL = "https://myssfqqrihcuijgnxrhs.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  // Kullanıcıyı doğrula
  const userRes = await supabaseFetch("/auth/v1/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }
  const user = await userRes.json();
  const body = await request.json();

  // Profil var mı kontrol et
  const checkRes = await supabaseFetch(
    `/rest/v1/profiles?id=eq.${user.id}&select=id`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const existing = checkRes.ok ? await checkRes.json() : [];

  let apiRes: Response;
  if (existing.length > 0) {
    // Güncelle
    apiRes = await supabaseFetch(`/rest/v1/profiles?id=eq.${user.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, Prefer: "return=minimal" },
      body: JSON.stringify({
        full_name: body.full_name || null,
        university: body.university || null,
        department: body.department || null,
        grade: body.grade || null,
        is_mentor: body.is_mentor || false,
        mentor_bio: body.mentor_bio || null,
      }),
    });
  } else {
    // Ekle
    apiRes = await supabaseFetch("/rest/v1/profiles", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Prefer: "return=minimal" },
      body: JSON.stringify({
        id: user.id,
        full_name: body.full_name || null,
        university: body.university || null,
        department: body.department || null,
        grade: body.grade || null,
        is_mentor: body.is_mentor || false,
        mentor_bio: body.mentor_bio || null,
      }),
    });
  }

  if (!apiRes.ok) {
    const err = await apiRes.text();
    return NextResponse.json({ error: `Hata: ${err}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
