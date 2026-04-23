'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getSurahList } from '@/lib/quran-api';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Highlight logic for "Surat" when reading a specific surah
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Surah[]>([]);
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSurahList().then((list) => setAllSurahs(list as Surah[]));
  }, []);

  // Define showDropdown variable clearly
  const showDropdown = searchOpen && query.trim().length > 0;

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [searchOpen]);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Handle search results filtering
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

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  // Close search on escape key or outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
        setMenuOpen(false);
      }
    };

    if (searchOpen || menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchOpen, menuOpen]);

  const selectSurah = (surah: Surah) => {
    closeSearch();
    setMenuOpen(false);
    router.push(`/surat/${surah.number}`);
  };

  const NavLinks = ({ mobile = false }) => {
    const links = [
      { href: '/', label: 'Beranda', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
      { href: '/surat', label: 'Surat', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
      { href: '/streak', label: 'Streak', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
      { href: '/profil', label: 'Profil', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { href: '/settings', label: 'Settings', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    return (
      <div className={mobile ? "flex flex-col gap-1 px-4" : "flex items-center gap-1"}>
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`
                ${mobile
                  ? 'flex items-center gap-4 px-6 py-5 rounded-3xl text-xl font-bold transition-all active:scale-95'
                  : 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-lg font-bold transition-all'
                }
                ${active
                  ? (mobile ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'bg-emerald-50 text-emerald-700')
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <div className={`p-2 rounded-xl bg-white ${active ? 'text-emerald-500 shadow-sm' : 'text-gray-400'}`}>
                {link.icon}
              </div>
              {link.label}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[5000] bg-white/95 backdrop-blur-md border-b border-gray-100 h-[72px] sm:h-[88px] flex items-center"
      >
        <div className="max-w-4xl mx-auto w-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 flex-shrink-0 z-[5001]">
            <div className="w-11 h-11 sm:w-16 sm:h-16 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl sm:text-3xl font-black tracking-tighter text-gray-900">QuranQuest</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
            <button
              onClick={() => {
                if (searchOpen) closeSearch();
                else setSearchOpen(true);
              }}
              className={`p-3.5 rounded-2xl shadow-sm ${searchOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {searchOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
              </svg>
            </button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => {
              if (searchOpen) closeSearch();
              else setSearchOpen(true);
            }} className={`p-2.5 rounded-xl ${searchOpen ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 bg-gray-50'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="p-2.5 rounded-xl bg-gray-50 text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 overflow-visible z-[4000]"
            >
              <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
                <div className="relative">
                  <div className="flex items-center gap-4 bg-white border-2 border-emerald-400 shadow-lg rounded-2xl px-5 py-4 transition-all focus-within:ring-4 focus-within:ring-emerald-100">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      placeholder="Cari surat..."
                      className="bg-transparent text-xl font-bold text-gray-800 outline-none w-full"
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
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
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[4001] max-h-[60vh] overflow-y-auto p-2">
                        {results.length > 0 ? results.map((s, i) => (
                          <button key={s.number} onClick={() => selectSurah(s)} className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 hover:bg-emerald-50 transition-colors ${i > 0 ? 'mt-1' : ''} ${i === activeIndex ? 'bg-emerald-50' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">{s.number}</div>
                            <div className="flex-1 min-w-0"><p className="text-lg font-black truncate">{s.englishName}</p><p className="text-sm text-gray-400 truncate">{s.englishNameTranslation}</p></div>
                          </button>
                        )) : <div className="p-8 text-center text-gray-400 font-bold">Surat tidak ditemukan</div>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* FIXED POSITION MOBILE MENU AT ROOT LEVEL */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[10000] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-[10001]"
            >
              <div className="p-8 bg-emerald-500 text-white relative">
                <h2 className="text-3xl font-black">Menu Utama</h2>
                <p className="text-emerald-50 font-medium opacity-80">QuranQuest</p>
                <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-white p-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto">
                <NavLinks mobile />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
