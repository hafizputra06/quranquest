'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getSurahList } from '@/lib/quran-api';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Surah[]>([]);
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load surah list once
  useEffect(() => {
    getSurahList().then((list) => setAllSurahs(list as Surah[]));
  }, []);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    // Normalize: strip all hyphens, underscores, and spaces so "alfatihah" == "Al-Fatihah" == "Al Fatihah"
    const normalize = (s: string) => s.toLowerCase().replace(/[-_\s]/g, '');
    const q = normalize(query);
    const filtered = allSurahs.filter(
      (s) =>
        normalize(s.englishName).includes(q) ||
        normalize(s.englishNameTranslation).includes(q) ||
        String(s.number).startsWith(q)
    ).slice(0, 8);
    setResults(filtered);
    setActiveIndex(-1);
  }, [query, allSurahs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectSurah = (surah: Surah) => {
    setQuery('');
    setFocused(false);
    setResults([]);
    router.push(`/surat/${surah.number}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) selectSurah(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setFocused(false);
      setQuery('');
    }
  };

  const showDropdown = focused && query.trim().length > 0;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">QuranQuest</span>
        </Link>

        {/* Search bar */}
        <div ref={containerRef} className="relative flex-1 max-w-xs">
          <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 transition-all ${focused ? 'border-emerald-400 bg-white shadow-sm' : 'border-gray-200'}`}>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="Cari surat…"
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              onFocus={() => setFocused(true)}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {results.length > 0 ? (
                results.map((surah, i) => (
                  <button
                    key={surah.number}
                    onMouseDown={() => selectSurah(surah)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${i === activeIndex ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      } ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === activeIndex ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${i === activeIndex ? 'text-emerald-700' : 'text-gray-800'}`}>
                        {surah.englishName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{surah.englishNameTranslation} · {surah.numberOfAyahs} ayat</p>
                    </div>
                    <svg className={`w-4 h-4 ml-auto flex-shrink-0 ${i === activeIndex ? 'text-emerald-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-gray-400 text-center">
                  Surat tidak ditemukan
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-shrink-0">
          <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Beranda
          </Link>
          <Link href="/surat" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/surat') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Surat
          </Link>
          <Link href="/streak" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/streak') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Streak
          </Link>
          <Link href="/profil" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/profil') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
