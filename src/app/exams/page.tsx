import { createClient } from "@/lib/supabase/server";
import UploadExam from "@/components/UploadExam";

function q(v: string | null | undefined) {
  return v ? `"${v.replace(/"/g, '""')}"` : "";
}

export default async function ExamsPage(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { university: string | null; department: string | null; faculty: string | null } | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("university, department, faculty").eq("id", user.id).single();
    profile = data;
  }

  let query = supabase.from("exams").select("*, profiles(full_name, university, department)");

  // Görünürlük: kullanıcının görmesi gerekenler
  if (user && profile?.university) {
    const orConds = ["visibility.eq.all"];
    orConds.push(`and(visibility.eq.university,university.eq.${q(profile.university)})`);
    if (profile.faculty) {
      orConds.push(`and(visibility.eq.faculty,faculty.eq.${q(profile.faculty)})`);
    }
    if (profile.department) {
      orConds.push(`and(visibility.eq.department,department.eq.${q(profile.department)})`);
    }
    query = query.or(orConds.join(","));
  } else {
    query = query.eq("visibility", "all");
  }

  // Ek filtre (kullanıcının seçtiği)
  if (filter === "university" && profile?.university) {
    query = query.eq("university", profile.university);
  } else if (filter === "faculty" && profile?.faculty) {
    query = query.eq("faculty", profile.faculty);
  } else if (filter === "department" && profile?.department) {
    query = query.eq("department", profile.department);
  }

  const { data: exams } = await query.order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Çıkmış Sorular</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Geçmiş yıllara ait sınav sorularını bul ve paylaş.</p>
        </div>
        <UploadExam />
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
            href={`/exams?filter=${f.key}`}
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

      {(!exams || exams.length === 0) && (
        <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">Henüz içerik yok.</p>
      )}

      {exams && exams.length > 0 && (
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
              {exams.map((e: any) => (
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
