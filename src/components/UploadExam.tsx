"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/upload";
import { useRouter } from "next/navigation";

export default function UploadExam() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ course_code: "", course_name: "", year: "", type: "Vize" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Yıl (2025)" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500">
              <option>Vize</option><option>Final</option><option>Bütünleme</option>
            </select>
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
