import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GooeyNav({ links, activeId, onSelect, onLoginClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelect = (link, idx) => {
    if (link.id === 'login') {
      if (onLoginClick) onLoginClick();
    } else {
      onSelect(link);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2 bg-white/70 backdrop-blur-3xl p-1.5 rounded-full shadow-sm border border-gray-200">
      <div className="flex items-center gap-1 relative">
        {links.map((link, idx) => {
          const isActive = activeId === link.id;
          const isHovered = hoveredIndex === idx;

          return (
            <button
              key={link.id}
              onClick={() => handleSelect(link, idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10 ${
                link.id === 'login' ? 'bg-[#1d1d1f] text-white hover:bg-black ml-2' : 
                isActive ? 'text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              {isActive && link.id !== 'login' && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-[#1d1d1f] rounded-full z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {isHovered && !isActive && link.id !== 'login' && (
                <motion.div
                  layoutId="nav-hover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/5 rounded-full z-[-1]"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {link.icon && <link.icon size={16} />}
                {link.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
