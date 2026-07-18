"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  full_name: string | null;
  university: string | null;
  department: string | null;
  grade: string | null;
  is_mentor: boolean;
  mentor_bio: string | null;
};

export default function ProfileView({ profile, email, stats }: { profile: Profile | null; email: string; stats: { exams: number; notes: number } }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    university: profile?.university || "",
    department: profile?.department || "",
    grade: profile?.grade || "",
    is_mentor: profile?.is_mentor || false,
    mentor_bio: profile?.mentor_bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = (await import("@/lib/supabase/client")).createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage("Hata: " + data.error);
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(false);
    setMessage("✅ Profil kaydedildi!");
    setTimeout(() => setMessage(""), 3000);
    router.refresh();
  }

  const handleLogout = async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!editing) {
    return (
      <div>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-campus-100 text-3xl font-bold text-campus-700">
            {profile?.full_name?.charAt(0) || email.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">{profile?.full_name || "Profilim"}</h1>
          <p className="text-zinc-500">{email}</p>
        </div>

        <div className="mb-6 rounded-2xl border border-zinc-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Bilgiler</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-sm text-zinc-500">Ad Soyad</span>
              <span className="text-sm font-medium text-zinc-800">{profile?.full_name || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-sm text-zinc-500">Üniversite</span>
              <span className="text-sm font-medium text-zinc-800">{profile?.university || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-sm text-zinc-500">Bölüm</span>
              <span className="text-sm font-medium text-zinc-800">{profile?.department || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-sm text-zinc-500">Sınıf</span>
              <span className="text-sm font-medium text-zinc-800">{profile?.grade || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-2">
              <span className="text-sm text-zinc-500">Mentör</span>
              <span className="text-sm font-medium text-zinc-800">{profile?.is_mentor ? "✅ Aktif" : "—"}</span>
            </div>
            {profile?.mentor_bio && (
              <div className="pt-2">
                <span className="text-sm text-zinc-500">Hakkında: </span>
                <span className="text-sm text-zinc-700">{profile.mentor_bio}</span>
              </div>
            )}
          </div>
          <button onClick={() => setEditing(true)} className="mt-4 w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
            Profili Düzenle
          </button>
          <button onClick={handleLogout} className="mt-2 w-full rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-200 p-5 text-center">
            <p className="text-2xl font-bold text-campus-700">{stats.exams}</p>
            <p className="text-xs text-zinc-500">Çıkmış Soru</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-5 text-center">
            <p className="text-2xl font-bold text-campus-700">{stats.notes}</p>
            <p className="text-xs text-zinc-500">Not</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-campus-100 text-3xl font-bold text-campus-700">
          {form.full_name?.charAt(0) || email.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Profili Düzenle</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-zinc-200 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Ad Soyad</label>
          <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Üniversite</label>
          <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" placeholder="Örn: Gazi Üniversitesi" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Bölüm</label>
            <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" placeholder="Bilgisayar Müh." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Sınıf</label>
            <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500">
              <option value="">Seçiniz</option>
              <option>1. Sınıf</option>
              <option>2. Sınıf</option>
              <option>3. Sınıf</option>
              <option>4. Sınıf</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4">
          <input type="checkbox" id="mentor" checked={form.is_mentor} onChange={(e) => setForm({ ...form, is_mentor: e.target.checked })} className="h-4 w-4 rounded border-zinc-300 text-campus-600" />
          <label htmlFor="mentor" className="text-sm text-zinc-700">Gönüllü mentör olmak istiyorum</label>
        </div>
        {form.is_mentor && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Mentorlük hakkında</label>
            <textarea value={form.mentor_bio} onChange={(e) => setForm({ ...form, mentor_bio: e.target.value })} rows={3} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500" placeholder="Hangi konularda yardımcı olabilirsin?" />
          </div>
        )}
        {message && <p className={`text-sm ${message.includes("Hata") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700 disabled:opacity-50">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
