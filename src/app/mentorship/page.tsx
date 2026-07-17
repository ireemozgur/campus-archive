const mentors = [
  { name: "Ayşe Yılmaz", department: "Bilgisayar Mühendisliği", year: "4. Sınıf", topics: "Yapay Zeka, Kariyer", rating: 4.9 },
  { name: "Ali Demir", department: "Elektrik-Elektronik Müh.", year: "4. Sınıf", topics: "Gömülü Sistemler", rating: 4.7 },
  { name: "Zeynep Çelik", department: "Bilgisayar Mühendisliği", year: "3. Sınıf", topics: "Web Geliştirme", rating: 4.8 },
  { name: "Can Öz", department: "Makine Mühendisliği", year: "4. Sınıf", topics: "Sayısal Analiz", rating: 4.5 },
];

export default function MentorshipPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Mentorlük</h1>
        <p className="mt-2 text-zinc-500">
          Üst sınıflardan mentorlük al, deneyimlerinden faydalan.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-200 p-6">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900">
          Mentorlük Nasıl İşler?
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-500">
          İhtiyacın olan alandaki mentörü seç, randevu al ve birebir görüşme
          yap. Kariyer planlaması, ders çalışma teknikleri veya teknik konularda
          destek al.
        </p>
        <button className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
          Mentor Başvurusu Yap
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-campus-100 text-sm font-bold text-campus-700">
                {m.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{m.name}</h3>
                <p className="text-xs text-zinc-400">{m.department}</p>
              </div>
              <span className="ml-auto text-sm text-amber-500">⭐ {m.rating}</span>
            </div>
            <p className="mb-2 text-sm text-zinc-500">
              <span className="font-medium text-zinc-700">{m.year}</span> — {m.topics}
            </p>
            <button className="mt-1 text-sm font-medium text-campus-600 hover:text-campus-800">
              Randevu Al →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
