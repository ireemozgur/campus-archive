"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Profile = {
  full_name: string | null;
  university: string | null;
  department: string | null;
  grade: string | null;
  is_mentor: boolean;
  mentor_bio: string | null;
};

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    university: profile?.university || "",
    department: profile?.department || "",
    grade: profile?.grade || "",
    is_mentor: profile?.is_mentor || false,
    mentor_bio: profile?.mentor_bio || "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-zinc-200 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Ad Soyad</label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Üniversite</label>
        <input
          type="text"
          value={form.university}
          onChange={(e) => setForm({ ...form, university: e.target.value })}
          className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
          placeholder="Örn: İstanbul Üniversitesi"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Bölüm</label>
          <input
            type="text"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
            placeholder="Bilgisayar Müh."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Sınıf</label>
          <select
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
          >
            <option value="">Seçiniz</option>
            <option>1. Sınıf</option>
            <option>2. Sınıf</option>
            <option>3. Sınıf</option>
            <option>4. Sınıf</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4">
        <input
          type="checkbox"
          id="mentor"
          checked={form.is_mentor}
          onChange={(e) => setForm({ ...form, is_mentor: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-300 text-campus-600"
        />
        <label htmlFor="mentor" className="text-sm text-zinc-700">
          Gönüllü mentör olmak istiyorum
        </label>
      </div>
      {form.is_mentor && (
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Mentorlük hakkında</label>
          <textarea
            value={form.mentor_bio}
            onChange={(e) => setForm({ ...form, mentor_bio: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500"
            placeholder="Hangi konularda yardımcı olabilirsin?"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700 disabled:opacity-50"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
