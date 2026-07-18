import { createClient } from "@/lib/supabase/server";
import UploadExam from "@/components/UploadExam";

export default async function ExamsPage(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("university, department").eq("id", user.id).single();
    profile = data;
  }

  let query = supabase.from("exams").select("*, profiles(full_name, university, department)");

  if (filter === "university" && profile?.university) {
    query = query.eq("university", profile.university);
  } else if (filter === "department" && profile?.department) {
    query = query.eq("department", profile.department);
  } else if (filter === "both" && profile?.university && profile?.department) {
    query = query.eq("university", profile.university).eq("department", profile.department);
  }

  const { data: exams } = await query.order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Çıkmış Sorular</h1>
          <p className="mt-2 text-zinc-500">Geçmiş yıllara ait sınav sorularını bul ve paylaş.</p>
        </div>
        <UploadExam />
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
            href={`/exams?filter=${f.key}`}
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

      {(!exams || exams.length === 0) && (
        <p className="py-12 text-center text-zinc-400">Bu filtrede soru bulunamadı.</p>
      )}

      {exams && exams.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-zinc-700">Ders</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Tür</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Yıl</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Yükleyen</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Üniversite</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-campus-700">{e.course_code}</div>
                    <div className="text-xs text-zinc-400">{e.course_name}</div>
                    {e.description && <div className="mt-0.5 text-xs text-zinc-400">{e.description}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-campus-50 px-3 py-1 text-xs font-medium text-campus-700">{e.type}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{e.year}</td>
                  <td className="px-5 py-4 text-xs text-zinc-500">{e.profiles?.full_name || "Anonim"}</td>
                  <td className="px-5 py-4 text-xs text-zinc-400">{e.university || e.profiles?.university || "-"}</td>
                  <td className="px-5 py-4">
                    {e.file_url ? (
                      <a href={e.file_url} target="_blank" className="text-sm font-medium text-campus-600 hover:text-campus-800">İndir</a>
                    ) : (
                      <span className="text-xs text-zinc-300">Dosya yok</span>
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
