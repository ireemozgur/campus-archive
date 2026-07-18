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

  // Kullanıcının kendi token'ı ile Supabase client
  const supabase = createServerClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser(token);
  if (userErr || !user) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }

  const body = await request.json();

  // Önce var mı kontrol et
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  let error;
  if (existing) {
    // Güncelle
    ({ error } = await supabase
      .from("profiles")
      .update({
        full_name: body.full_name || null,
        university: body.university || null,
        department: body.department || null,
        grade: body.grade || null,
        is_mentor: body.is_mentor || false,
        mentor_bio: body.mentor_bio || null,
      })
      .eq("id", user.id));
  } else {
    // Ekle
    ({ error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: body.full_name || null,
        university: body.university || null,
        department: body.department || null,
        grade: body.grade || null,
        is_mentor: body.is_mentor || false,
        mentor_bio: body.mentor_bio || null,
      }));
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
