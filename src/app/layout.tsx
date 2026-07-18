import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kampüs Arşivi - Üniversite Öğrencileri İçin Ders Notları, Çıkmış Sorular ve Mentorlük",
  description:
    "Üniversite öğrencilerinin çıkmış sınav sorularını ve ders notlarını paylaştığı, mentorlük desteği aldığı ve projelerine ekip arkadaşı bulduğu platform. Sadece .edu.tr ile kayıt.",
  openGraph: {
    title: "Kampüs Arşivi",
    description: "Üniversite öğrencileri için ders notları, çıkmış sorular, mentorlük ve ekip arkadaşı platformu.",
    siteName: "Kampüs Arşivi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-[#0f172a] dark:text-[#e2e8f0]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
