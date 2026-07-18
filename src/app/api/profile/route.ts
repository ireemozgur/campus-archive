import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const body = await request.json();

  // Önce kullanıcıyı doğrula
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
  });
  if (!userRes.ok) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }
  const user = await userRes.json();

  // Upsert: POST + resolution=merge-duplicates ile
  const upsertRes = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
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

  if (!upsertRes.ok) {
    const errText = await upsertRes.text();
    console.error("Supabase upsert hatası:", upsertRes.status, errText);
    return NextResponse.json({ error: `Supabase (${upsertRes.status}): ${errText}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
