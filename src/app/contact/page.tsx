export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">İletişim</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">Soruların, önerilerin veya geri bildirimlerin için bize ulaş.</p>

      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ad Soyad</label>
            <input type="text" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white" placeholder="Ad Soyad" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">E-posta</label>
            <input type="email" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white" placeholder="ornek@email.com" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Konu</label>
          <input type="text" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white" placeholder="Mesajınızın konusu" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Mesaj</label>
          <textarea rows={5} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-campus-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white" placeholder="Mesajınız..." />
        </div>
        <button type="submit" className="rounded-xl bg-campus-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-campus-700">
          Gönder
        </button>
      </form>

      <div className="mt-12 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-700">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Bize Ulaşın</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">📧 campusarchivee@gmail.com</p>
      </div>
    </div>
  );
}
