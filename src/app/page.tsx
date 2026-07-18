import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const features = [
  { title: "Çıkmış Sorular", description: "Geçmiş yıllara ait sınav sorularını bul, paylaş.", href: "/exams", emoji: "📄" },
  { title: "Ders Notları", description: "Arkadaşlarınla notlarını paylaş, eksiklerini tamamla.", href: "/notes", emoji: "📝" },
  { title: "Mentorlük", description: "Gönüllü mentörlere soru sor, üst sınıflardan destek al.", href: "/mentorship", emoji: "🎯" },
  { title: "Ekip Arkadaşı Bul", description: "Projene ortak bul, birlikte çalışacağın ekibi kur.", href: "/teammates", emoji: "🤝" },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: leaders } = await supabase.from("leaderboard").select("*").limit(5);
  const { data: teamPostsRaw } = await supabase
    .from("teammate_listings")
    .select("id, title, project_type, skills_needed, team_size, profiles(full_name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);
const teamPosts: any[] = (teamPostsRaw as any) || [];

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <div className="mb-6 text-5xl">🎓</div>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
          Kampüs Arşivi&apos;ne Hoş Geldin
        </h1>
        <p className="mb-8 max-w-xl text-lg text-zinc-500 dark:text-zinc-300">
          Çıkmış sorular, ders notları ve mentorlük desteğiyle akademik yolculuğunda yanında.
        </p>
        <div className="flex gap-4">
          <Link href="/exams" className="rounded-xl bg-campus-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-campus-700">
            Hemen Başla
          </Link>
          <Link href="/mentorship" className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Mentor Bul
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="group rounded-2xl border border-zinc-200 p-6 transition-all hover:border-campus-200 hover:shadow-sm dark:border-zinc-700 dark:hover:border-campus-700">
              <span className="mb-3 block text-3xl">{f.emoji}</span>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-campus-700 dark:text-white dark:group-hover:text-campus-400">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {teamPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold dark:text-white">🤝 Topluluk Ekip Arıyor</h2>
            <Link href="/teammates" className="text-sm font-medium text-campus-600 hover:text-campus-700 dark:text-campus-400">
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {teamPosts.map((post) => (
              <Link
                key={post.id}
                href="/teammates"
                className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm dark:border-zinc-700 dark:hover:border-campus-700"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-lg bg-campus-50 px-2.5 py-1 text-xs font-medium text-campus-700 dark:bg-campus-800 dark:text-campus-200">
                    {post.project_type}
                  </span>
                  {post.team_size && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{post.team_size} kişi</span>
                  )}
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{post.title}</h3>
                {post.skills_needed && post.skills_needed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.skills_needed.slice(0, 3).map((s: string) => (
                      <span key={s} className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{s}</span>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">{post.profiles?.full_name || "Anonim"}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {leaders && leaders.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <h2 className="mb-8 text-2xl font-bold text-center dark:text-white">🏆 Kampüs Liderleri</h2>
          <div className="mx-auto max-w-2xl space-y-3">
            {leaders.map((l, i) => (
              <div key={l.id} className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 transition-all hover:border-amber-200 hover:shadow-sm dark:border-zinc-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white bg-gradient-to-br from-amber-400 to-amber-600">
                  {i + 1}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-campus-100 text-sm font-bold text-campus-700 dark:bg-campus-800 dark:text-campus-200">
                  {l.full_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900 truncate dark:text-white">{l.full_name || "Anonim"}</p>
                  <p className="text-xs text-zinc-400 truncate">{l.university || ""} {l.department ? `· ${l.department}` : ""}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold text-amber-600">{l.total_uploads}</p>
                  <p className="text-xs text-zinc-400">paylaşım</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-campus-600 px-4 py-16 text-center text-white sm:py-20">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Sen de Katkıda Bulun</h2>
        <p className="mb-6 mx-auto max-w-lg text-campus-100">Kendi notlarını ve çıkmış sorularını paylaş, liderlik tablosuna gir.</p>
        <Link href="/profile" className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-campus-700 shadow-sm transition-all hover:bg-campus-50">
          Hesap Oluştur
        </Link>
      </section>
    </div>
  );
}
