import Link from 'next/link';

interface SurahCardProps {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export default function SurahCard({
  number,
  name,
  englishName,
  englishNameTranslation,
  revelationType,
  numberOfAyahs,
}: SurahCardProps) {
  return (
    <Link href={`/surat/${number}`}>
      <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-700 font-bold text-sm">{number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-arabic text-xl text-gray-900 mb-1">{name}</h3>
            <p className="text-sm font-medium text-gray-700 truncate">{englishName} ({englishNameTranslation})</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                revelationType === 'Meccan' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {revelationType}
              </span>
              <span className="text-xs text-gray-500">{numberOfAyahs} ayat</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
