import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row">
        <p>© 2026 Kampüs Arşivi. Tüm hakları saklıdır.</p>
        <div className="flex gap-6">
          <Link href="/about" className="transition-colors hover:text-campus-600">
            Hakkında
          </Link>
          <Link href="/contact" className="transition-colors hover:text-campus-600">
            İletişim
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-campus-600">
            Gizlilik
          </Link>
        </div>
      </div>
    </footer>
  );
}
