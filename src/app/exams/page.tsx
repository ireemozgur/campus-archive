const exams = [
  { code: "BLM101", name: "Algoritma ve Programlama", year: "2025", type: "Vize" },
  { code: "BLM201", name: "Veri Yapıları", year: "2025", type: "Final" },
  { code: "BLM301", name: "İşletim Sistemleri", year: "2024", type: "Bütünleme" },
  { code: "BLM102", name: "Lineer Cebir", year: "2025", type: "Vize" },
  { code: "BLM202", name: "Nesne Yönelimli Programlama", year: "2024", type: "Final" },
  { code: "BLM302", name: "Yapay Zeka", year: "2025", type: "Vize" },
];

export default function ExamsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Çıkmış Sorular</h1>
        <p className="mt-2 text-zinc-500">
          Geçmiş yıllara ait sınav sorularını bul ve paylaş.
        </p>
      </div>

      <div className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Ders kodu veya adı ile ara..."
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
        />
        <select className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500">
          <option>Tümü</option>
          <option>Vize</option>
          <option>Final</option>
          <option>Bütünleme</option>
        </select>
        <button className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
          Soru Yükle
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-5 py-3 font-semibold text-zinc-700">Ders Kodu</th>
              <th className="px-5 py-3 font-semibold text-zinc-700">Ders Adı</th>
              <th className="px-5 py-3 font-semibold text-zinc-700">Yıl</th>
              <th className="px-5 py-3 font-semibold text-zinc-700">Tür</th>
              <th className="px-5 py-3 font-semibold text-zinc-700">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {exams.map((e, i) => (
              <tr key={i} className="hover:bg-zinc-50">
                <td className="px-5 py-4 font-medium text-campus-700">{e.code}</td>
                <td className="px-5 py-4 text-zinc-700">{e.name}</td>
                <td className="px-5 py-4 text-zinc-500">{e.year}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-campus-50 px-3 py-1 text-xs font-medium text-campus-700">
                    {e.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-sm font-medium text-campus-600 hover:text-campus-800">
                    İndir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
