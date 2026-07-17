import Link from "next/link";

const features = [
  {
    title: "Çıkmış Sorular",
    description: "Geçmiş yıllara ait sınav sorularını bul, paylaş ve düzenle.",
    href: "/exams",
    emoji: "📄",
  },
  {
    title: "Ders Notları",
    description: "Arkadaşlarınla notlarını paylaş, eksiklerini tamamla.",
    href: "/notes",
    emoji: "📝",
  },
  {
    title: "Mentorlük",
    description: "Üst sınıflardan birebir mentorlük al, kariyerine yön ver.",
    href: "/mentorship",
    emoji: "🎯",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <div className="mb-6 text-5xl">🎓</div>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Kampüs Arşivi&apos;ne Hoş Geldin
        </h1>
        <p className="mb-8 max-w-xl text-lg text-zinc-500">
          Çıkmış sorular, ders notları ve mentorlük desteğiyle akademik
          yolculuğunda yanında.
        </p>
        <div className="flex gap-4">
          <Link
            href="/exams"
            className="rounded-xl bg-campus-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-campus-700"
          >
            Hemen Başla
          </Link>
          <Link
            href="/mentorship"
            className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50"
          >
            Mentor Bul
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group rounded-2xl border border-zinc-200 p-6 transition-all hover:border-campus-200 hover:shadow-sm"
            >
              <span className="mb-3 block text-3xl">{f.emoji}</span>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-campus-700">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {f.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-campus-600 px-4 py-16 text-center text-white sm:py-20">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Sen de Katkıda Bulun
        </h2>
        <p className="mb-6 max-w-lg mx-auto text-campus-100">
          Kendi notlarını ve çıkmış sorularını paylaş, alt sınıflara yol göster.
        </p>
        <Link
          href="/profile"
          className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-campus-700 shadow-sm transition-all hover:bg-campus-50"
        >
          Hesap Oluştur
        </Link>
      </section>
    </div>
  );
}
