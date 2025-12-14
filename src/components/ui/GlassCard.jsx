import { motion } from 'framer-motion';

/**
 * Glass morphism card component
 */
export function GlassCard({ 
  children, 
  className = '',
  hover = false,
  glow = false,
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        rounded-2xl p-6
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        ${hover ? 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(99,102,241,0.15)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;


