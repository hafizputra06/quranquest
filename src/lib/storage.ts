export interface ReadingProgress {
  surat: number;
  ayat: number;
  timestamp: number;
}

export interface DailyRead {
  date: string;
  status: 'done' | 'pending';
  surat: number;
}

export interface UserStats {
  totalSuratDibaca: number;
  totalHariAktif: number;
  streak: number;
}

export interface AppSettings {
  arabFontSize: 'sm' | 'md' | 'lg' | 'xl';
  transFontSize: 'sm' | 'md' | 'lg';
  transliterationFontSize: 'sm' | 'md' | 'lg';
  transliterationColor: 'green' | 'blue' | 'purple' | 'gray';
}

export const DEFAULT_SETTINGS: AppSettings = {
  arabFontSize: 'md',
  transFontSize: 'md',
  transliterationFontSize: 'md',
  transliterationColor: 'green',
};

const STORAGE_KEYS = {
  LAST_READ: 'quranquest_last_read',
  DAILY_READS: 'quranquest_daily_reads',
  STATS: 'quranquest_stats',
  SETTINGS: 'quranquest_settings',
};

export function getLastRead(): ReadingProgress | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.LAST_READ);
  return data ? JSON.parse(data) : null;
}

export function setLastRead(surat: number, ayat: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    STORAGE_KEYS.LAST_READ,
    JSON.stringify({ surat, ayat, timestamp: Date.now() })
  );
}

export function getDailyReads(): Record<string, DailyRead> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_READS);
  return data ? JSON.parse(data) : {};
}

export function getTodayRead(): DailyRead | null {
  const today = new Date().toISOString().split('T')[0];
  const reads = getDailyReads();
  return reads[today] || null;
}

export function markTodayAsRead(surat: number): void {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  const reads = getDailyReads();
  
  const existingToday = reads[today];
  const previousSurat = existingToday?.surat;
  
  reads[today] = { date: today, status: 'done', surat };
  localStorage.setItem(STORAGE_KEYS.DAILY_READS, JSON.stringify(reads));
  
  updateStatsOnRead(previousSurat, surat);
}

function updateStatsOnRead(previousSurat?: number, currentSurat?: number): void {
  const stats = getStats();
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const reads = getDailyReads();
  const readDates = Object.keys(reads).sort().reverse();
  
  if (previousSurat !== currentSurat) {
    stats.totalSuratDibaca += 1;
  }
  
  let currentStreak = 0;
  let checkDate = today;
  
  while (readDates.includes(checkDate) && reads[checkDate]?.status === 'done') {
    currentStreak++;
    const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
    checkDate = prevDate;
  }
  
  stats.streak = currentStreak;
  stats.totalHariAktif = readDates.filter(d => reads[d]?.status === 'done').length;
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

export function getStats(): UserStats {
  if (typeof window === 'undefined') return { totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 };
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  return data ? JSON.parse(data) : { totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 };
}

export function getTodayStatus(): 'done' | 'pending' {
  const todayRead = getTodayRead();
  return todayRead?.status || 'pending';
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}
