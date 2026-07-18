import { createClient } from "@/lib/supabase/server";
import UploadNote from "@/components/UploadNote";

export default async function NotesPage(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("university, department").eq("id", user.id).single();
    profile = data;
  }

  let query = supabase.from("notes").select("*, profiles(full_name, university, department)");

  if (user && profile?.university) {
    const orConds = [
      "visibility.eq.all",
      `and(visibility.eq.university,university.eq.${profile.university})`,
    ];
    if (profile.department) {
      orConds.push(`and(visibility.eq.department,department.eq.${profile.department})`);
      orConds.push(`and(visibility.eq.both,university.eq.${profile.university},department.eq.${profile.department})`);
    }
    query = query.or(orConds.join(","));
  } else {
    query = query.eq("visibility", "all");
  }

  if (filter === "university" && profile?.university) {
    query = query.eq("university", profile.university);
  } else if (filter === "department" && profile?.department) {
    query = query.eq("department", profile.department);
  } else if (filter === "both" && profile?.university && profile?.department) {
    query = query.eq("university", profile.university).eq("department", profile.department);
  }

  const { data: notes } = await query.order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Notlar</h1>
          <p className="mt-2 text-zinc-500">Arkadaşlarının paylaştığı notlara göz at, sen de paylaş.</p>
        </div>
        <UploadNote />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "all", label: "Tümü" },
          { key: "university", label: "Kendi Üniversitem" },
          { key: "department", label: "Kendi Bölümüm" },
          { key: "both", label: "Üniversitem + Bölümüm" },
        ].map((f) => (
          <a
            key={f.key}
            href={`/notes?filter=${f.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-campus-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {(!notes || notes.length === 0) && (
        <p className="py-12 text-center text-zinc-400">Henüz içerik yok.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes?.map((n) => (
          <div key={n.id} className="group rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <span className="rounded-lg bg-campus-50 p-2 text-lg">📝</span>
              <span className="text-xs text-zinc-400">{n.page_count || "?"} sayfa</span>
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-campus-700">{n.title}</h3>
            <p className="text-xs text-zinc-400">{n.profiles?.full_name || "Anonim"}</p>
            {n.description && <p className="mb-2 mt-1 text-xs text-zinc-500 line-clamp-2">{n.description}</p>}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{n.university || n.profiles?.university || "-"}</span>
              <div className="flex gap-2">
                <span>⭐ {n.rating || 0}</span>
                {n.file_url && (
                  <a href={n.file_url} target="_blank" className="font-medium text-campus-600 hover:text-campus-800">Aç</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
