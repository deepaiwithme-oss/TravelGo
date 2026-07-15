import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bus as BusIcon, Shield, Sparkles } from 'lucide-react';
import { IMAGES } from '../data';

interface SplashViewProps {
  onContinue: () => void;
  onLogin: () => void;
}

const statusLines = [
  "Initializing premium routes...",
  "Checking fleet status...",
  "Syncing operator timetables...",
  "Finding the best exclusive rates...",
  "Applying premium configurations...",
  "Almost ready to depart!"
];

export default function SplashView({ onContinue, onLogin }: SplashViewProps) {
  const [loadingText, setLoadingText] = useState(statusLines[0]);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => {
        const next = (prev + 1) % statusLines.length;
        setLoadingText(statusLines[next]);
        return next;
      });
    }, 1800);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#F0F0F0] flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Section - Logo & Branding */}
      <motion.div 
        className="relative z-10 pt-16 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-20 h-20 bg-primary border-4 border-white flex items-center justify-center shadow-2xl mb-4 animate-float">
          <BusIcon className="w-12 h-12 text-[#050505]" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-widest font-display text-primary">
          TravelGo
        </h1>
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1.5">
          Premium Coach Booking Platform
        </p>
      </motion.div>

      {/* Middle Section - Bus card illustration */}
      <motion.div 
        className="relative z-10 w-full max-w-md mx-auto px-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="glass-panel p-4 rounded-[32px] shadow-2xl flex flex-col items-center overflow-hidden border border-white/20">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-inner">
            <img 
              className="w-full h-full object-cover" 
              src={IMAGES.splashBusCard} 
              alt="Premium executive coach traveling along a winding seaside highway during a majestic dusk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
          <div className="mt-4 w-full flex justify-between items-center px-1">
            <div className="flex flex-col text-left">
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Premium Fleet
              </span>
              <span className="text-white font-semibold text-lg">Executive Comfort</span>
            </div>
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section - Actions & Loading bar */}
      <motion.div 
        className="relative z-10 w-full max-w-sm mx-auto px-6 pb-16 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {/* Core Actions */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button 
            id="splash-get-started"
            onClick={onContinue}
            className="w-full bg-primary text-[#050505] font-black uppercase tracking-wider py-4 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-white active:scale-[0.98] transition-all cursor-pointer text-center text-sm"
          >
            Get Started (Book as Guest)
          </button>
          
          <button 
            id="splash-login"
            onClick={onLogin}
            className="w-full bg-transparent text-[#F0F0F0] border-2 border-white/20 font-black uppercase tracking-wider py-4 shadow-[4px_4px_0px_0px_rgba(242,125,38,1)] hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer text-center text-sm flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-primary" /> Login as Alex Johnson
          </button>
        </div>

        {/* Loading Progress Bar Indicator */}
        <div className="w-full flex flex-col items-center">
          <p className="text-white/60 text-[10px] tracking-wider uppercase font-semibold mb-2">
            PREPARING YOUR ROUTES
          </p>
          <div className="loader-bar">
            <div className="loader-progress" />
          </div>
          
          <motion.p 
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-3 text-white/40 text-[10px] font-bold uppercase tracking-widest text-center"
          >
            {loadingText}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
