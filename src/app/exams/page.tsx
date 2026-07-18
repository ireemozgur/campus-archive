import { createClient } from "@/lib/supabase/server";
import UploadExam from "@/components/UploadExam";

export default async function ExamsPage() {
  const supabase = await createClient();
  const { data: exams } = await supabase
    .from("exams")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Çıkmış Sorular</h1>
          <p className="mt-2 text-zinc-500">Geçmiş yıllara ait sınav sorularını bul ve paylaş.</p>
        </div>
        <UploadExam />
      </div>

      {(!exams || exams.length === 0) && (
        <p className="text-center text-zinc-400 py-12">Henüz soru yüklenmemiş. İlk soruyu sen yükle!</p>
      )}

      {exams && exams.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-5 py-3 font-semibold text-zinc-700">Ders Kodu</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Ders Adı</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Yıl</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Tür</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">Yükleyen</th>
                <th className="px-5 py-3 font-semibold text-zinc-700">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {exams.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="px-5 py-4 font-medium text-campus-700">{e.course_code}</td>
                  <td className="px-5 py-4 text-zinc-700">{e.course_name}</td>
                  <td className="px-5 py-4 text-zinc-500">{e.year}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-campus-50 px-3 py-1 text-xs font-medium text-campus-700">{e.type}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-400">{e.profiles?.full_name || "Anonim"}</td>
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
