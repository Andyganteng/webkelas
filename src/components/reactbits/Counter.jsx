import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Counter({ value, direction = 'up', className = '' }) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  const { number } = useSpring({
    from: { number: direction === 'up' ? 0 : value * 2 },
    number: hasStarted ? value : (direction === 'up' ? 0 : value * 2),
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <div ref={ref} className={className}>
      <animated.span>{number.to((n) => Math.floor(n))}</animated.span>
    </div>
  );
}
