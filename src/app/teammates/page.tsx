import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CreateListingButton from "./CreateListingButton";

export default async function TeammatesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const isCommunity = tab === "community";

  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("teammate_listings")
    .select("*, profiles(full_name, department)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {isCommunity ? "Topluluk Ara" : "Ekip Arkadaşı Ara"}
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {isCommunity
              ? "Kulüp ve topluluklara katıl, birlikte üret."
              : "Projene ortak bul, birlikte çalışacağın ekibi kur."}
          </p>
        </div>
        <CreateListingButton />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-zinc-200 p-1 dark:border-zinc-700">
        <Link
          href="/teammates"
          className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
            !isCommunity
              ? "bg-campus-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          🤝 Ekip Ara
        </Link>
        <Link
          href="/teammates?tab=community"
          className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
            isCommunity
              ? "bg-campus-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          👥 Topluluk Ara
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings?.length === 0 && (
          <p className="col-span-full text-center text-zinc-400 dark:text-zinc-500">
            Henüz ilan yok. İlk ilanı sen oluştur!
          </p>
        )}
        {listings?.map((listing) => (
          <div
            key={listing.id}
            className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm dark:border-zinc-700 dark:hover:border-campus-700"
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="rounded-lg bg-campus-50 px-2.5 py-1 text-xs font-medium text-campus-700 dark:bg-campus-800 dark:text-campus-200">
                {listing.project_type}
              </span>
              {listing.is_active && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Aktif
                </span>
              )}
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{listing.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{listing.description}</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {listing.skills_needed?.map((skill: string) => (
                <span key={skill} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-400 dark:border-zinc-700">
              <span>
                {listing.profiles?.full_name} · {listing.profiles?.department}
              </span>
              <span>{listing.applicants} başvuru</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
