'use client';

import Header from '@/components/Header';
import { getStats, getLastRead, getTodayStatus } from '@/lib/storage';
import { getSurahList } from '@/lib/quran-api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalSuratDibaca: number;
  totalHariAktif: number;
  streak: number;
}

interface LastRead {
  surat: number;
  ayat: number;
}

export default function ProfilPage() {
  const [stats, setStats] = useState<Stats>({ totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 });
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [surahList, setSurahList] = useState<any[]>([]);
  const [todayStatus, setTodayStatus] = useState<'done' | 'pending'>('pending');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setStats(getStats());
    setLastRead(getLastRead());
    setTodayStatus(getTodayStatus());

    // Fetch surah list for names
    const list = await getSurahList();
    setSurahList(list);
  };

  const handleReset = () => {
    localStorage.removeItem('quranquest_last_read');
    localStorage.removeItem('quranquest_daily_reads');
    localStorage.removeItem('quranquest_stats');
    refreshData();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Muslim Pembaca</h1>
              <p className="text-gray-500 text-sm">Semangat membaca Al-Quran</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${todayStatus === 'done'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
            {todayStatus === 'done' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Alhamdulillah, sudah baca hari ini!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Belum baca hari ini</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.streak}</div>
            <div className="text-gray-500 text-sm">Hari Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalSuratDibaca}</div>
            <div className="text-gray-500 text-sm">Surat Dibaca</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalHariAktif}</div>
            <div className="text-gray-500 text-sm">Hari Aktif</div>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-3 px-4 mb-6 bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Progress
        </button>

        {lastRead ? (
          <Link href={`/surat/${lastRead.surat}`}>
            <div className="bg-emerald-500 hover:bg-emerald-600 rounded-xl p-6 text-white transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Lanjut Baca</p>
                  <p className="text-lg font-bold">
                    {surahList.find(s => s.number === lastRead.surat)?.englishName || (surahList.length > 0 ? `Surat ${lastRead.surat}` : 'Loading...')}
                  </p>
                  <p className="text-emerald-100 text-sm">Ayat {lastRead.ayat}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/surat">
            <div className="bg-emerald-500 hover:bg-emerald-600 rounded-xl p-6 text-white transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">Mulai Membaca</p>
                  <p className="text-emerald-100 text-sm">Pilih surat untuk dibaca</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

<div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4">Cara Menggunakan</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 text-sm font-bold">1</span>
              </div>
              <p className="text-gray-600 text-sm">Buka menu Surat dan pilih surat yang ingin dibaca</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-600 text-sm">Baca arab + transliterasi + terjemahan</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 text-sm font-bold">3</span>
              </div>
              <p className="text-gray-600 text-sm">Klik &quot;Tandai Selesai Dibaca&quot; di atas</p>
            </div>
          </div>
        </div>
      </main>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Progress?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Semua data progress akan dihapus. Ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
