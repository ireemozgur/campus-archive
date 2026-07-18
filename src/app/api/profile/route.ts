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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const body = await request.json();

  // Önce kullanıcıyı doğrula
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
  });
  if (!userRes.ok) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }
  const user = await userRes.json();

  // Service role ile Supabase client oluştur
  const supabase = createServerClient(supabaseUrl, serviceKey || anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    cookies: { getAll: () => [], setAll: () => {} },
  });

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: body.full_name || null,
    university: body.university || null,
    department: body.department || null,
    grade: body.grade || null,
    is_mentor: body.is_mentor || false,
    mentor_bio: body.mentor_bio || null,
  });

  if (error) {
    return NextResponse.json({ error: `Supabase: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
