'use client';

import Header from '@/components/Header';
import AyatCard from '@/components/AyatCard';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { getSurah } from '@/lib/quran-api';
import { setLastRead, markTodayAsRead, getLastRead, getSettings } from '@/lib/storage';
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
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [settings, setSettings] = useState<{ arabFontSize: 'sm' | 'md' | 'lg' | 'xl'; transFontSize: 'sm' | 'md' | 'lg'; transliterationFontSize: 'sm' | 'md' | 'lg'; transliterationColor: 'green' | 'blue' | 'purple' | 'gray' }>({ arabFontSize: 'md', transFontSize: 'md', transliterationFontSize: 'md', transliterationColor: 'green' });

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
      
      setSettings(getSettings());
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
    setShowFinishedModal(true);
  };

  const handleMarkPosition = (surahNum: number, ayat: number) => {
    setLastRead(surahNum, ayat);
    setLastReadAyat(ayat);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <FadeIn className="bg-white rounded-xl p-6 mb-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/surat"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              ← Kembali ke daftar
            </Link>
            <span className={`text-xs px-3 py-1 rounded-full ${surah.revelationType === 'Makkiyah'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
              }`}>
              {surah.revelationType}
            </span>
          </div>

          <h1 className="font-arabic text-4xl md:text-6xl text-gray-900 mb-2 text-center" dir="rtl">
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
        </FadeIn>

        <StaggerContainer className="space-y-0">
          {ayahs.map((ayat: any) => (
            <StaggerItem key={ayat.number}>
              <AyatCard
                number={ayat.number}
                arab={ayat.text}
                transliteration={ayat.transliteration}
                translation={ayat.translation}
                numberInSurah={ayat.numberInSurah}
                surahNumber={surahNumber}
                surahName={surah.englishName}
                lastReadAyat={lastReadAyat}
                onMarkPosition={handleMarkPosition}
                arabFontSize={settings.arabFontSize}
                transFontSize={settings.transFontSize}
                transliterationFontSize={settings.transliterationFontSize}
                transliterationColor={settings.transliterationColor}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2} className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
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
        </FadeIn>
      </main>

      {showFinishedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFinishedModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alhamdulillah!</h3>
              <p className="text-gray-600 mb-6">
                Surat {surah.englishName} telah selesai dibaca.<br />
                <span className="font-medium text-emerald-600">
                  Progress hari ini tercatat.
                </span>
              </p>
              <button
                onClick={() => setShowFinishedModal(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-xl transition-colors w-full"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
