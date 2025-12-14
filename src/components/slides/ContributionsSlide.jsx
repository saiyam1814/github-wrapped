import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { developerNarratives } from '../../lib/narratives';
import { GitCommit, GitPullRequest, CircleDot, Eye } from 'lucide-react';

const ContributionsSlide = ({ data }) => {
  const { contributions, activity } = data;
  const narratives = developerNarratives.contributions;

  const stats = [
    { 
      label: 'Commits', 
      value: contributions.commits, 
      icon: GitCommit,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    { 
      label: 'Pull Requests', 
      value: contributions.pullRequests, 
      icon: GitPullRequest,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    { 
      label: 'Issues', 
      value: contributions.issues, 
      icon: CircleDot,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    { 
      label: 'Reviews', 
      value: contributions.reviews, 
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      {/* Headline */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 mb-4"
      >
        {narratives.headline(contributions.total)}
      </motion.p>

      {/* Big Number */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="relative mb-4"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-500/30 to-pink-500/30 scale-150" />
        
        <h1 className="relative text-7xl md:text-9xl font-black text-gradient glow">
          <AnimatedCounter 
            value={contributions.total} 
            duration={2500}
            delay={600}
          />
        </h1>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-2xl md:text-3xl font-light text-white mb-2"
      >
        contributions
      </motion.p>

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-400 max-w-lg mb-10 text-lg"
      >
        {narratives.body(contributions.total, activity.averagePerDay)}
      </motion.p>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 border border-white/5`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2 mx-auto`} />
            <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
              <AnimatedCounter value={stat.value} delay={1600 + index * 100} duration={1500} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily average badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm text-gray-400">
          That's <span className="text-white font-semibold">{activity.averagePerDay}</span> contributions per active day
        </span>
      </motion.div>
    </div>
  );
};

export default ContributionsSlide;


