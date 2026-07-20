"use client";

import { useMemo, useState } from "react";

type Note = {
  id: string;
  title: string;
  description?: string;
  course_code?: string;
  file_url?: string;
  downloads?: number;
  profiles?: { full_name?: string };
};

export default function FilterableNotesList({ notes: initial }: { notes: Note[] }) {
  const [search, setSearch] = useState("");

  const notes = useMemo(() => {
    if (!search) return initial;
    const q = search.toLowerCase();
    return initial.filter((n) => {
      if (n.title.toLowerCase().includes(q)) return true;
      if (n.course_code?.toLowerCase().includes(q)) return true;
      if (n.description?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [initial, search]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Not başlığı veya ders kodu ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <p className="mb-3 text-xs text-zinc-400">
        {notes.length} / {initial.length} sonuç gösteriliyor
      </p>

      {notes.length === 0 && (
        <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">Filtreye uygun sonuç bulunamadı.</p>
      )}

      {notes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm dark:border-zinc-700 dark:hover:border-campus-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-lg bg-campus-50 px-2.5 py-1 text-xs font-medium text-campus-700 dark:bg-campus-800 dark:text-campus-200">
                  {n.course_code || "Genel"}
                </span>
                <span className="text-xs text-zinc-400">{n.downloads || 0} indirme</span>
              </div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{n.title}</h3>
              {n.description && <p className="mb-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{n.description}</p>}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-400 dark:border-zinc-700">
                <span>{n.profiles?.full_name || "Anonim"}</span>
                {n.file_url && (
                  <a href={n.file_url} target="_blank" className="font-medium text-campus-600 hover:text-campus-800 dark:text-campus-400">İndir</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
