"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/auth/login");

    await supabase.from("teammate_listings").insert({
      ...form,
      skills_needed: form.skills_needed.split(",").map((s) => s.trim()),
      author_id: user.id,
    });
    setOpen(false);
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
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Yeni İlan</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Başlık"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
          />
          <textarea
            placeholder="Projeni anlat..."
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.project_type}
              onChange={(e) => setForm({ ...form, project_type: e.target.value })}
              required
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
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
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
            />
          </div>
          <input
            type="text"
            placeholder="Gerekli yetenekler (virgülle ayır)"
            value={form.skills_needed}
            onChange={(e) => setForm({ ...form, skills_needed: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700"
            >
              Yayınla
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
