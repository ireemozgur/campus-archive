import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";
import MyItems from "@/components/MyItems";

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

  const { data: myListings } = await supabase
    .from("teammate_listings")
    .select("id, title, project_type, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const { data: myExams } = await supabase
    .from("exams")
    .select("id, course_name, course_code, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const { data: myNotes } = await supabase
    .from("notes")
    .select("id, title, course_code, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const items = [
    ...(myListings || []).map((l) => ({
      id: l.id, type: "ilan" as const,
      title: l.title,
      subtitle: l.project_type || "",
      created_at: l.created_at,
    })),
    ...(myExams || []).map((e) => ({
      id: e.id, type: "sinav" as const,
      title: `${e.course_code} - ${e.course_name}`,
      subtitle: "Çıkmış sınav",
      created_at: e.created_at,
    })),
    ...(myNotes || []).map((n) => ({
      id: n.id, type: "not" as const,
      title: n.title,
      subtitle: n.course_code || "",
      created_at: n.created_at,
    })),
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="space-y-6">
        <ProfileView profile={profile} email={user.email || ""} stats={{ exams: examCount || 0, notes: noteCount || 0 }} />
        <MyItems items={items} />
      </div>
    </div>
  );
}
