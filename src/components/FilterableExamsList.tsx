"use client";

import { useMemo, useState } from "react";

type Exam = {
  id: string;
  course_code: string;
  course_name: string;
  year: string;
  type: string;
  description?: string;
  file_url?: string;
  university?: string;
  profiles?: { full_name?: string; university?: string };
};

export default function FilterableExamsList({ exams: initial }: { exams: Exam[] }) {
  const [search, setSearch] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const exams = useMemo(() => {
    return initial.filter((e) => {
      if (search) {
        const q = search.toLowerCase();
        if (!e.course_code.toLowerCase().includes(q) && !e.course_name.toLowerCase().includes(q)) return false;
      }
      if (typeFilter && e.type !== typeFilter) return false;
      if (yearFrom && e.year && parseInt(e.year) < parseInt(yearFrom)) return false;
      if (yearTo && e.year && parseInt(e.year) > parseInt(yearTo)) return false;
      return true;
    });
  }, [initial, search, yearFrom, yearTo, typeFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Ders kodu veya adı ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        >
          <option value="">Tüm Türler</option>
          <option>Vize</option>
          <option>Final</option>
          <option>Bütünleme</option>
        </select>
        <input
          type="number"
          placeholder="Yıl başlangıç"
          value={yearFrom}
          onChange={(e) => setYearFrom(e.target.value)}
          className="w-[130px] rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
        <input
          type="number"
          placeholder="Yıl bitiş"
          value={yearTo}
          onChange={(e) => setYearTo(e.target.value)}
          className="w-[130px] rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <p className="mb-3 text-xs text-zinc-400">
        {exams.length} / {initial.length} sonuç gösteriliyor
      </p>

      {exams.length === 0 && (
        <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">Filtreye uygun sonuç bulunamadı.</p>
      )}

      {exams.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Ders</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tür</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Yıl</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Yükleyen</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Üniversite</th>
                <th className="px-5 py-3 font-semibold text-zinc-700 dark:text-zinc-300">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-campus-700 dark:text-campus-400">{e.course_code}</div>
                    <div className="text-xs text-zinc-400">{e.course_name}</div>
                    {e.description && <div className="mt-0.5 text-xs text-zinc-400">{e.description}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-campus-50 px-3 py-1 text-xs font-medium text-campus-700 dark:bg-campus-800 dark:text-campus-200">{e.type}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400">{e.year}</td>
                  <td className="px-5 py-4 text-xs text-zinc-500">{e.profiles?.full_name || "Anonim"}</td>
                  <td className="px-5 py-4 text-xs text-zinc-400">{e.university || e.profiles?.university || "-"}</td>
                  <td className="px-5 py-4">
                    {e.file_url ? (
                      <a href={e.file_url} target="_blank" className="text-sm font-medium text-campus-600 hover:text-campus-800 dark:text-campus-400 dark:hover:text-campus-300">İndir</a>
                    ) : (
                      <span className="text-xs text-zinc-300 dark:text-zinc-600">Dosya yok</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
