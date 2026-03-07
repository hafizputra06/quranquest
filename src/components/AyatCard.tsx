'use client';

import { useState, useEffect } from 'react';

interface AyatCardProps {
  number: number;
  arab: string;
  translation: string;
  numberInSurah: number;
  surahNumber: number;
  lastReadAyat: number;
  onMarkPosition: (surah: number, ayat: number) => void;
}

export default function AyatCard({ number, arab, translation, numberInSurah, surahNumber, lastReadAyat, onMarkPosition }: AyatCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isLastRead = lastReadAyat === numberInSurah;

  useEffect(() => {
    if (isLastRead) {
      const element = document.getElementById(`ayat-${numberInSurah}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isLastRead, numberInSurah]);

  const handleMark = () => {
    onMarkPosition(surahNumber, numberInSurah);
    setShowPopup(false);
    setShowModal(true);
  };

  return (
    <>
      <div 
        id={`ayat-${numberInSurah}`}
        className={`ayat-card rounded-xl p-6 border mb-4 relative transition-all duration-300 ${
          isLastRead 
            ? 'bg-emerald-50 border-emerald-300 shadow-md' 
            : 'bg-white border-gray-100 hover:border-emerald-200'
        }`}
      >
        {isLastRead && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2">
            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
              Terakhir Baca
            </div>
          </div>
        )}
        
        <div 
          className="flex items-start gap-4 cursor-pointer"
          onClick={() => setShowPopup(!showPopup)}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isLastRead ? 'bg-emerald-500' : 'bg-emerald-100'
          }`}>
            <span className={`font-bold text-sm ${isLastRead ? 'text-white' : 'text-emerald-700'}`}>
              {numberInSurah}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-arabic text-2xl text-gray-900 text-right leading-loose mb-4" dir="rtl">
              {arab}
            </p>
            <p className="text-gray-600 leading-relaxed">{translation}</p>
          </div>
        </div>

        {showPopup && (
          <div className="absolute top-2 right-2 z-10 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2">
              <button
                onClick={handleMark}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-2 hover:bg-emerald-50 rounded-md transition-colors w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tandai di sini
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
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
                Posisi terakhir baca disimpan.<br />
                <span className="font-medium text-emerald-600">
                  Surat {surahNumber}, Ayat {numberInSurah}
                </span>
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-xl transition-colors w-full"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
