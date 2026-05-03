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
  const [timeLeft, setTimeLeft] = useState({ Hari: 0, Jam: 0, Menit: 0, Detik: 0 });

  const memberCount = members?.length || 39;

  function calculateTimeLeft() {
    if (!eventData?.targetDate) return { Hari: 0, Jam: 0, Menit: 0, Detik: 0 };
    const difference = +new Date(eventData.targetDate) - +new Date();
    if (difference > 0) {
      return {
        Hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Menit: Math.floor((difference / 1000 / 60) % 60),
        Detik: Math.floor((difference / 1000) % 60)
      };
    }
    return { Hari: 0, Jam: 0, Menit: 0, Detik: 0 };
  }

  useEffect(() => {
    if (eventData?.isActive) {
      const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
      return () => clearInterval(timer);
    } else {
      const interval = setInterval(() => setQuoteIndex(prev => (prev + 1) % quotes.length), 5000);
      return () => clearInterval(interval);
    }
  }, [eventData]);

  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const handleExplore = () => {
    const target = document.getElementById('struktur');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-[#1d1d1f] pt-20">

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {eventData?.isActive && eventData?.backgroundImage ? (
          <>
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src={eventData.backgroundImage} 
              alt="Event Background" 
              className="w-full h-full object-cover"
            />
          </>
        ) : (
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
        )}
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center w-full h-full justify-center min-h-[80vh] pointer-events-none">

        <div className={`flex flex-col items-center justify-center mb-0 select-none pointer-events-auto md:-mt-64 ${eventData?.isActive ? 'invert brightness-200' : ''}`}>
          <LogoSequence className="w-[70vw] h-auto max-w-[200px] md:max-w-none md:h-[700px] object-contain" />
        </div>

        {/* Main Headline */}
        <motion.div style={{ y: yText, opacity: opacityText }} className={`text-center w-full max-w-5xl mx-auto pointer-events-auto mt-[-10px] ${eventData?.isActive ? 'text-white' : ''}`}>
          {eventData?.isActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
               <span className="text-blue-400 font-bold text-xs md:text-sm uppercase tracking-[0.4em] mb-4 block">
                Countdown Event
              </span>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-12">
                {eventData.title}
              </h1>
              
              <div className="grid grid-cols-4 gap-4 md:gap-12 mb-16">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <Counter value={value} className="text-4xl md:text-7xl font-bold tracking-tighter text-white" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 mt-2">{unit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg md:text-2xl text-[#86868b] font-medium tracking-tight mb-20"
            >
              {quotes[quoteIndex]}
            </motion.p>
          )}
        </motion.div>

        {/* Stats Section with Reactbits Counter */}
        <div className={`w-full max-w-4xl border-t ${eventData?.isActive ? 'border-white/20' : 'border-gray-200'} pt-12 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center pointer-events-auto`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${eventData?.isActive ? 'text-white/60' : 'text-[#86868b]'} mb-2`}>Members</p>
            <div className="flex items-baseline gap-1">
              <Counter value={memberCount} className={`text-5xl md:text-7xl font-bold tracking-tighter ${eventData?.isActive ? 'text-white' : 'text-[#1d1d1f]'}`} />
              <span className={`text-2xl md:text-3xl font-bold ${eventData?.isActive ? 'text-white/60' : 'text-[#86868b]'}`}>+</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${eventData?.isActive ? 'text-white/60' : 'text-[#86868b]'} mb-2`}>YEAR</p>
            <div className="flex items-baseline gap-1">
              <Counter value={2026} className={`text-5xl md:text-7xl font-bold tracking-tighter ${eventData?.isActive ? 'text-white' : 'text-[#1d1d1f]'}`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${eventData?.isActive ? 'text-white/60' : 'text-[#86868b]'} mb-2`}>CLASS</p>
            <div className={`text-5xl md:text-7xl font-bold tracking-tighter ${eventData?.isActive ? 'text-white' : 'text-[#1d1d1f]'}`}>
              XI RPL 2
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
