'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ChevronRight, Sparkles } from 'lucide-react';

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
      // Wait for success animation before hiding overlay completely
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onLoginSuccess, 1000); // Wait for exit animation to finish
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isExiting) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="login-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      >
        <motion.div
          animate={
            isSuccess
              ? { scale: 1.2, opacity: 0, filter: 'blur(20px)', y: -50 }
              : { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }
          }
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="relative w-full max-w-md"
        >
          {/* Majestic Glow Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 rounded-[2rem] blur-xl opacity-50 animate-pulse" />
          
          <div className="relative glass-card bg-white/5 border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
            {/* Top decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="text-center mb-10 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Sparkles className="text-white/80" size={28} />
              </motion.div>
              <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-2 tracking-wide">
                Memory of Us
              </h1>
              <p className="text-white/40 text-sm tracking-widest uppercase font-light">
                Unlock the Universe
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                    required
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-medium text-white shadow-lg flex items-center justify-center gap-2 transition-all relative overflow-hidden group ${
                  isSuccess 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
                    : error
                    ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                {!isSuccess && !error && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
                {isSuccess ? (
                  <span className="tracking-widest uppercase text-sm">Welcome Back</span>
                ) : error ? (
                  <span className="tracking-widest uppercase text-sm">Access Denied</span>
                ) : (
                  <>
                    <span className="tracking-widest uppercase text-sm">Enter Cosmos</span>
                    <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Error shake animation */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, x: [-5, 5, -5, 5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-4 left-0 right-0 text-center text-red-400 text-xs font-medium tracking-wide"
                >
                  Incorrect credentials
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
