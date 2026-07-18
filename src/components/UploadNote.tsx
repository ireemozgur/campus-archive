"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/upload";
import { useRouter } from "next/navigation";

export default function UploadNote() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", course_code: "", department: "" });
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

    const fileUrl = await uploadFile(file, "notes");
    await supabase.from("notes").insert({ ...form, author_id: user.id, file_url: fileUrl });

    setOpen(false);
    setUploading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
        Not Yükle
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Not Yükle</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Not Başlığı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
          <textarea placeholder="Kısa açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Ders Kodu" value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
            <input type="text" placeholder="Bölüm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
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
