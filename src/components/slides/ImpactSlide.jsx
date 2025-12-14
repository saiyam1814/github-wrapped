import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { developerNarratives } from '../../lib/narratives';
import { Star, GitFork, Eye, Trophy } from 'lucide-react';

const ImpactSlide = ({ data }) => {
  const { impact, topRepositories } = data;
  const narratives = developerNarratives.impact;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Stars burst effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              opacity: 0,
              scale: 0,
              x: '50%',
              y: '30%',
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: 2,
              delay: 0.5 + i * 0.1,
              ease: "easeOut",
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Headline */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 mb-4 relative z-10"
      >
        {narratives.headline(impact.totalStars)}
      </motion.p>

      {/* Big Star Count */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="relative mb-4 z-10"
      >
        {/* Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 blur-3xl bg-yellow-400/30 scale-150"
        />
        
        <div className="relative flex items-center gap-4">
          <Star className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 fill-yellow-400" />
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
            <AnimatedCounter 
              value={impact.totalStars} 
              duration={2500}
              delay={600}
            />
          </h1>
        </div>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-2xl md:text-3xl font-light text-white mb-2 z-10"
      >
        stars earned
      </motion.p>

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-400 max-w-lg mb-8 text-lg text-center z-10"
      >
        {narratives.stars(impact.totalStars)}
      </motion.p>

      {/* Other Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap justify-center gap-6 mb-8 z-10"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <GitFork className="w-5 h-5 text-blue-400" />
          <span className="text-white font-bold">{impact.totalForks.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">forks</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Eye className="w-5 h-5 text-purple-400" />
          <span className="text-white font-bold">{impact.totalWatchers.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">watchers</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Trophy className="w-5 h-5 text-orange-400" />
          <span className="text-white font-bold">{impact.repositoryCount}</span>
          <span className="text-gray-500 text-sm">repos</span>
        </div>
      </motion.div>

      {/* Top Repository */}
      {impact.mostStarredRepo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full max-w-md p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Top Repository</div>
                <div className="text-white font-bold">{impact.mostStarredRepo.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="font-bold">{impact.mostStarredRepo.stars.toLocaleString()}</span>
            </div>
          </div>
          {impact.mostStarredRepo.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {impact.mostStarredRepo.description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ImpactSlide;


