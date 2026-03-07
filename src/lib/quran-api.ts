import quranData from '@/data/quran.json';
import quranIdData from '@/data/quran_id.json';
import transliterationData from '@/data/transliteration_cleaned.json';

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  jazm: string;
  translation: string;
  transliteration?: string;
}

export interface SurahData {
  surah: QuranSurah;
  ayahs: QuranAyah[];
}

interface SurahJson {
  id: number;
  name: string;
  transliteration: string;
  translation?: string;
  type: string;
  total_verses: number;
  verses: { id: number; text: string; translation?: string }[];
}

export async function getSurahList(): Promise<QuranSurah[]> {
  return quranData.map((surah: SurahJson, index: number) => {
    const idData = quranIdData[index] as SurahJson | undefined;
    return {
      number: surah.id,
      name: surah.name,
      englishName: surah.transliteration,
      englishNameTranslation: idData?.translation || surah.transliteration,
      revelationType: surah.type === 'meccan' ? 'Makkiyah' : 'Madaniyah',
      numberOfAyahs: surah.total_verses,
    };
  });
}

export async function getSurah(surahNumber: number): Promise<SurahData | null> {
  try {
    const surahData = quranData[surahNumber - 1] as SurahJson | undefined;
    const surahId = quranIdData[surahNumber - 1] as SurahJson | undefined;

    if (!surahData) return null;

    const translitRecord = transliterationData as Record<string, string[]>;
    const transliterationList = translitRecord[surahNumber.toString()];

    const ayahs = surahData.verses.map((verse, index) => {
      let transliteration = transliterationList ? transliterationList[index] : '';
      return {
        number: verse.id,
        text: verse.text,
        numberInSurah: verse.id,
        jazm: '',
        translation: surahId?.verses[index]?.translation || '',
        transliteration,
      };
    });

    return {
      surah: {
        number: surahData.id,
        name: surahData.name,
        englishName: surahData.transliteration,
        englishNameTranslation: surahId?.translation || surahData.transliteration,
        revelationType: surahData.type === 'meccan' ? 'Makkiyah' : 'Madaniyah',
        numberOfAyahs: surahData.total_verses,
      },
      ayahs,
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

export async function getRandomAyat(): Promise<{ arab: string; translation: string; surah: string; surahTranslation: string; ayat: number }> {
  const randomSurah = Math.floor(Math.random() * 114) + 1;
  const surahData = await getSurah(randomSurah);

  if (!surahData || surahData.ayahs.length === 0) {
    return {
      arab: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      translation: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang',
      surah: 'Al-Fatihah',
      surahTranslation: 'Pembukaan',
      ayat: 1,
    };
  }

  const randomAyatIndex = Math.floor(Math.random() * surahData.ayahs.length);
  const randomAyat = surahData.ayahs[randomAyatIndex];

  return {
    arab: randomAyat.text,
    translation: randomAyat.translation,
    surah: surahData.surah.englishName,
    surahTranslation: surahData.surah.englishNameTranslation,
    ayat: randomAyat.numberInSurah,
  };
}
