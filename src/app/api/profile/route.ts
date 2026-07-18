import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
  }

  const body = await request.json();

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: body.full_name,
    university: body.university,
    department: body.department,
    grade: body.grade,
    is_mentor: body.is_mentor,
    mentor_bio: body.mentor_bio,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
