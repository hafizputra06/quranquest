'use client';

import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto mb-6 opacity-20" />

                    <p className="text-emerald-600 font-medium italic text-lg mb-4">
                        "Membaca Al-Quran adalah investasi terbaik untuk kehidupan"
                    </p>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-900 font-black text-xl tracking-tighter">
                            QuranQuest
                        </span>
                        <p className="text-gray-400 text-sm font-medium">
                            © 2026 by <span className="text-gray-600 font-bold">Hafiz Rahadian Putra</span>
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
