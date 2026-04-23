import Link from 'next/link';

interface SurahCardProps {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  isLastRead?: boolean;
}

export default function SurahCard({
  number,
  name,
  englishName,
  englishNameTranslation,
  revelationType,
  numberOfAyahs,
  isLastRead = false,
}: SurahCardProps) {
  return (
    <Link href={`/surat/${number}`}>
      <div className={`relative bg-white rounded-xl p-4 border transition-all cursor-pointer hover:shadow-lg ${isLastRead
        ? 'border-emerald-300 shadow-md bg-emerald-50'
        : 'border-gray-100 hover:border-emerald-200'
        }`}>
        {isLastRead && (
          <div className="absolute -top-2 -right-2">
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Terakhir Baca
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isLastRead ? 'bg-emerald-500' : 'bg-emerald-50'
            }`}>
            <span className={`font-bold text-sm ${isLastRead ? 'text-white' : 'text-emerald-700'}`}>
              {number}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-arabic text-3xl sm:text-4xl text-gray-900 mb-1">{name}</h3>
            <p className="text-base font-medium text-gray-700 truncate">{englishName} ({englishNameTranslation})</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-base px-2 py-0.5 rounded-full ${revelationType === 'Makkiyah' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                }`}>
                {revelationType}
              </span>
              <span className="text-base text-gray-500">{numberOfAyahs} ayat</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
