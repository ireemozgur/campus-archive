export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-zinc-900">Gizlilik Politikası</h1>
      <div className="space-y-4 text-zinc-600 leading-relaxed">
        <p>
          Kampüs Arşivi, kullanıcılarının gizliliğine önem verir. Bu politika, platformu kullanırken
          hangi bilgilerin toplandığını ve nasıl kullanıldığını açıklar.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-zinc-900">Toplanan Bilgiler</h2>
        <p>
          Kayıt sırasında e-posta adresiniz ve adınız alınır. Profil sayfasında üniversite, bölüm ve sınıf
          bilgilerini gönüllü olarak ekleyebilirsiniz. Yüklediğiniz dosyalar (notlar, sınav soruları)
          herkese açık olarak paylaşılır.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-zinc-900">Bilgilerin Kullanımı</h2>
        <p>
          Toplanan bilgiler yalnızca platformun çalışması için kullanılır: içerik paylaşımı, mentorlük
          eşleştirmeleri ve ekip arkadaşı bulma özellikleri için. E-posta adresiniz üçüncü taraflarla
          paylaşılmaz.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-zinc-900">Çerezler</h2>
        <p>
          Oturum açma işlemleri için gerekli çerezler kullanılır. Bu çerezler kimlik doğrulama amaçlıdır
          ve herhangi bir takip amacı taşımaz.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-zinc-900">İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için campusarchive@example.com adresinden bize
          ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
