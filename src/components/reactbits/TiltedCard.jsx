import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function TiltedCard({ children, className = '' }) {
  const ref = useRef(null);
  
  const x = useSpring(0, { stiffness: 400, damping: 40, mass: 0.5 });
  const y = useSpring(0, { stiffness: 400, damping: 40, mass: 0.5 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Support for both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    // Limit rotation to a small degree to prevent heavy/glitchy look
    const rX = (mouseY / height - 0.5) * -15;
    const rY = (mouseX / width - 0.5) * 15;
    
    x.set(rY);
    y.set(rX);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      style={{
        rotateX: y,
        rotateY: x,
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-[1200px] ${className}`}
    >
      <motion.div
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
