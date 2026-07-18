import { createClient } from "@/lib/supabase/server";
import UploadNote from "@/components/UploadNote";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Notlar</h1>
          <p className="mt-2 text-zinc-500">Arkadaşlarının paylaştığı notlara göz at, sen de paylaş.</p>
        </div>
        <UploadNote />
      </div>

      {(!notes || notes.length === 0) && (
        <p className="text-center text-zinc-400 py-12">Henüz not yüklenmemiş. İlk notu sen yükle!</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes?.map((n) => (
          <div key={n.id} className="group cursor-pointer rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <span className="rounded-lg bg-campus-50 p-2 text-lg">📝</span>
              <span className="text-xs text-zinc-400">{n.page_count || "?"} sayfa</span>
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-campus-700">{n.title}</h3>
            <p className="mb-1 text-sm text-zinc-400">{n.profiles?.full_name || "Anonim"}</p>
            {n.description && <p className="mb-3 text-xs text-zinc-500 line-clamp-2">{n.description}</p>}
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>⭐ {n.rating || 0}</span>
              <span>📥 {n.downloads || 0}</span>
              {n.file_url && (
                <a href={n.file_url} target="_blank" className="text-xs font-medium text-campus-600 hover:text-campus-800">Aç</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
