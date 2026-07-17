import Link from "next/link";

export default function Header() {
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
          <Link
            href="/profile"
            className="rounded-full bg-campus-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-campus-700"
          >
            Giriş Yap
          </Link>
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
