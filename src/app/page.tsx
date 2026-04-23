'use client';

import Header from '@/components/Header';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { getRandomAyat, getSurahList, getSurah } from '@/lib/quran-api';
import { getTodayStatus, getLastRead, getSettings } from '@/lib/storage';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

const ARAB_FONT_SIZES = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-3xl sm:text-4xl',
  xl: 'text-4xl sm:text-5xl',
};

const TRANS_FONT_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Home() {
  const [ayatHarian, setAyatHarian] = useState<{ arab: string; translation: string; surah: string; surahTranslation: string; ayat: number } | null>(null);
  const [featuredSurah, setFeaturedSurah] = useState<Surah | null>(null);
  const [todayStatus, setTodayStatus] = useState<'done' | 'pending'>('pending');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ arabFontSize: 'md', transFontSize: 'md' });

  useEffect(() => {
    const loadData = async () => {
      const [ayat, surahList, status, sett] = await Promise.all([
        getRandomAyat(),
        getSurahList(),
        getTodayStatus(),
        getSettings(),
      ]);

      setAyatHarian(ayat);
      setTodayStatus(status);
      setSettings(sett);

      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      setFeaturedSurah(surahList[dayOfYear % surahList.length]);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <FadeIn delay={0}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Assalamu&apos;alaikum
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-gray-600">
              Mari konsisten membaca Al-Quran setiap hari
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
              Ayat Hari Ini
            </span>
          </div>
          {ayatHarian && (
            <>
              <p className={`font-arabic ${ARAB_FONT_SIZES[settings.arabFontSize as keyof typeof ARAB_FONT_SIZES]} text-gray-900 text-right mb-4 sm:mb-6`} dir="rtl" style={{ lineHeight: '2.2' }}>
                {ayatHarian.arab}
              </p>
              <p className={`text-gray-600 ${TRANS_FONT_SIZES[settings.transFontSize as keyof typeof TRANS_FONT_SIZES]} leading-relaxed mb-4`}>
                {ayatHarian.translation}
              </p>
              <p className="text-sm text-gray-500">
                {ayatHarian.surah} ({ayatHarian.surahTranslation}) ayat {ayatHarian.ayat}
              </p>
            </>
          )}
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <FadeIn delay={0.3}>
            <Link href="/surat">
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
          </FadeIn>

          {featuredSurah && (
            <FadeIn delay={0.4}>
              <Link href={`/surat/${featuredSurah.number}`}>
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                      Surat Pilihan
                    </span>
                  </div>
                  <p className="font-arabic text-3xl sm:text-4xl text-gray-900 mb-2">{featuredSurah.name}</p>
                  <p className="text-gray-600 text-m">{featuredSurah.englishName} ({featuredSurah.englishNameTranslation})</p>
                  <p className="text-gray-400 text-m mt-2">{featuredSurah.numberOfAyahs} ayat</p>
                </div>
              </Link>
            </FadeIn>
          )}
        </div>

        {todayStatus === 'done' ? (
          <FadeIn delay={0.5} className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">Target Harian</h2>
                <p className="text-emerald-100 text-sm">Alhamdulillah, hari ini sudah baca!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.5} className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">Target Harian</h2>
                <p className="text-amber-100 text-sm">Baca minimal 1 surat hari ini</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </FadeIn>
        )}
      </main>
    </div>
  );
}
