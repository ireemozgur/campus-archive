const notes = [
  { title: "Algoritma ve Programlama Ders Notları", author: "Ahmet Y.", pageCount: 24, rating: 4.5, downloads: 128 },
  { title: "Veri Yapıları Özet", author: "Zeynep K.", pageCount: 18, rating: 4.8, downloads: 95 },
  { title: "Lineer Cebir Formüller", author: "Mehmet T.", pageCount: 6, rating: 4.2, downloads: 210 },
  { title: "İşletim Sistemleri Bütün Not", author: "Elif D.", pageCount: 32, rating: 4.6, downloads: 67 },
  { title: "Nesne Yönelimli Programlama Kısa Notlar", author: "Can B.", pageCount: 12, rating: 4.3, downloads: 156 },
];

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Notlar</h1>
          <p className="mt-2 text-zinc-500">
            Arkadaşlarının paylaştığı notlara göz at, sen de paylaş.
          </p>
        </div>
        <button className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
          Not Yükle
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n, i) => (
          <div
            key={i}
            className="group cursor-pointer rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="rounded-lg bg-campus-50 p-2 text-lg">📝</span>
              <span className="text-xs text-zinc-400">{n.pageCount} sayfa</span>
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-campus-700">
              {n.title}
            </h3>
            <p className="mb-3 text-sm text-zinc-400">{n.author}</p>
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>⭐ {n.rating}</span>
              <span>📥 {n.downloads}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
