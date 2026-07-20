"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [sent, setSent] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.endsWith(".edu.tr")) {
      return setError("Yalnızca üniversite e-posta adresleri (.edu.tr) ile kayıt yapılabilir.");
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) return setError(error.message);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">E-postanı Kontrol Et</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          <strong>{email}</strong> adresine doğrulama linki gönderdik.
          Linke tıklayarak hesabını aktifleştirebilirsin.
        </p>
        <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">Spam kutusunu da kontrol etmeyi unutma.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kayıt Ol</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        <strong>Üniversite e-postan (.edu.tr)</strong> ile kaydol, kaydını doğrula ve katkıda bulunmaya başla.
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ad Soyad</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-campus-400 dark:focus:ring-campus-800"
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Üniversite E-postası</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-campus-400 dark:focus:ring-campus-800"
            placeholder="ornek@gazi.edu.tr"
          />
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Sadece .edu.tr uzantılı e-postalar kabul edilir.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Şifre</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-campus-400 dark:focus:ring-campus-800"
            placeholder="En az 6 karakter"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700"
        >
          Kayıt Ol
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Zaten hesabın var mı?{" "}
        <Link href="/auth/login" className="font-medium text-campus-600 hover:text-campus-800 dark:text-campus-400 dark:hover:text-campus-300">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
