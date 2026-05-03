import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import Counter from './reactbits/Counter';

export default function EventCountdown({ onExplore }) {
  const { eventData } = useData();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [eventData]);

  const bgImage = eventData?.backgroundImage || "https://images.unsplash.com/photo-1533200922676-46c5357876a4?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10"
        />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={bgImage}
          alt="Event Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          {eventData?.description && (
            <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white/60 mb-6">
              {eventData.description}
            </p>
          )}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-2xl leading-none">
            {eventData?.title || 'Event Acara'}
          </h1>
        </motion.div>

        <div className="w-full max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + (index * 0.1), type: "spring" }}
                className="flex flex-col items-center"
              >
                {/* Use Counter component for the numbers */}
                <Counter 
                  value={value} 
                  className="text-5xl md:text-8xl lg:text-9xl font-bold tabular-nums tracking-tighter text-white" 
                />
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/50 mt-4">
                  {unit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onExplore}
          className="group flex flex-col items-center gap-4 text-white/50 hover:text-white transition-colors"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Explore</span>
          <ChevronDown size={24} className="animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
