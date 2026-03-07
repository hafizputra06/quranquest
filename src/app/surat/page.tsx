import Header from '@/components/Header';
import SurahCard from '@/components/SurahCard';
import { getSurahList } from '@/lib/quran-api';

export default async function SuratPage() {
  const surahList = await getSurahList();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Surat</h1>
          <p className="text-gray-600">Pilih surat yang ingin Anda baca</p>
        </div>

        <div className="space-y-3">
          {surahList.map((surah) => (
            <SurahCard
              key={surah.number}
              number={surah.number}
              name={surah.name}
              englishName={surah.englishName}
              englishNameTranslation={surah.englishNameTranslation}
              revelationType={surah.revelationType}
              numberOfAyahs={surah.numberOfAyahs}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
