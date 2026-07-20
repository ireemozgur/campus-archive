import { createClient } from "@/lib/supabase/server";
import UploadNote from "@/components/UploadNote";

export default async function NotesPage(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { university: string | null; department: string | null; faculty: string | null } | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("university, department, faculty").eq("id", user.id).single();
    profile = data;
  }

  let query = supabase.from("notes").select("*, profiles(full_name, university, department)");

  // Önce herkese açık olanları göster
  query = query.eq("visibility", "all");

  if (filter === "university" && profile?.university) {
    query = query.eq("university", profile.university);
  } else if (filter === "faculty" && profile?.faculty) {
    query = query.eq("faculty", profile.faculty);
  } else if (filter === "department" && profile?.department) {
    query = query.eq("department", profile.department);
  }

  const { data: notes, error } = await query.order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Notlar</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Arkadaşlarının paylaştığı notlara göz at, sen de paylaş.</p>
        </div>
        <UploadNote />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "all", label: "Tümü" },
          { key: "university", label: "Kendi Üniversitem" },
          { key: "faculty", label: "Kendi Fakültem" },
          { key: "department", label: "Kendi Bölümüm" },
        ].map((f) => (
          <a
            key={f.key}
            href={`/notes?filter=${f.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-campus-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-500">Sorgu hatası: {error.message}</p>}

      {(!notes || notes.length === 0) && (
        <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">Henüz içerik yok.</p>
      )}

      {notes && notes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n: any) => (
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
