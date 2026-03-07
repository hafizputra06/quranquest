'use client';

import Header from '@/components/Header';
import SurahCard from '@/components/SurahCard';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { getSurahList } from '@/lib/quran-api';
import { getLastRead } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export default function SuratPage() {
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [lastReadSurat, setLastReadSurat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const list = await getSurahList();
      setSurahList(list);

      const lastRead = getLastRead();
      if (lastRead) {
        setLastReadSurat(lastRead.surat);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Surat</h1>
            <p className="text-gray-600">Pilih surat yang ingin Anda baca</p>
          </div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <FadeIn className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Surat</h1>
          <p className="text-gray-600">Pilih surat yang ingin Anda baca</p>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {surahList.map((surah) => (
            <StaggerItem key={surah.number}>
              <SurahCard
                number={surah.number}
                name={surah.name}
                englishName={surah.englishName}
                englishNameTranslation={surah.englishNameTranslation}
                revelationType={surah.revelationType}
                numberOfAyahs={surah.numberOfAyahs}
                isLastRead={lastReadSurat === surah.number}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </main>
    </div>
  );
}
