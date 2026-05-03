import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dock({ items, activeId, onSelect }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div className="flex items-end justify-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl mx-auto w-max">
      {items.map((item, index) => {
        const isActive = activeId === item.id;
        const isHovered = !isTouchDevice && hoveredIndex === index;
        const isNeighbor = !isTouchDevice && hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;
        
        let scale = 1;
        let y = 0;
        
        if (!isTouchDevice) {
          if (isHovered) { scale = 1.4; y = -10; }
          else if (isNeighbor) { scale = 1.15; y = -5; }
        }
        
        if (isActive && isTouchDevice) {
          scale = 1.1; // Slight scale for active on touch
        }

        return (
          <motion.button
            key={item.id}
            onClick={() => onSelect(item)}
            onMouseEnter={() => !isTouchDevice && setHoveredIndex(index)}
            onMouseLeave={() => !isTouchDevice && setHoveredIndex(null)}
            animate={{ scale, y }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative flex flex-col items-center justify-end"
            style={{ width: 44, height: 44 }}
          >
            <AnimatePresence>
              {isHovered && !isTouchDevice && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.8 }}
                  className="absolute -top-10 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded-md whitespace-nowrap"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
            <div 
              className={`w-full h-full rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isActive ? 'bg-[#1d1d1f] text-white shadow-md' : 'bg-white/80 text-[#1d1d1f] shadow-sm'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {isActive && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#1d1d1f]" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
