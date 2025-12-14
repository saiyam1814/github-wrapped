import { motion } from 'framer-motion';

/**
 * Animated gradient text component
 */
export function GradientText({ 
  children, 
  className = '',
  gradient = 'from-indigo-400 via-purple-400 to-pink-400',
  animate = true,
  delay = 0,
}) {
  return (
    <motion.span
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: animate ? '200% 200%' : '100% 100%',
        animation: animate ? 'gradient 4s ease infinite' : 'none',
      }}
    >
      {children}
    </motion.span>
  );
}

export default GradientText;


