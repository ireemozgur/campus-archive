import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-campus-700">
          <span className="text-2xl">🎓</span>
          Kampüs Arşivi
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/exams" className="transition-colors hover:text-campus-600">
            Çıkmış Sorular
          </Link>
          <Link href="/notes" className="transition-colors hover:text-campus-600">
            Notlar
          </Link>
          <Link href="/mentorship" className="transition-colors hover:text-campus-600">
            Mentorlük
          </Link>
          <Link href="/teammates" className="transition-colors hover:text-campus-600">
            Ekip Ara
          </Link>
          <AuthButton user={user} />
          <ThemeToggle />
        </nav>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 sm:hidden">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
