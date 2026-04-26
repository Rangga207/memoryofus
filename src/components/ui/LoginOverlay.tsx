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
      
      // Tunggu form login menghilang dan "Hii Bocill" muncul (2.5 detik)
      setTimeout(() => {
        setIsExiting(true);
        // Setelah animasi exit overlay selesai, izinkan masuk ke web
        setTimeout(onLoginSuccess, 1200); 
      }, 2500);
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
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
        <div className="relative w-full max-w-sm">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative glass-card bg-black/40 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
              >
                <div className="text-center mb-8 relative z-10">
                  <h1 className="font-serif text-3xl font-normal text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2 tracking-wide">
                    Memory of Us
                  </h1>
                  <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-light">
                    Unlock the Seal
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-white/60 transition-colors">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all focus:bg-white/10"
                        required
                      />
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-white/60 transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all focus:bg-white/10"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-light text-white flex items-center justify-center gap-2 transition-all relative overflow-hidden group ${
                      error
                        ? 'bg-red-500/10 border border-red-500/30 text-red-200'
                        : 'bg-white/10 hover:bg-white/15 border border-white/20'
                    }`}
                  >
                    {!error && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
                    )}
                    {error ? (
                      <span className="tracking-[0.15em] uppercase text-[11px]">Access Denied</span>
                    ) : (
                      <>
                        <span className="tracking-[0.2em] uppercase text-[11px]">Continue</span>
                        <ChevronRight size={14} className="opacity-50 group-hover:translate-x-1 transition-transform" />
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
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-3 left-0 right-0 text-center text-red-400/80 text-[10px] font-light tracking-widest uppercase"
                    >
                      Incorrect credentials
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="flex items-center justify-center h-48"
              >
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-wide text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
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
