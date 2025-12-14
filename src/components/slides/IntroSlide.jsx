import { motion } from 'framer-motion';
import { developerNarratives, projectNarratives } from '../../lib/narratives';

const IntroSlide = ({ data, onNext }) => {
  const isUser = data.type === 'developer';
  const narratives = isUser ? developerNarratives : projectNarratives;
  const name = isUser ? data.user.name : data.repo.name;
  const avatarUrl = isUser ? data.user.avatarUrl : null;
  const year = data.year || 2024;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-500/20"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{ 
              y: '-20%',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Avatar or Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        {/* Glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 blur-xl opacity-50 scale-110" />
        <div className="pulse-ring bg-gradient-to-r from-indigo-500/50 to-pink-500/50" />
        
        {isUser && avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover"
          />
        ) : (
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center border-4 border-white/20 shadow-2xl">
            <span className="text-5xl md:text-6xl font-bold text-white">
              {name[0]?.toUpperCase()}
            </span>
          </div>
        )}
      </motion.div>

      {/* Greeting */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        {narratives.intro.greeting(name)}
      </motion.p>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
      >
        Your{' '}
        <span className="text-gradient">{year}</span>
        <br />
        <span className="text-gradient">GitHub Wrapped</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-lg md:text-xl text-gray-500 mb-10 max-w-md"
      >
        {narratives.intro.subtitle}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
      >
        {/* Button background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Button content */}
        <span className="relative flex items-center gap-2 text-white">
          Let's Go
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            →
          </motion.span>
        </span>
      </motion.button>

      {/* Year indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-600"
      >
        <span className="w-8 h-[1px] bg-gray-700" />
        <span className="text-sm font-mono">{year}</span>
        <span className="w-8 h-[1px] bg-gray-700" />
      </motion.div>
    </div>
  );
};

export default IntroSlide;


