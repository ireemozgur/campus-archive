"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/upload";
import { useState } from "react";

export default function CreateListingButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    project_type: "",
    skills_needed: "",
    team_size: 2,
    listing_type: "ekip",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/auth/login");

    let image_url: string | null = null;
    if (file) {
      try {
        image_url = await uploadFile(file, "listings");
      } catch (err: any) {
        alert("Fotoğraf yüklenemedi: " + err.message);
        setUploading(false);
        return;
      }
    }

    await supabase.from("teammate_listings").insert({
      title: form.title,
      description: form.description,
      project_type: form.project_type,
      skills_needed: form.skills_needed.split(",").map((s) => s.trim()),
      team_size: form.team_size,
      listing_type: form.listing_type,
      image_url,
      author_id: user.id,
    });
    setOpen(false);
    setUploading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700"
      >
        İlan Oluştur
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl dark:bg-[#1e293b]">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Yeni İlan</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 rounded-xl border border-zinc-200 p-1 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setForm({ ...form, listing_type: "ekip" })}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${form.listing_type === "ekip" ? "bg-campus-600 text-white" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
            >
              🤝 Ekip
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, listing_type: "topluluk" })}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${form.listing_type === "topluluk" ? "bg-campus-600 text-white" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
            >
              👥 Topluluk
            </button>
          </div>

          <input
            type="text"
            placeholder="Başlık"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
          />
          <textarea
            placeholder={form.listing_type === "ekip" ? "Projeni anlat..." : "Topluluğunu anlat..."}
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.project_type}
              onChange={(e) => setForm({ ...form, project_type: e.target.value })}
              required
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            >
              <option value="">Proje Türü</option>
              <option>Web</option>
              <option>Mobile</option>
              <option>Yapay Zeka</option>
              <option>Oyun</option>
              <option>Embedded</option>
              <option>Diğer</option>
            </select>
            <input
              type="number"
              placeholder="Takım boyutu"
              min={2}
              value={form.team_size}
              onChange={(e) => setForm({ ...form, team_size: +e.target.value })}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Gerekli yetenekler (virgülle ayır)"
            value={form.skills_needed}
            onChange={(e) => setForm({ ...form, skills_needed: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
          />

          {/* Fotoğraf yükleme */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 p-4 text-center hover:border-campus-400 transition-colors dark:border-zinc-600">
            {file ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🖼️</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{file.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📷</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Fotoğraf ekle (opsiyonel)</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700 disabled:opacity-50"
            >
              {uploading ? "Yükleniyor..." : "Yayınla"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
