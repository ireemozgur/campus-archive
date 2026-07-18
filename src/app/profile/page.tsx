import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: examCount } = await supabase
    .from("exams")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id);

  const { count: noteCount } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <ProfileView profile={profile} email={user.email || ""} stats={{ exams: examCount || 0, notes: noteCount || 0 }} />
    </div>
  );
}
