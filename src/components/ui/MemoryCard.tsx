'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, Calendar } from 'lucide-react';
import { type Memory } from '@/app/actions';

export const CARD_COLORS = [
    { bg: 'from-white/10 to-white/5', border: 'border-white/20', accent: '#ffffff' },
    { bg: 'from-slate-500/10 to-slate-400/5', border: 'border-slate-500/20', accent: '#cbd5e1' },
    { bg: 'from-zinc-500/10 to-zinc-400/5', border: 'border-zinc-500/20', accent: '#e4e4e7' },
];

interface MemoryCardProps {
    memory: Memory;
    index: number;
    onDelete: (id: string) => void;
}

export function MemoryCard({ memory, index, onDelete }: MemoryCardProps) {
    const [expanded, setExpanded] = useState(false);
    const colorIndex = index % CARD_COLORS.length;
    const colorSet = CARD_COLORS[colorIndex];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`break-inside-avoid mb-4 cursor-pointer relative rounded-2xl p-4 glass-card bg-gradient-to-br ${colorSet.bg} border ${colorSet.border} transition-shadow duration-300`}
                style={{ boxShadow: `0 4px 32px 0 ${colorSet.accent}20` }}
                onClick={() => setExpanded(true)}
            >
                {memory.imageUrl && (
                    <div className="-mx-4 -mt-4 mb-3 relative max-h-48 overflow-hidden rounded-t-2xl border-b border-white/10">
                        <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex items-start justify-between mb-2 relative z-10">
                    <div className="flex-1" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(memory.id);
                        }}
                        className="text-white/30 hover:text-red-400 transition-colors p-2 -mr-1 rounded-lg hover:bg-red-500/10 touch-target flex items-center justify-center"
                        aria-label="Delete memory"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
                <h3 className="font-serif font-semibold text-white text-lg leading-snug mb-2 line-clamp-2">
                    {memory.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {memory.content}
                </p>
                <div className="flex items-center gap-1 mt-3 text-white/30">
                    <Calendar size={10} />
                    <span className="text-[10px]">{memory.date}</span>
                </div>
            </motion.div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
                        onClick={() => setExpanded(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className={`relative w-full sm:max-w-md sm:mx-4 overflow-y-auto hide-scrollbar sm:rounded-3xl rounded-t-[2rem] p-6 glass-card bg-gradient-to-br ${colorSet.bg} border ${colorSet.border}`}
                            style={{
                                boxShadow: `0 8px 64px 0 ${colorSet.accent}40`,
                                maxHeight: '90dvh',
                                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag handle pill for mobile */}
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                            <button
                                onClick={() => setExpanded(false)}
                                className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors bg-black/30 p-2 rounded-full backdrop-blur-md touch-target flex items-center justify-center"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                            {memory.imageUrl && (
                                <div className="-mx-6 -mt-6 mb-5 relative max-h-96 overflow-hidden rounded-t-3xl border-b border-white/10">
                                    <img src={memory.imageUrl} alt={memory.title} className="w-full h-auto max-h-[50vh] object-cover" />
                                </div>
                            )}

                            <h2 className="font-serif text-xl font-semibold text-white mb-3 relative z-10 mt-1">
                                {memory.title}
                            </h2>
                            <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">
                                {memory.content}
                            </p>
                            <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-white/10">
                                <Heart size={12} className="text-pink-400" />
                                <span className="text-white/40 text-xs">{memory.date}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
