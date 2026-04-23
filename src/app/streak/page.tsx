'use client';

import Header from '@/components/Header';
import { getDailyReads, getStats, getTodayStatus } from '@/lib/storage';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { useEffect, useState } from 'react';

interface DayCell {
    date: string;
    day: number;
    isRead: boolean;
    isToday: boolean;
    isFuture: boolean;
    isCurrentMonth: boolean;
}

function getJakartaNow(): Date {
    const now = new Date();
    const jakartaOffset = 7 * 60;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + jakartaOffset * 60000);
}

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function buildCalendar(dailyReads: Record<string, { status: string }>, year: number, month: number): DayCell[] {
    const jakartaNow = getJakartaNow();
    const todayStr = toDateStr(jakartaNow);
    const currentYear = jakartaNow.getFullYear();
    const currentMonth = jakartaNow.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days: DayCell[] = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({
            date: '',
            day: 0,
            isRead: false,
            isToday: false,
            isFuture: true,
            isCurrentMonth: false,
        });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = toDateStr(date);
        const isToday = dateStr === todayStr && year === currentYear && month === currentMonth;
        const isFuture = date > jakartaNow;
        const isRead = !isFuture && dailyReads[dateStr]?.status === 'done';
        
        days.push({
            date: dateStr,
            day: day,
            isRead: isRead,
            isToday: isToday,
            isFuture: isFuture,
            isCurrentMonth: true,
        });
    }
    
    return days;
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAY_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function StreakPage() {
    const [days, setDays] = useState<DayCell[]>([]);
    const [stats, setStats] = useState({ totalSuratDibaca: 0, totalHariAktif: 0, streak: 0 });
    const [totalReadDays, setTotalReadDays] = useState(0);
    const [todayStatus, setTodayStatus] = useState<'done' | 'pending'>('pending');
    const [jakartaTime, setJakartaTime] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    const [displayMonth, setDisplayMonth] = useState('');

    const jakartaNow = getJakartaNow();
    const currentYear = jakartaNow.getFullYear();
    const currentMonth = jakartaNow.getMonth();

    useEffect(() => {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
    }, []);

    useEffect(() => {
        if (selectedYear === 0) return;
        
        setDisplayMonth(`${MONTH_NAMES[selectedMonth]} ${selectedYear}`);
        
        const reads = getDailyReads();
        const s = getStats();
        const calendar = buildCalendar(reads as Record<string, { status: string }>, selectedYear, selectedMonth);
        setDays(calendar);
        setTotalReadDays(Object.values(reads).filter((r: any) => r.status === 'done').length);
        setTodayStatus(getTodayStatus());

        const tick = () => setJakartaTime(getJakartaNow());
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [selectedMonth, selectedYear]);

    const goToPrevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const formatTime = (d: Date) =>
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

    const formatDate = (d: Date) =>
        `${DAY_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

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

                {/* Calendar - Filterable */}
                <FadeIn delay={0.2} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                    {/* Month/Year Selector */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={goToPrevMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="text-base font-semibold text-gray-800 bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                            {MONTH_NAMES.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="text-base font-semibold text-gray-800 bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        
                        <button
                            onClick={goToNextMonth}
                            disabled={selectedYear === currentYear && selectedMonth >= currentMonth}
                            className={`p-2 rounded-lg transition-colors ${selectedYear === currentYear && selectedMonth >= currentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-3">
                        {DAY_SHORT.map((label, i) => (
                            <div key={i} className="text-center text-xs font-medium text-gray-400">
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => {
                            if (!day.isCurrentMonth) {
                                return <div key={i} className="h-10" />;
                            }
                            
                            return (
                                <div
                                    key={i}
                                    title={day.isRead ? `${day.date} - Sudah baca` : day.isToday ? `${day.date} - Hari ini` : day.date}
                                    className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 relative ${
                                        day.isRead 
                                            ? 'bg-emerald-500 text-white' 
                                            : day.isToday 
                                                ? 'bg-gray-100 border-2 border-blue-400' 
                                                : day.isFuture
                                                    ? 'bg-gray-50 border border-dashed border-gray-200 text-gray-300'
                                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {day.day}
                                    {day.isToday && !day.isRead && (
                                        <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 -bottom-0.5" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-200" />
                            <span className="text-xs text-gray-500">Belum baca</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-500" />
                            <span className="text-xs text-gray-500">Sudah baca</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-100 border-2 border-blue-400" />
                            <span className="text-xs text-gray-500">Hari ini</span>
                        </div>
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