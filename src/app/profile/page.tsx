export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-campus-100 text-3xl font-bold text-campus-700">
          K
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Profilim</h1>
        <p className="text-zinc-500">Hesabına giriş yap veya yeni hesap oluştur.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-zinc-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Giriş Yap</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">E-posta</label>
            <input
              type="email"
              className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
              placeholder="ornek@universite.edu.tr"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Şifre</label>
            <input
              type="password"
              className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 focus:ring-2 focus:ring-campus-100"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full rounded-xl bg-campus-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
            Giriş Yap
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-zinc-500">
        Hesabın yok mu?{" "}
        <button className="font-medium text-campus-600 hover:text-campus-800">
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}
