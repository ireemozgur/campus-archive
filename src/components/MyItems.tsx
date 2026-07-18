"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Item = {
  id: string;
  type: "ilan" | "sinav" | "not";
  title: string;
  subtitle: string;
  created_at: string;
};

export default function MyItems({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string, type: string) {
    if (!confirm("Silmek istediğine emin misin?")) return;
    setDeleting(id);
    const supabase = createClient();
    const table = type === "ilan" ? "teammate_listings" : type === "sinav" ? "exams" : "notes";
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert("Silinemedi: " + error.message);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
    setDeleting(null);
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-700">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Yüklediklerim</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-700">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">{item.type === "ilan" ? "📋 İlan" : item.type === "sinav" ? "📄 Sınav" : "📝 Not"}</span>
                <span className="text-xs text-zinc-300 dark:text-zinc-600">{new Date(item.created_at).toLocaleDateString("tr-TR")}</span>
              </div>
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{item.title}</p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{item.subtitle}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id, item.type)}
              disabled={deleting === item.id}
              className="ml-3 shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              {deleting === item.id ? "..." : "Sil"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
