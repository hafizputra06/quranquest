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

const normalize = (s: string) => s.toLowerCase().replace(/[-_\s]/g, '');

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Surah[]>([]);
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getSurahList().then((list) => setAllSurahs(list as Surah[]));
  }, []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
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

  // Close on outside click (check entire header so toggle button doesn't re-open)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const selectSurah = (surah: Surah) => {
    closeSearch();
    router.push(`/surat/${surah.number}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      selectSurah(results[activeIndex]);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const showDropdown = searchOpen && query.trim().length > 0;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      {/* Row 1: Logo + Nav + Search toggle button */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">QuranQuest</span>
        </Link>

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

          {/* Search toggle button — works on desktop & mobile */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Cari surat"
            className={`ml-1 p-2.5 rounded-lg transition-colors ${searchOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {searchOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Row 2: Search bar — visible when toggled */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: searchOpen ? '60px' : '0px',
          opacity: searchOpen ? 1 : 0,
          overflow: searchOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 pb-2.5">
          <div ref={containerRef} className="relative">
            <div className="flex items-center gap-2 bg-gray-50 border border-emerald-300 bg-white shadow-sm rounded-xl px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder="Cari surat… (contoh: Al-Fatihah)"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {results.map((surah, i) => (
                  <button
                    key={surah.number}
                    onMouseDown={() => selectSurah(surah)}
                    onTouchEnd={(e) => { e.preventDefault(); selectSurah(surah); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${i === activeIndex ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      } ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === activeIndex ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}>{surah.number}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${i === activeIndex ? 'text-emerald-700' : 'text-gray-800'}`}>{surah.englishName}</p>
                      <p className="text-xs text-gray-400 truncate">{surah.englishNameTranslation} · {surah.numberOfAyahs} ayat</p>
                    </div>
                    <svg className="w-4 h-4 ml-auto flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {showDropdown && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-50 px-4 py-5 text-sm text-gray-400 text-center">
                Surat tidak ditemukan
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
