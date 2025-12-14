import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated number counter with easing
 */
export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  formatFn = null,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      
      if (elapsed < delay) {
        animationFrame.current = requestAnimationFrame(animate);
        return;
      }
      
      const progress = Math.min((elapsed - delay) / duration, 1);
      // Easing function: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(numericValue * eased));
      
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [value, duration, delay]);

  const formattedValue = formatFn 
    ? formatFn(displayValue) 
    : displayValue.toLocaleString();

  return (
    <motion.span
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
}

/**
 * Format large numbers with K/M suffix
 */
export function formatCompactNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export default AnimatedCounter;


