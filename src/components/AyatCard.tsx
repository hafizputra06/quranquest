'use client';

interface AyatCardProps {
  number: number;
  arab: string;
  translation: string;
  numberInSurah: number;
}

export default function AyatCard({ number, arab, translation, numberInSurah }: AyatCardProps) {
  return (
    <div className="ayat-card bg-white rounded-xl p-6 border border-gray-100 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-700 font-bold text-sm">{numberInSurah}</span>
        </div>
        <div className="flex-1">
          <p className="font-arabic text-2xl text-gray-900 text-right leading-loose mb-4" dir="rtl">
            {arab}
          </p>
          <p className="text-gray-600 leading-relaxed">{translation}</p>
        </div>
      </div>
    </div>
  );
}
