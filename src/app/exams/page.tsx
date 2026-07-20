import { createClient } from "@/lib/supabase/server";
import UploadExam from "@/components/UploadExam";
import FilterableExamsList from "@/components/FilterableExamsList";

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

  const { data: allExams, error } = await supabase
    .from("exams")
    .select("*, profiles(full_name, university, department)")
    .order("created_at", { ascending: false });

  let exams = allExams || [];

  if (user && profile) {
    exams = exams.filter((e: any) => {
      // Kendi içeriklerin her zaman görünür
      if (e.author_id === user.id) return true;
      if (e.visibility === "all") return true;
      if (e.visibility === "university") return e.university && profile.university && e.university === profile.university;
      if (e.visibility === "faculty") return e.faculty && profile.faculty && e.faculty === profile.faculty;
      if (e.visibility === "department") return e.department && profile.department && e.department === profile.department;
      return false;
    });
  } else {
    exams = exams.filter((e: any) => e.visibility === "all");
  }

  if (filter === "university" && profile?.university) {
    exams = exams.filter((e: any) => e.university === profile.university);
  } else if (filter === "faculty" && profile?.faculty) {
    exams = exams.filter((e: any) => e.faculty === profile.faculty);
  } else if (filter === "department" && profile?.department) {
    exams = exams.filter((e: any) => e.department === profile.department);
  }

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

      {error && <p className="mb-4 text-sm text-red-500">Sorgu hatası: {error.message}</p>}

      {!user && (
        <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Üniversitene/fakültene özel içerikleri görmek için{' '}
          <a href="/auth/login" className="font-medium underline">giriş yap</a>.
        </p>
      )}

      {exams.length === 0 && (
        <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">Henüz içerik yok.</p>
      )}

      {exams.length > 0 && <FilterableExamsList exams={exams} />}
    </div>
  );
}
