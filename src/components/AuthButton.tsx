"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export default function AuthButton({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-full bg-campus-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-campus-700"
      >
        Giriş Yap
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="text-sm text-zinc-600 hover:text-campus-600">
        {user.email?.split("@")[0]}
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
      >
        Çıkış
      </button>
    </div>
  );
}
