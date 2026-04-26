'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ChevronRight } from 'lucide-react';

interface LoginOverlayProps {
  onLoginSuccess: () => void;
}

export function LoginOverlay({ onLoginSuccess }: LoginOverlayProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'katarinacakra230706@gmail.com' && password === 'DwiCantikBGT') {
      setError(false);
      setIsSuccess(true);
      
      // Urutan waktu untuk animasi super smooth
      // Tunggu 3.5 detik untuk membiarkan "Hii Bocill" tampil penuh
      setTimeout(() => {
        setIsExiting(true);
        // Tunggu 1.5 detik agar overlay menghilang mulus sebelum memuat web utama
        setTimeout(onLoginSuccess, 1500); 
      }, 3500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="login-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl"
        >
          <div className="relative w-full max-w-sm">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 sm:p-10 shadow-[0_0_80px_rgba(255,255,255,0.03)]"
                >
                  <div className="text-center mb-10 relative z-10">
                    <h1 className="font-serif text-3xl font-light text-white/90 mb-3 tracking-wider">
                      Memory of Us
                    </h1>
                    <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase font-light">
                      Unlock the Seal
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors duration-500">
                          <Mail size={16} strokeWidth={1.5} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full bg-white/[0.02] border-b border-white/5 rounded-t-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 font-light"
                          required
                        />
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors duration-500">
                          <Lock size={16} strokeWidth={1.5} />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full bg-white/[0.02] border-b border-white/5 rounded-t-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 font-light"
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-light text-white flex items-center justify-center gap-2 transition-all duration-500 relative overflow-hidden group ${
                        error
                          ? 'bg-red-500/10 text-red-300 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/[0.05] shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                      }`}
                    >
                      {!error && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
                      )}
                      {error ? (
                        <span className="tracking-[0.2em] uppercase text-[10px]">Access Denied</span>
                      ) : (
                        <>
                          <span className="tracking-[0.25em] uppercase text-[10px]">Continue</span>
                          <ChevronRight size={14} strokeWidth={1.5} className="opacity-40 group-hover:translate-x-1 group-hover:opacity-80 transition-all duration-500" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0, x: [-5, 5, -5, 5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute bottom-3 left-0 right-0 text-center text-red-400/60 text-[9px] font-light tracking-[0.2em] uppercase"
                      >
                        Incorrect credentials
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center h-48"
                >
                  <h2 className="font-serif text-4xl sm:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-widest text-center">
                    Hii Bocill
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
