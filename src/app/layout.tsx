import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "QuranQuest - Membaca Al-Quran Setiap Hari",
  description: "Platform membaca Al-Quran digital dengan fitur pelacakan kebiasaan membaca harian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
