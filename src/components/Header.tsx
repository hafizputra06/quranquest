'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">QuranQuest</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/surat"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/surat') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Surat
          </Link>
          <Link
            href="/profil"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/profil') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
