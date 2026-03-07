import Header from '@/components/Header';
import { getRandomAyat, getSurahList } from '@/lib/quran-api';
import Link from 'next/link';

export default async function Home() {
  const [ayatHarian, surahList] = await Promise.all([
    getRandomAyat(),
    getSurahList(),
  ]);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const featuredSurah = surahList[dayOfYear % surahList.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in-up">
            Assalamu&apos;alaikum
          </h1>
          <p className="text-gray-600 animate-fade-in-up stagger-1">
            Mari konsisten membaca Al-Quran setiap hari
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-emerald-100 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
              Ayat Hari Ini
            </span>
          </div>
          <p className="font-arabic text-3xl text-gray-900 text-right leading-loose mb-6" dir="rtl">
            {ayatHarian.arab}
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            {ayatHarian.translation}
          </p>
          <p className="text-sm text-gray-500">
            {ayatHarian.surah} ayat {ayatHarian.ayat}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/surat" className="animate-fade-in-up stagger-3">
            <div className="bg-emerald-500 hover:bg-emerald-600 rounded-xl p-6 text-white transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xl font-bold">Mulai Membaca</span>
              </div>
              <p className="text-emerald-100 text-sm">Baca Al-Quran dengan terjemahan Indonesia</p>
            </div>
          </Link>

          {featuredSurah && (
            <Link href={`/surat/${featuredSurah.number}`} className="animate-fade-in-up stagger-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                    Surat Pilihan
                  </span>
                </div>
                <p className="font-arabic text-xl text-gray-900 mb-1">{featuredSurah.name}</p>
                <p className="text-gray-600 text-sm">{featuredSurah.englishName} ({featuredSurah.englishNameTranslation})</p>
                <p className="text-gray-400 text-xs mt-2">{featuredSurah.numberOfAyahs} ayat</p>
              </div>
            </Link>
          )}
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white animate-fade-in-up stagger-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Target Harian</h2>
              <p className="text-emerald-100 text-sm">Baca minimal 1 surat setiap hari</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>QuranQuest &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Membaca Al-Quran adalah investasi terbaik untuk kehidupan</p>
      </footer>
    </div>
  );
}
