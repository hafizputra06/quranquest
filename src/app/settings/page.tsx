'use client';

import Header from '@/components/Header';
import { FadeIn } from '@/components/FadeIn';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface AppSettings {
  arabFontSize: 'sm' | 'md' | 'lg' | 'xl';
  transFontSize: 'sm' | 'md' | 'lg';
  transliterationFontSize: 'sm' | 'md' | 'lg';
  transliterationColor: 'green' | 'blue' | 'purple' | 'gray';
}

const ARAB_FONT_OPTIONS = [
  { value: 'sm', label: 'Kecil', size: '20px' },
  { value: 'md', label: 'Sedang', size: '24px' },
  { value: 'lg', label: 'Besar', size: '30px' },
  { value: 'xl', label: 'Sangat Besar', size: '36px' },
];

const TRANS_FONT_OPTIONS = [
  { value: 'sm', label: 'Kecil', size: '14px' },
  { value: 'md', label: 'Sedang', size: '16px' },
  { value: 'lg', label: 'Besar', size: '18px' },
];

const TRANSLIT_FONT_OPTIONS = [
  { value: 'sm', label: 'Kecil', size: '14px' },
  { value: 'md', label: 'Sedang', size: '16px' },
  { value: 'lg', label: 'Besar', size: '18px' },
];

const TRANSLIT_COLOR_OPTIONS = [
  { value: 'green', label: 'Hijau', color: 'text-emerald-600' },
  { value: 'blue', label: 'Biru', color: 'text-blue-600' },
  { value: 'purple', label: 'Ungu', color: 'text-purple-600' },
  { value: 'gray', label: 'Abu-abu', color: 'text-gray-500' },
];

const ARAB_FONT_SIZES: Record<string, string> = {
  sm: 'text-base sm:text-xl',
  md: 'text-xl sm:text-2xl',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
};

const TRANS_FONT_SIZES: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const TRANSLIT_COLOR_CLASSES: Record<string, string> = {
  green: 'text-emerald-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  gray: 'text-gray-500',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <FadeIn className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan Tampilan</h1>
          <p className="text-gray-600">Atur ukuran dan warna sesuai preferensimu</p>
        </FadeIn>

        {/* Arabic Font Size */}
        <FadeIn delay={0.1} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ukuran Tulisan Arab</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ARAB_FONT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSave({ arabFontSize: opt.value as AppSettings['arabFontSize'] })}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all truncate ${
                  settings.arabFontSize === opt.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-200 text-gray-600'
                }`}
              >
                <div className="text-xs sm:text-sm font-medium truncate w-full">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.size}</div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Translation Font Size */}
        <FadeIn delay={0.2} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ukuran Terjemahan</h2>
          <div className="grid grid-cols-3 gap-3">
            {TRANS_FONT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSave({ transFontSize: opt.value as AppSettings['transFontSize'] })}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all truncate ${
                  settings.transFontSize === opt.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-200 text-gray-600'
                }`}
              >
                <div className="text-sm font-medium truncate w-full">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.size}</div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Transliteration Font Size */}
        <FadeIn delay={0.25} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ukuran Transliterasi</h2>
          <div className="grid grid-cols-3 gap-3">
            {TRANSLIT_FONT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSave({ transliterationFontSize: opt.value as AppSettings['transliterationFontSize'] })}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all truncate ${
                  settings.transliterationFontSize === opt.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-200 text-gray-600'
                }`}
              >
                <div className="text-sm font-medium truncate w-full">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.size}</div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Transliteration Color */}
        <FadeIn delay={0.3} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Warna Transliterasi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRANSLIT_COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSave({ transliterationColor: opt.value as AppSettings['transliterationColor'] })}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all truncate ${
                  settings.transliterationColor === opt.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className={`text-sm font-medium truncate w-full ${opt.color}`}>{opt.label}</div>
                <div className="text-xs text-gray-400">warna</div>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Preview */}
        <FadeIn delay={0.4} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pratinjau</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className={`font-arabic text-right mb-2 ${ARAB_FONT_SIZES[settings.arabFontSize]}`} dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <p className={`${TRANSLIT_COLOR_CLASSES[settings.transliterationColor]} ${TRANS_FONT_SIZES[settings.transliterationFontSize]} italic mb-2`}>Bismillahirrahmanirrahim</p>
            <p className={`text-gray-600 ${TRANS_FONT_SIZES[settings.transFontSize]}`}>Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang</p>
          </div>
        </FadeIn>

        {saved && (
          <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
            Pengaturan tersimpan!
          </div>
        )}
      </main>
    </div>
  );
}