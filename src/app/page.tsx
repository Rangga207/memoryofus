'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image as ImageIcon, LayoutGrid, Sparkles, CalendarDays, Heart, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { MemoryCard } from '@/components/ui/MemoryCard';
import AddMemoryModal from '@/components/ui/AddMemoryModal';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { getMemories, addMemory, removeMemory, updateMemory, type Memory } from '@/app/actions';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoginOverlay } from '@/components/ui/LoginOverlay';

// Dynamically import the 3D Canvas to avoid SSR issues
const CanvasScene = dynamic(() => import('@/components/3d/CanvasScene'), {
  ssr: false,
});

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [titleVisible, setTitleVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'memories' | 'gallery'>('memories');

  const filteredMemories = useMemo(() => {
    return memories.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [memories, searchQuery]);

  const allImages = useMemo(() => {
    return filteredMemories.flatMap(m => {
      const imgs = [];
      if (m.imageUrl) imgs.push(m.imageUrl);
      if (m.imageUrls) imgs.push(...m.imageUrls);
      return imgs;
    });
  }, [filteredMemories]);

  useEffect(() => {
    const auth = localStorage.getItem('memory_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    getMemories().then(data => setMemories(data));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const t = setTimeout(() => setTitleVisible(true), 300);
      const t2 = setTimeout(() => setInitialLoad(false), 3000);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    localStorage.setItem('memory_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleAdd = async (memoryData: { title: string; content: string; imageUrl?: string; imageUrls?: string[] }) => {
    const newMemory = await addMemory(memoryData);
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleDelete = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    await removeMemory(id);
  };

  const handleUpdate = async (id: string, data: Partial<Memory>) => {
    // First optimally update local state for immediate feedback
    const currentDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, ...data, date: currentDate } : m));
    
    // Send update to server
    const updatedMemory = await updateMemory(id, data);
    if (updatedMemory) {
       // Ensure state exactly matches the server returned object
       setMemories((prev) => prev.map((m) => m.id === id ? updatedMemory : m));
    }
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

      {isAuthenticated === false && (
        <LoginOverlay onLoginSuccess={handleLoginSuccess} />
      )}

      {isAuthenticated === true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col min-h-screen"
        >

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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
                  transition={{ delay: 0.8, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Navigation & Search */}
      <section className="relative z-10 px-4 max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'memories' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <LayoutGrid size={16} /> Memories
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'gallery' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <ImageIcon size={16} /> Gallery
          </button>
        </div>

        <div className="relative w-full sm:w-64 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-white/70 transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all font-light"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 px-4 pb-safe max-w-4xl mx-auto" style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'memories' ? (
            <motion.div
              key="memories-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredMemories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center py-24 gap-4 text-center"
                >
                  <p className="text-white/40 text-sm max-w-[220px]">
                    {searchQuery ? "No memories match your search." : "No memories yet. Tap the + button to add your first one."}
                  </p>
                </motion.div>
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 pt-4">
                  {filteredMemories.map((memory, i) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      index={i}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                      isInitialLoad={initialLoad}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="gallery-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {allImages.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-white/40 text-sm">No images found.</p>
                </div>
              ) : (
                allImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    className="aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-pointer relative"
                  >
                    <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Add Memory FAB */}
      <AddMemoryModal onAdd={handleAdd} />

      {/* Music Player */}
      <AudioPlayer />
        </motion.div>
      )}
    </main>
  );
}
