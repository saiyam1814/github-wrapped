import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { developerNarratives, formatDateShort } from '../../lib/narratives';
import { Flame, Calendar, TrendingUp } from 'lucide-react';

const StreakSlide = ({ data }) => {
  const { activity } = data;
  const narratives = developerNarratives.streak;

  // Generate streak visualization bars
  const streakBars = Array.from({ length: Math.min(activity.longestStreak, 50) }, (_, i) => ({
    height: 20 + Math.random() * 60,
    delay: i * 0.02,
  }));

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      {/* Headline */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 mb-6"
      >
        {narratives.headline(activity.longestStreak)}
      </motion.p>

      {/* Streak visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-end justify-center gap-[2px] h-24 mb-8"
      >
        {streakBars.map((bar, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${bar.height}%` }}
            transition={{ 
              delay: 0.6 + bar.delay,
              duration: 0.5,
              ease: "easeOut"
            }}
            className="w-1.5 md:w-2 rounded-full bg-gradient-to-t from-orange-500 to-yellow-400"
            style={{ opacity: 0.5 + (i / streakBars.length) * 0.5 }}
          />
        ))}
      </motion.div>

      {/* Big Number with Fire Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
        className="relative flex items-center justify-center gap-4 mb-4"
      >
        {/* Fire glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-500/40 to-red-500/40 scale-150"
        />
        
        <Flame className="relative w-16 h-16 md:w-20 md:h-20 text-orange-400" />
        
        <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
          <AnimatedCounter 
            value={activity.longestStreak} 
            duration={2000}
            delay={1000}
          />
        </h1>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-2xl md:text-3xl font-light text-white mb-2"
      >
        day streak
      </motion.p>

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="text-gray-400 max-w-lg mb-8 text-lg"
      >
        {narratives.body(
          activity.longestStreak,
          formatDateShort(activity.longestStreakStart),
          formatDateShort(activity.longestStreakEnd)
        )}
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="flex flex-wrap justify-center gap-6"
      >
        {/* Current Streak */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
          <Flame className="w-5 h-5 text-orange-400" />
          <div className="text-left">
            <div className="text-xs text-gray-500">Current Streak</div>
            <div className="text-lg font-bold text-white">
              {activity.currentStreak} days
            </div>
          </div>
        </div>

        {/* Active Days */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
          <Calendar className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <div className="text-xs text-gray-500">Active Days</div>
            <div className="text-lg font-bold text-white">
              {activity.totalActiveDays} / {activity.totalDays}
            </div>
          </div>
        </div>

        {/* Consistency */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <div className="text-xs text-gray-500">Consistency</div>
            <div className="text-lg font-bold text-white">
              {Math.round((activity.totalActiveDays / activity.totalDays) * 100)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Encouragement */}
      {activity.currentStreak > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-sm text-orange-400/80"
        >
          🔥 {narratives.encouragement(activity.currentStreak)}
        </motion.p>
      )}
    </div>
  );
};

export default StreakSlide;


