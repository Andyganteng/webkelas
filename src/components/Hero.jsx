import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useData } from '../context/DataContext';
import EventCountdown from './EventCountdown';
import Counter from './reactbits/Counter';
import LightRays from './reactbits/LightRays';
import LogoSequence from './reactbits/LogoSequence';

const quotes = [
  "Programming isn't about what you know; it's about what you can figure out.",
  "Before software can be reusable it first has to be usable.",
  "Pengujian mengarah pada kegagalan, dan kegagalan mengarah pada pemahaman.",
];

export default function Hero() {
  const { members, eventData } = useData();
  const { scrollY } = useScroll();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const memberCount = members?.length || 39;

  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex(prev => (prev + 1) % quotes.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const handleExplore = () => {
    const target = document.getElementById('struktur');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  if (eventData?.isActive) {
    return <EventCountdown onExplore={handleExplore} />;
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-[#1d1d1f] pt-20">

      {/* LightRays Interactive Background - Simplified for mobile */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#d4d4d8" 
          raysSpeed={window.innerWidth < 768 ? 1.0 : 1.8}
          lightSpread={0.6}
          rayLength={1.2}
          followMouse={window.innerWidth >= 768}
          mouseInfluence={window.innerWidth < 768 ? 0 : 0.2}
          noiseAmount={window.innerWidth < 768 ? 0.02 : 0.05}
          distortion={0.05}
          pulsating={window.innerWidth >= 768}
          fadeDistance={0.6}
          saturation={1.3}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center w-full h-full justify-center min-h-[80vh] pointer-events-none">

        {/* Animated Logo Sequence from folder with Dynamic BG Removal */}
        <div className="flex flex-col items-center justify-center mb-0 select-none pointer-events-auto -mt-16 md:-mt-24">
          <LogoSequence className="h-40 md:h-64 object-contain" />
        </div>

        {/* Main Headline */}
        <motion.div style={{ y: yText, opacity: opacityText }} className="text-center w-full max-w-5xl mx-auto pointer-events-auto mt-[-20px]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-2xl text-[#86868b] font-medium tracking-tight mb-20"
          >
            {quotes[quoteIndex]}
          </motion.p>
        </motion.div>

        {/* Stats Section with Reactbits Counter */}
        <div className="w-full max-w-4xl border-t border-gray-200 pt-16 pb-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#86868b] mb-2">Members</p>
            <div className="flex items-baseline gap-1">
              <Counter value={memberCount} className="text-6xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f]" />
              <span className="text-3xl font-bold text-[#86868b]">+</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#86868b] mb-2">YEAR</p>
            <div className="flex items-baseline gap-1">
              <Counter value={2026} className="text-6xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#86868b] mb-2">CLASS</p>
            <div className="text-6xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f]">
              XI RPL 2            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
