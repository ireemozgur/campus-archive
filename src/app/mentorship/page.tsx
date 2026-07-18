import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MentorshipPage() {
  const supabase = await createClient();
  const { data: mentors } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_mentor", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Mentorlük</h1>
        <p className="mt-2 text-zinc-500">Gönüllü mentörlere soru sor, üst sınıflardan destek al.</p>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-200 p-6">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900">Mentorlük Nasıl İşler?</h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-500">
          Profilinde &quot;Gönüllü mentör&quot; seçeneğini işaretleyen öğrenciler burada listelenir.
          İhtiyacın olan alandaki mentöre mesaj gönderebilirsin.
        </p>
        <Link
          href="/profile"
          className="inline-block rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700"
        >
          Mentör Olmak İstiyorum
        </Link>
      </div>

      {(!mentors || mentors.length === 0) && (
        <p className="text-center text-zinc-400 py-12">Henüz gönüllü mentör yok. İlk mentör sen ol!</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mentors?.map((m) => (
          <div key={m.id} className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-campus-100 text-sm font-bold text-campus-700">
                {m.full_name?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{m.full_name || "İsimsiz"}</h3>
                <p className="text-xs text-zinc-400">{m.department || "Bölüm belirtilmemiş"}</p>
              </div>
            </div>
            <p className="mb-1 text-sm text-zinc-500">
              {m.university && <span className="text-xs text-zinc-400">{m.university} · {m.grade || ""}</span>}
            </p>
            {m.mentor_bio && (
              <p className="mb-3 text-sm text-zinc-600 line-clamp-2">{m.mentor_bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
