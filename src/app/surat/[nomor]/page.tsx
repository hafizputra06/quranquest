'use client';

import Header from '@/components/Header';
import AyatCard from '@/components/AyatCard';
import { getSurah } from '@/lib/quran-api';
import { setLastRead, markTodayAsRead, getLastRead } from '@/lib/storage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ nomor: string }>;
}

export default function SurahDetailPage({ params }: PageProps) {
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [surahNumber, setSurahNumber] = useState<number>(0);
  const [lastReadAyat, setLastReadAyat] = useState<number>(1);

  useEffect(() => {
    const loadData = async () => {
      const { nomor } = await params;
      const num = parseInt(nomor, 10);
      setSurahNumber(num);
      
      if (isNaN(num) || num < 1 || num > 114) {
        setLoading(false);
        return;
      }

      const data = await getSurah(num);
      setSurahData(data);
      
      const lastRead = getLastRead();
      if (lastRead && lastRead.surat === num) {
        setLastReadAyat(lastRead.ayat);
      } else {
        setLastReadAyat(1);
        setLastRead(num, 1);
      }
      setLoading(false);
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!surahData || isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Gagal memuat surat. Silakan coba lagi.</p>
        </main>
      </div>
    );
  }

  const { surah, ayahs } = surahData;

  const hasPrev = surahNumber > 1;
  const hasNext = surahNumber < 114;

  const handleFinishReading = () => {
    markTodayAsRead(surahNumber);
    alert('Alhamdulillah! Surat telah selesai dibaca. Progress hari ini tercatat.');
  };

  const handleMarkPosition = (surahNum: number, ayat: number) => {
    setLastRead(surahNum, ayat);
    setLastReadAyat(ayat);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 mb-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/surat"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              ← Kembali ke daftar
            </Link>
            <span className={`text-xs px-3 py-1 rounded-full ${
              surah.revelationType === 'Makkiyah' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {surah.revelationType}
            </span>
          </div>
          
          <h1 className="font-arabic text-4xl text-gray-900 mb-2 text-center" dir="rtl">
            {surah.name}
          </h1>
          <p className="text-xl font-bold text-gray-800 text-center">{surah.englishName} ({surah.englishNameTranslation})</p>
          <p className="text-gray-500 text-center mt-2">{surah.numberOfAyahs} ayat</p>

          <button
            onClick={handleFinishReading}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Tandai Selesai Dibaca
          </button>
        </div>

        <div className="space-y-0">
          {ayahs.map((ayat: any) => (
            <AyatCard
              key={ayat.number}
              number={ayat.number}
              arab={ayat.text}
              translation={ayat.translation}
              numberInSurah={ayat.numberInSurah}
              surahNumber={surahNumber}
              lastReadAyat={lastReadAyat}
              onMarkPosition={handleMarkPosition}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          {hasPrev ? (
            <Link 
              href={`/surat/${surahNumber - 1}`}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Surat Sebelumnya
            </Link>
          ) : (
            <div />
          )}
          
          {hasNext && (
            <Link 
              href={`/surat/${surahNumber + 1}`}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Surat Berikutnya
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
