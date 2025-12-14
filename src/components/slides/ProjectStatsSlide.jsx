import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Star, GitFork, Users, GitPullRequest, CircleDot, Package } from 'lucide-react';

const ProjectStatsSlide = ({ data, variant = 'growth' }) => {
  const { repo, community, pullRequests, issues, releases } = data;

  if (variant === 'growth') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        {/* Stars Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl text-gray-400 mb-4"
        >
          The community has spoken
        </motion.p>

        {/* Big Star Count */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 blur-3xl bg-yellow-400/20 scale-150" />
          <div className="relative flex items-center gap-4">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              <AnimatedCounter value={repo.stars} duration={2500} delay={500} />
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-light text-white mb-8"
        >
          stars
        </motion.p>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8"
        >
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <GitFork className="w-5 h-5 text-blue-400" />
              <span className="text-3xl font-bold text-white">{repo.forks.toLocaleString()}</span>
            </div>
            <span className="text-sm text-gray-500">Forks</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-3xl font-bold text-white">{community.totalContributors}</span>
            </div>
            <span className="text-sm text-gray-500">Contributors</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Velocity variant
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-8"
      >
        Development velocity
      </motion.p>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-6 w-full max-w-lg"
      >
        {/* PRs Opened */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <GitPullRequest className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-4xl font-bold text-white mb-1">
            <AnimatedCounter value={pullRequests.opened} delay={600} />
          </div>
          <div className="text-sm text-gray-500">PRs Opened</div>
        </motion.div>

        {/* PRs Merged */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
            <span className="text-green-400 font-bold">✓</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            <AnimatedCounter value={pullRequests.merged} delay={700} />
          </div>
          <div className="text-sm text-gray-500">PRs Merged</div>
        </motion.div>

        {/* Issues */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <CircleDot className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-4xl font-bold text-white mb-1">
            <AnimatedCounter value={issues.opened} delay={800} />
          </div>
          <div className="text-sm text-gray-500">Issues Opened</div>
        </motion.div>

        {/* Releases */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <Package className="w-8 h-8 text-cyan-400 mb-3" />
          <div className="text-4xl font-bold text-white mb-1">
            <AnimatedCounter value={releases.count} delay={900} />
          </div>
          <div className="text-sm text-gray-500">Releases</div>
        </motion.div>
      </motion.div>

      {/* Merge Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20"
      >
        <span className="text-green-400">
          {pullRequests.mergeRate}% merge rate · {pullRequests.avgMergeTimeHours}h average merge time
        </span>
      </motion.div>
    </div>
  );
};

export default ProjectStatsSlide;


