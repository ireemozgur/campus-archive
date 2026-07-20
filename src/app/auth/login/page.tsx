"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Giriş Yap</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">Hesabına giriş yaparak devam et.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-campus-400 dark:focus:ring-campus-800"
            placeholder="ornek@universite.edu.tr"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-campus-400 dark:focus:ring-campus-800"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700"
        >
          Giriş Yap
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Hesabın yok mu?{" "}
        <Link href="/auth/register" className="font-medium text-campus-600 hover:text-campus-800 dark:text-campus-400 dark:hover:text-campus-300">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
