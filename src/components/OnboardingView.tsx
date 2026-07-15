import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Ticket, Navigation, ShieldCheck } from 'lucide-react';
import { IMAGES } from '../data';

interface OnboardingViewProps {
  onSkip: () => void;
}

const slides = [
  {
    title: "Book Bus Tickets Easily",
    description: "Find and book your next journey in just a few taps. Connect with premium services instantly.",
    image: IMAGES.onboardingBus,
    badgeTitle: "Fast Booking",
    badgeSub: "Instant Confirmation",
    badgeIcon: Ticket,
    badgeBg: "bg-blue-500"
  },
  {
    title: "Explore Seamless Travel",
    description: "Discover sustainable, scenic journeys across continents with executive comforts and flexible terms.",
    image: IMAGES.splashBusCard,
    badgeTitle: "Scenic Routes",
    badgeSub: "Curated Coastal Drives",
    badgeIcon: Navigation,
    badgeBg: "bg-emerald-500"
  },
  {
    title: "Travel with Total Safety",
    description: "Every journey is protected with certified premium logistics partners, 24/7 care, and clean sanitation.",
    image: IMAGES.onboardingBus,
    badgeTitle: "Safe & Secure",
    badgeSub: "Fully Guarded Transit",
    badgeIcon: ShieldCheck,
    badgeBg: "bg-amber-500"
  }
];

export default function OnboardingView({ onSkip }: OnboardingViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onSkip();
    }
  };

  const slideData = slides[currentSlide];
  const BadgeIcon = slideData.badgeIcon;

  return (
    <div className="relative min-h-screen w-full bg-background text-on-background flex flex-col justify-between overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Header with Skip button */}
      <header className="flex justify-end w-full px-6 pt-6">
        <button 
          id="onboard-skip"
          onClick={onSkip}
          className="text-sm font-semibold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-fixed-dim transition-colors py-2 px-4 rounded-full active:scale-95 duration-200 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* Slide Illustration Area */}
      <div className="flex-grow flex items-center justify-center px-6 py-6 relative">
        <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
          {/* Abstract Dashed Orbiting Decor */}
          <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_40s_linear_infinite]" />
          
          {/* Main Rounded Frame */}
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white dark:border-slate-800"
          >
            <img 
              className="w-full h-full object-cover" 
              src={slideData.image} 
              alt={slideData.title}
            />
          </motion.div>

          {/* Floating Badge (Soft Glass) */}
          <motion.div 
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -bottom-4 -right-4 glass-card p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce-slow border border-white/50 dark:border-slate-700/50"
            style={{ animationDuration: '4s' }}
          >
            <div className={`w-10 h-10 rounded-full ${slideData.badgeBg} flex items-center justify-center text-white shadow-sm`}>
              <BadgeIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-primary dark:text-blue-300 font-extrabold uppercase tracking-wide">
                {slideData.badgeTitle}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {slideData.badgeSub}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Canvas (Bottom Card) */}
      <div className="px-6 pb-12 w-full max-w-md mx-auto">
        <div className="glass-card rounded-[24px] p-6 flex flex-col items-center text-center">
          <motion.h2 
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-on-background mb-3 font-display uppercase tracking-tight"
          >
            {slideData.title}
          </motion.h2>

          <motion.p 
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-500 dark:text-slate-400 mb-6 px-2 leading-relaxed font-sans"
          >
            {slideData.description}
          </motion.p>

          {/* Dot Indicators */}
          <div className="flex gap-2 mb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Next CTA button */}
          <button 
            id="onboard-next"
            onClick={handleNext}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-black uppercase tracking-wider border-2 border-outline hover:bg-primary/95 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer text-sm"
          >
            {currentSlide === slides.length - 1 ? 'Start Journey' : 'Next'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer info label */}
        <footer className="w-full text-center mt-6">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            TravelGo © 2026 • Premium Logistics System
          </p>
        </footer>
      </div>
    </div>
  );
}
