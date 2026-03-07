'use client';

import Header from '@/components/Header';
import { getDailyReads, getStats, getTodayStatus } from '@/lib/storage';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { useEffect, useState } from 'react';

interface DayCell {
    date: string;
    isRead: boolean;
    isToday: boolean;
    isFuture: boolean;
}

// Get current date/time in Jakarta (UTC+7)
function getJakartaNow(): Date {
    const now = new Date();
    const jakartaOffset = 7 * 60; // minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + jakartaOffset * 60000);
}

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function buildCalendar(dailyReads: Record<string, { status: string }>): DayCell[][] {
    const jakartaToday = getJakartaNow();
    jakartaToday.setHours(0, 0, 0, 0);
    const todayStr = toDateStr(jakartaToday);

    // Start 12 weeks ago from Sunday of current week
    const startOfCurrentWeek = new Date(jakartaToday);
    startOfCurrentWeek.setDate(jakartaToday.getDate() - jakartaToday.getDay());

    const weeksToShow = 14;
    const startDate = new Date(startOfCurrentWeek);
    startDate.setDate(startOfCurrentWeek.getDate() - (weeksToShow - 1) * 7);

    const weeks: DayCell[][] = [];
    let current = new Date(startDate);

    for (let w = 0; w < weeksToShow; w++) {
        const week: DayCell[] = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = toDateStr(current);
            const isToday = dateStr === todayStr;
            const isFuture = current > jakartaToday;
            const isRead = !isFuture && dailyReads[dateStr]?.status === 'done';
            week.push({ date: dateStr, isRead, isToday, isFuture });
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
}

const MONTH_NAMES_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function StreakPage() {
    const [weeks, setWeeks] = useState<DayCell[][]>([]);
    const [stats, setStats] = useState({ totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 });
    const [totalReadDays, setTotalReadDays] = useState(0);
    const [todayStatus, setTodayStatus] = useState<'done' | 'pending'>('pending');
    const [jakartaTime, setJakartaTime] = useState<Date | null>(null);

    useEffect(() => {
        const reads = getDailyReads();
        const s = getStats();
        const calendar = buildCalendar(reads as Record<string, { status: string }>);
        setWeeks(calendar);
        setStats(s);
        setTotalReadDays(Object.values(reads).filter((r: any) => r.status === 'done').length);
        setTodayStatus(getTodayStatus());

        // Live Jakarta clock
        const tick = () => setJakartaTime(getJakartaNow());
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    // Month labels for top of calendar
    const monthLabels: { label: string; colIndex: number }[] = [];
    weeks.forEach((week, i) => {
        const firstDay = week[0];
        if (!firstDay) return;
        const month = parseInt(firstDay.date.split('-')[1], 10) - 1;
        const dayNum = parseInt(firstDay.date.split('-')[2], 10);
        if (dayNum <= 7 || i === 0) {
            const prev = i > 0 ? parseInt(weeks[i - 1][0].date.split('-')[1], 10) - 1 : -1;
            if (month !== prev || i === 0) {
                monthLabels.push({ label: MONTH_SHORT[month], colIndex: i });
            }
        }
    });

    const formatTime = (d: Date) =>
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

    const formatDate = (d: Date) =>
        `${DAY_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title + Live Clock */}
                <FadeIn className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Streak Membaca</h1>
                        <p className="text-gray-500 text-sm">Visualisasi konsistensi ibadah harianmu</p>
                    </div>
                    {jakartaTime && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 text-right min-w-fit">
                            <p className="text-2xl font-mono font-bold text-emerald-600 tracking-widest">{formatTime(jakartaTime)}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(jakartaTime)} WIB</p>
                        </div>
                    )}
                </FadeIn>

                {/* Stats Cards */}
                <StaggerContainer className="grid grid-cols-3 gap-4 mb-8">
                    <StaggerItem>
                        <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
                            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.streak}</div>
                            <div className="text-xs text-gray-500 font-medium">Hari Berturut</div>
                            <div className="text-lg mt-1">🔥</div>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
                            <div className="text-3xl font-bold text-blue-600 mb-1">{totalReadDays}</div>
                            <div className="text-xs text-gray-500 font-medium">Total Hari Baca</div>
                            <div className="text-lg mt-1">📅</div>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalSuratDibaca}</div>
                            <div className="text-xs text-gray-500 font-medium">Surat Dibaca</div>
                            <div className="text-lg mt-1">📖</div>
                        </div>
                    </StaggerItem>
                </StaggerContainer>

                {/* Heatmap Calendar */}
                <FadeIn delay={0.2} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-6">Kalender Bacaan</h2>

                    <div className="overflow-x-auto pb-2">
                        <div className="inline-flex gap-2 min-w-max">
                            {/* Day labels */}
                            <div className="flex flex-col gap-2 pr-2 pt-7">
                                {DAY_SHORT.map((label, i) => (
                                    <div key={i} className="h-[28px] text-xs text-gray-400 font-medium flex items-center w-8">{label}</div>
                                ))}
                            </div>

                            {/* Week columns */}
                            <div className="flex gap-2">
                                {weeks.map((week, wi) => {
                                    const ml = monthLabels.find(m => m.colIndex === wi);
                                    return (
                                        <div key={wi} className="flex flex-col gap-2">
                                            {/* Month label */}
                                            <div className="h-6 text-xs text-gray-500 font-semibold flex items-end pb-1">
                                                {ml?.label ?? ''}
                                            </div>
                                            {/* Day cells */}
                                            {week.map((cell, di) => (
                                                <div
                                                    key={di}
                                                    title={`${cell.date}${cell.isRead ? ' ✅ Sudah baca' : cell.isToday ? ' ← Hari ini' : ''}`}
                                                    className={`w-[28px] h-[28px] rounded-md transition-all duration-200 cursor-default flex items-center justify-center ${cell.isFuture
                                                        ? 'bg-gray-50 border border-dashed border-gray-200'
                                                        : cell.isRead
                                                            ? cell.isToday
                                                                ? 'bg-emerald-500 ring-2 ring-emerald-300 shadow-md'
                                                                : 'bg-emerald-400 hover:bg-emerald-500'
                                                            : cell.isToday
                                                                ? 'bg-white border-2 border-emerald-400'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {cell.isToday && !cell.isRead && (
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                    )}
                                                    {cell.isRead && (
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                        <span className="text-xs text-gray-400">Belum baca</span>
                        <div className="w-[22px] h-[22px] rounded-md bg-gray-100 border" />
                        <div className="w-[22px] h-[22px] rounded-md bg-emerald-400 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-400">Sudah baca</span>
                        <div className="ml-2 w-[22px] h-[22px] rounded-md bg-white border-2 border-emerald-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-gray-400">Hari ini</span>
                    </div>
                </FadeIn>

                {/* Motivational message */}
                <FadeIn delay={0.3}>
                    <div className={`rounded-2xl p-6 text-center shadow-lg transition-all ${todayStatus === 'done'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-100'
                        }`}>
                        {todayStatus === 'done' ? (
                            <>
                                <div className="text-3xl mb-2">🔥</div>
                                <p className="font-bold text-lg mb-1">MasyaAllah! {stats.streak} hari berturut-turut!</p>
                                <p className="text-emerald-100 text-sm">Jaga terus konsistensi membacamu</p>
                            </>
                        ) : (
                            <>
                                <div className="text-3xl mb-2">✨</div>
                                <p className="font-bold text-lg mb-1">Mulai Streak Harimu!</p>
                                <p className="text-amber-50 text-sm">Baca satu surat hari ini dan tandai selesai</p>
                            </>
                        )}
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}
