import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CreateListingButton from "./CreateListingButton";

export default async function TeammatesPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("teammate_listings")
    .select("*, profiles(full_name, department)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Ekip Arkadaşı Ara</h1>
          <p className="mt-2 text-zinc-500">
            Projene ortak bul, birlikte çalışacağın ekibi kur.
          </p>
        </div>
        <CreateListingButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings?.length === 0 && (
          <p className="col-span-full text-center text-zinc-400">
            Henüz ilan yok. İlk ilanı sen oluştur!
          </p>
        )}
        {listings?.map((listing) => (
          <div
            key={listing.id}
            className="rounded-2xl border border-zinc-200 p-5 transition-all hover:border-campus-200 hover:shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="rounded-lg bg-campus-50 px-2.5 py-1 text-xs font-medium text-campus-700">
                {listing.project_type}
              </span>
              {listing.is_active && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Aktif
                </span>
              )}
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900">{listing.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-zinc-500">{listing.description}</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {listing.skills_needed?.map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-400">
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
