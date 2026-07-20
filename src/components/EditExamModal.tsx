"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const visibilityOptions = [
  { value: "all", label: "Herkese Açık", desc: "Tüm öğrenciler görebilir" },
  { value: "university", label: "Sadece Kendi Üniversitem", desc: "Aynı üniversitedekiler görebilir" },
  { value: "faculty", label: "Sadece Kendi Fakültem", desc: "Aynı fakültedekiler görebilir" },
  { value: "department", label: "Sadece Kendi Bölümüm", desc: "Aynı bölümdekiler görebilir" },
];

export default function EditExamModal({ examId, onClose }: { examId: string; onClose: () => void }) {
  const [form, setForm] = useState({
    course_code: "", course_name: "", year: "", type: "Vize",
    description: "", university: "", department: "", faculty: "", visibility: "all",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.from("exams").select("*").eq("id", examId).single().then(({ data, error }) => {
      if (error) setError("Yüklenemedi: " + error.message);
      else if (data) setForm({
        course_code: data.course_code || "",
        course_name: data.course_name || "",
        year: data.year || "",
        type: data.type || "Vize",
        description: data.description || "",
        university: data.university || "",
        department: data.department || "",
        faculty: data.faculty || "",
        visibility: data.visibility || "all",
      });
      setLoading(false);
    });
  }, [examId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateErr } = await supabase.from("exams").update(form).eq("id", examId);
    if (updateErr) {
      setError(updateErr.message);
      setSaving(false);
    } else {
      router.refresh();
      onClose();
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-[#1e293b]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sınavı Düzenle</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xl leading-none">&times;</button>
          </div>
          {loading ? (
            <p className="text-sm text-zinc-400">Yükleniyor...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Ders Kodu" value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
                <input type="text" placeholder="Ders Adı" value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
              </div>
              <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Yıl" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500">
                  <option>Vize</option><option>Final</option><option>Bütünleme</option>
                </select>
                <input type="text" placeholder="Bölüm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
              </div>
              <input type="text" placeholder="Üniversite" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />

              <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Kimler görebilsin?</p>
                {visibilityOptions.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <input type="radio" name="edit-visibility" value={opt.value} checked={form.visibility === opt.value} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{opt.label}</p>
                      <p className="text-xs text-zinc-400">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={saving} className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700 disabled:opacity-50">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
