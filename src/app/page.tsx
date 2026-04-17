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
                className="flex items-center justify-center mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-slate-300/40 font-light">
                  Final Chapter
                </span>
              </motion.div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium text-white/90 text-glow tracking-tight leading-[1.1] sm:leading-[1]">
                Memory of Us
              </h1>
              <motion.p
                className="text-slate-300/50 text-sm sm:text-base max-w-md mx-auto font-light tracking-[0.15em] mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
              >
                Some endings are necessary for us to grow.
              </motion.p>
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
