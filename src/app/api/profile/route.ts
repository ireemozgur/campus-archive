import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Kullanıcıyı doğrula
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
  });
  if (!userRes.ok) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }
  const user = await userRes.json();
  const body = await request.json();

  // RPC çağrısı (anon key ile, RLS politikaları çalışır)
  const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/upsert_profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_id: user.id,
      p_full_name: body.full_name || null,
      p_university: body.university || null,
      p_department: body.department || null,
      p_grade: body.grade || null,
      p_is_mentor: body.is_mentor || false,
      p_mentor_bio: body.mentor_bio || null,
    }),
  });

  if (!rpcRes.ok) {
    const err = await rpcRes.text();
    return NextResponse.json({ error: `Hata: ${err}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
