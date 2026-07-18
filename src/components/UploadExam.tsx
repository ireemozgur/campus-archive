"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/upload";
import { useRouter } from "next/navigation";

const visibilityOptions = [
  { value: "all", label: "Herkese Açık", desc: "Tüm öğrenciler görebilir" },
  { value: "university", label: "Sadece Kendi Üniversitem", desc: "Aynı üniversitedekiler görebilir" },
  { value: "department", label: "Sadece Kendi Bölümüm", desc: "Aynı bölümdekiler görebilir" },
  { value: "both", label: "Üniversitem + Bölümüm", desc: "Aynı üni ve bölümdekiler görebilir" },
];

export default function UploadExam() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    course_code: "", course_name: "", year: "", type: "Vize",
    description: "", university: "", department: "", visibility: "all",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("university, department").eq("id", user.id).single();
      if (profile) setForm((f) => ({ ...f, university: profile.university || "", department: profile.department || "" }));
    });
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/auth/login");

    const fileUrl = await uploadFile(file, "exams");
    await supabase.from("exams").insert({ ...form, author_id: user.id, file_url: fileUrl });
    setOpen(false);
    setUploading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
        Soru Yükle
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Çıkmış Soru Yükle</h2>
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

          {/* Görünürlük */}
          <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
            <p className="text-xs font-medium text-zinc-600">Kimler görebilsin?</p>
            {visibilityOptions.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-zinc-50">
                <input type="radio" name="visibility" value={opt.value} checked={form.visibility === opt.value} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-zinc-800">{opt.label}</p>
                  <p className="text-xs text-zinc-400">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-sm" />
          <button type="submit" disabled={uploading} className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700 disabled:opacity-50">
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>
        </form>
      </div>
    </>
  );
}
