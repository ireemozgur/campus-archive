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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) return setError(error.message);
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">Kayıt Ol</h1>
      <p className="mb-8 text-zinc-500">Öğrenci hesabınla kaydol, katkıda bulunmaya başla.</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Ad Soyad</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
            placeholder="ornek@universite.edu.tr"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Şifre</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
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

      <p className="mt-6 text-center text-sm text-zinc-500">
        Zaten hesabın var mı?{" "}
        <Link href="/auth/login" className="font-medium text-campus-600 hover:text-campus-800">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
