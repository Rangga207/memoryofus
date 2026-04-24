'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { MemoryCard } from '@/components/ui/MemoryCard';
import AddMemoryModal from '@/components/ui/AddMemoryModal';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { getMemories, addMemory, removeMemory, type Memory } from '@/app/actions';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Dynamically import the 3D Canvas to avoid SSR issues
const CanvasScene = dynamic(() => import('@/components/3d/CanvasScene'), {
  ssr: false,
});

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    getMemories().then(data => setMemories(data));
    const t = setTimeout(() => setTitleVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleAdd = async (memoryData: { title: string; content: string; imageUrl?: string }) => {
    const newMemory = await addMemory(memoryData);
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleDelete = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    await removeMemory(id);
  };

  return (
    <main className="relative min-h-[100dvh]">
      {/* 3D Background */}
      <ErrorBoundary>
        <CanvasScene memories={memories} />
      </ErrorBoundary>

      {/* Radial gradient vignette overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-[max(3rem,env(safe-area-inset-top))] pb-6 text-center px-6">
        <AnimatePresence>
          {titleVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.5, ease: 'easeOut' }}
              >
                {/* Celestial Orbit Divider */}
                <div className="flex items-center gap-4 mb-5 opacity-80">
                  <div className="w-16 sm:w-32 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.5em] text-white/80 font-light ml-[0.25em]">
                    Final Chapter
                  </span>
                  <div className="w-16 sm:w-32 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
                </div>

                {/* Starry Text */}
                <motion.p
                  className="flex items-center justify-center gap-3 text-white/40 text-[11px] sm:text-[13px] font-light tracking-[0.2em] uppercase w-full max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.8, ease: 'easeOut' }}
                >
                  <span className="text-white/20 text-[10px]">✧</span>
                  <span className="text-center">Some endings are necessary for us to grow</span>
                  <span className="text-white/20 text-[10px]">✧</span>
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Memory Grid */}
      <section className="relative z-10 px-4 pb-safe max-w-4xl mx-auto" style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}>
        {memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >

            <p className="text-white/40 text-sm max-w-[220px]">
              No memories yet. Tap the{' '}
              <span className="text-white font-medium">+</span> button to add your first one.
            </p>
          </motion.div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 pt-4">
            {memories.map((memory, i) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add Memory FAB */}
      <AddMemoryModal onAdd={handleAdd} />

      {/* Music Player */}
      <AudioPlayer />
    </main>
  );
}
