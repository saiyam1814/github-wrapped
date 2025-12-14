import { motion } from 'framer-motion';
import { Star, GitFork, Users, Package } from 'lucide-react';
import { projectNarratives } from '../../lib/narratives';

const ProjectIntroSlide = ({ data, onNext }) => {
  const { repo, personality } = data;
  const narratives = projectNarratives;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Star, GitFork, Users, Package].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Icon className="w-16 h-16" />
          </motion.div>
        ))}
      </div>

      {/* Project Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 blur-xl opacity-50 scale-110" />
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center border-4 border-white/20 shadow-2xl">
          <span className="text-5xl md:text-6xl font-bold text-white">
            {repo.name[0]?.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* Project Name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-6xl font-black mb-2"
      >
        <span className="text-gradient">{repo.name}</span>
      </motion.h1>

      {/* Owner */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-gray-500 mb-6"
      >
        {repo.nameWithOwner}
      </motion.p>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold">{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-blue-400" />
          <span className="text-white font-bold">{repo.forks.toLocaleString()}</span>
        </div>
        {repo.language && (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: repo.languageColor || '#6366f1' }}
            />
            <span className="text-gray-400">{repo.language}</span>
          </div>
        )}
      </motion.div>

      {/* Description */}
      {repo.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-gray-400 max-w-md mb-8 text-lg"
        >
          {repo.description}
        </motion.p>
      )}

      {/* Year Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        className="text-2xl font-light text-gray-500 mb-8"
      >
        {narratives.intro.year(data.year)}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500" />
        <span className="relative flex items-center gap-2 text-white">
          See the stats
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            →
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
};

export default ProjectIntroSlide;


