'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface AddMemoryModalProps {
    onAdd: (data: { title: string; content: string; imageUrl?: string }) => Promise<void> | void;
}

export default function AddMemoryModal({ onAdd }: AddMemoryModalProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // compress for localstorage quota
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setImage(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        
        try {
            await onAdd({ title, content, imageUrl: image || undefined });
            setTitle('');
            setContent('');
            setImage(null);
            setOpen(false);
        } catch (error) {
            alert('Gagal menyimpan memori ke database!');
        }
    };

    return (
        <>
            {/* FAB Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="fixed z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 shadow-lg shadow-black/20 flex items-center justify-center text-white backdrop-blur-md touch-target"
                style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))', left: '1.5rem' }}
                aria-label="Add Memory"
            >
                <Plus size={24} />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="relative w-full sm:max-w-md sm:mx-4 glass-card sm:rounded-3xl rounded-t-[2rem] p-6 overflow-y-auto hide-scrollbar"
                            style={{
                                maxHeight: '92dvh',
                                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                            }}
                        >
                            {/* Drag handle pill for mobile */}
                            <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-serif text-lg font-semibold text-white">New Memory</h2>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-white/40 hover:text-white transition-colors touch-target flex items-center justify-center rounded-full"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload & Preview */}
                                {image ? (
                                    <div className="relative w-full rounded-xl overflow-hidden mb-2">
                                        <img src={image} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 backdrop-blur-md transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer text-white/50 hover:bg-white/10 hover:text-white transition group focus-within:ring-1 focus-within:ring-white/40 focus-within:border-white/30"
                                            tabIndex={0}
                                        >
                                            <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-medium">Add Photo</span>
                                        </label>
                                    </div>
                                )}

                                {/* Title */}
                                <div>
                                    <label className="text-xs text-white/50 mb-1.5 block">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="A beautiful moment..."
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/30 transition"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="text-xs text-white/50 mb-1.5 block">Memory</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write down what happened, how you felt..."
                                        required
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/30 transition resize-none"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-sm shadow-lg shadow-black/20 hover:bg-white/20 transition-all font-sans"
                                >
                                    Save Memory
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
