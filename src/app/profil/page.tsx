'use client';

import Header from '@/components/Header';
import { getStats, getLastRead, getTodayStatus } from '@/lib/storage';
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

const SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatihah (Pembukaan)',
  2: 'Al-Baqarah (Sapi Betina)',
  3: 'Ali Imran (Keluarga Imran)',
  4: 'An-Nisa (Wanita)',
  5: 'Al-Maidah (Jamuan)',
  6: 'Al-Anam (Binatang Ternak)',
  7: 'Al-Araf (Tempat-Tempat Tinggi)',
  8: 'Al-Anfal (Rampasan Perang)',
  9: 'At-Taubah (Pengampunan)',
  10: 'Yunus (Nabi Yunus)',
  11: 'Hud (Nabi Hud)',
  12: 'Yusuf (Nabi Yusuf)',
  13: 'Ar-Rad (Petir)',
  14: 'Ibrahim (Nabi Ibrahim)',
  15: 'Al-Hijr (Batu Hans)',
  16: 'An-Nahl (Lebah)',
  17: 'Al-Isra (Perjalanan Malam)',
  18: 'Al-Kahf (Gua)',
  19: 'Maryam (Maryam)',
  20: 'Ta-Ha (Ta-Ha)',
  21: 'Al-Anbiya (Nabi-Nabi)',
  22: 'Al-Hajj (Haji)',
  23: 'Al-Mu-minun (Orang-Orang Mukmin)',
  24: 'An-Nur (Cahaya)',
  25: 'Al-Furqan (Pembeda)',
  26: 'As-Suara (Penyair)',
  27: 'Az-Zumar (Golongan)',
  28: 'Al-Gafir (Yang Maha Pengampun)',
  29: 'Fussilat (Dijelaskan)',
  30: 'As-Syura (Musyawarah)',
  31: 'Az-Zukhruf (Perhiasan)',
  32: 'Ad-Dukhan (Kabut)',
  33: 'Al-Jasiyah (Yang Berlutut)',
  34: 'Al-Ahqaf (Bukit Pasir)',
  35: 'Muhammad (Nabi Muhammad)',
  36: 'Al-Fath (Kemenangan)',
  37: 'Al-Hujurat (Kamar-Kamar)',
  38: 'Qaf (Qaf)',
  39: 'Az-Zariyat (Angin yang Menyiarkan)',
  40: 'At-Tur (Bukit Tursina)',
  41: 'An-Najm (Bintang)',
  42: 'Al-Qamar (Bulan)',
  43: 'Ar-Rahman (Yang Maha Pemurah)',
  44: 'Al-Waqiah (Hari Kiamat)',
  45: 'Al-Hadid (Besi)',
  46: 'Al-Mujadilah (Wanita yang Menggugat)',
  47: 'Al-Hasyr (Pengusiran)',
  48: 'Al-Mumtahanah (Wanita yang Diuji)',
  49: 'As-Saf (Barisan)',
  50: 'Al-Jumuah (Jumat)',
  51: 'Al-Munafiqun (Orang-Orang Munafik)',
  52: 'At-Tagabun (Pengungkapan Kesalahan)',
  53: 'At-Talaq (Talak)',
  54: 'At-Tahrim (Mengharamkan)',
  55: 'Al-Mulk (Kerajaan)',
  56: 'Al-Qalam (Pena)',
  57: 'Al-Haqqah (Hari Kiamat)',
  58: 'Al-Maarij (Tempat-Tempat Naik)',
  59: 'Nuh (Nabi Nuh)',
  60: 'Al-Jinn (Jin)',
  61: 'Al-Muzzammil (Yang Berselimut)',
  62: 'Al-Muddathir (Yang Berkemul)',
  63: 'Al-Qiyamah (Hari Kiamat)',
  64: 'Al-Insan (Manusia)',
  65: 'Al-Mursalat (Malaikat-Malaikat yang Diutus)',
  66: 'An-Naba (Berita Besar)',
  67: 'An-Naziat (Malaikat-Malaikat yang Mencabut)',
  68: 'Abasa (Bermuka Masam)',
  69: 'At-Takwir (Melipat)',
  70: 'Al-Infitar (Terbelah)',
  71: 'Al-Mutaffifin (Orang-Orang yang Curang)',
  72: 'Al-Inshiqaq (Terbelah)',
  73: 'Al-Buruj (Bintang-Bintang)',
  74: 'At-Tariq (Bintang Fajar)',
  75: 'Al-Ala (Yang Paling Tinggi)',
  76: 'Al-Ghashiyah (Hari Kiamat)',
  77: 'Al-Fajr (Subuh)',
  78: 'Al-Balad (Negeri)',
  79: 'As-Shams (Matahari)',
  80: 'Al-Layl (Malam)',
  81: 'Ad-Duha (Duha)',
  82: 'Ash-Sharh (Lapang Dada)',
  83: 'At-Tin (Buah Tin)',
  84: 'Al-Alaq (Segumpal Darah)',
  85: 'Al-Qadr (Kemuliaan)',
  86: 'Al-Bayyinah (Bukti)',
  87: 'Az-Zalzalah (Guncangan)',
  88: 'Al-Adiyat (Kuda Perang)',
  89: 'Al-Qariah (Hari Kiamat)',
  90: 'At-Takathur (Keinginan Berlebih)',
  91: 'Al-Asr (Asar)',
  92: 'Al-Humazah (Pengumpat)',
  93: 'Al-Fil (Gajah)',
  94: 'Quraysh (Quraisy)',
  95: 'Al-Maun (Barang-barang yang Berguna)',
  96: 'Al-Kauthar (Nikmat yang Berlimpah)',
  97: 'Al-Kafirun (Orang-Orang Kafir)',
  98: 'An-Nasr (Pertolongan)',
  99: 'Al-Lahab (Api yang Menyala-nyala)',
  100: 'Al-Ikhlas (Ikhlas)',
  101: 'Al-Falaq (Subuh)',
  102: 'An-Nas (Manusia)',
};

export default function ProfilPage() {
  const [stats, setStats] = useState<Stats>({ totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 });
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [todayStatus, setTodayStatus] = useState<'done' | 'pending'>('pending');

  useEffect(() => {
    setStats(getStats());
    setLastRead(getLastRead());
    setTodayStatus(getTodayStatus());
  }, []);

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

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            todayStatus === 'done' 
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

        {lastRead ? (
          <Link href={`/surat/${lastRead.surat}`}>
            <div className="bg-emerald-500 hover:bg-emerald-600 rounded-xl p-6 text-white transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Lanjut Baca</p>
                  <p className="text-lg font-bold">{SURAH_NAMES[lastRead.surat] || `Surat ${lastRead.surat}`}</p>
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
              <p className="text-gray-600 text-sm">Pilih surat yang ingin dibaca dari halaman Daftar Surat</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-600 text-sm">Baca surat lengkap dengan terjemahan Indonesia</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 text-sm font-bold">3</span>
              </div>
              <p className="text-gray-600 text-sm">Status &quot;Sudah Baca&quot; akan otomatis tercatat setelah membaca</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
