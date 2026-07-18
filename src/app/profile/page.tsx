import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-campus-100 text-3xl font-bold text-campus-700">
          {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Profilim</h1>
        <p className="text-zinc-500">{user.email}</p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
