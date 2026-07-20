export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Hakkımızda</h1>
      <div className="space-y-4 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>
          <strong>Kampüs Arşivi</strong>, öğrencilerin akademik hayatlarını kolaylaştırmak için kurulmuş bir platformdur.
          Çıkmış sınav sorularından ders notlarına, mentorlük desteğinden proje ekip arkadaşı bulmaya kadar
          öğrencilerin ihtiyaç duyduğu her şeyi bir araya getirir.
        </p>
        <p>
          Platformun temel amacı, öğrenciler arasında bilgi paylaşımını teşvik ederek herkesin eşit şartlarda
          eğitim materyaline erişmesini sağlamaktır. Üst sınıfların deneyimlerinden alt sınıfların faydalanması,
          Kampüs Arşivi&apos;nin temel felsefesidir.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Neler Sunuyoruz?</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Çıkmış Sorular:</strong> Geçmiş yıllara ait vize, final ve bütünleme soruları</li>
          <li><strong>Ders Notları:</strong> Öğrencilerin hazırladığı ders notları ve özetler</li>
          <li><strong>Mentorlük:</strong> Gönüllü üst sınıf öğrencilerinden birebir destek</li>
          <li><strong>Ekip Arkadaşı:</strong> Projelerin için takım arkadaşı bulma imkanı</li>
        </ul>
        <p className="pt-4">
          Her üniversiteden öğrenciye açık olan platformumuza sen de katkıda bulun, 
          paylaştıkça büyüyen bir topluluğun parçası ol.
        </p>
      </div>
    </div>
  );
}
