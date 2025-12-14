import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { developerNarratives } from '../../lib/narratives';
import { Users, GitPullRequest, MessageSquare, Globe, Shield, Building } from 'lucide-react';

const CollaborationSlide = ({ data }) => {
  const { collaboration, user } = data;
  const narratives = developerNarratives.collaboration;

  const isOSSChampion = collaboration.externalContributions >= 10;
  const isReviewer = collaboration.reviewToCommitRatio >= 0.3;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Headline */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 mb-4"
      >
        {narratives.headline(collaboration.externalContributions, collaboration.reviewCount)}
      </motion.p>

      {/* Main stat based on what's more impressive */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 scale-150" />
        
        <div className="relative flex items-center gap-4">
          {isOSSChampion ? (
            <>
              <Globe className="w-16 h-16 text-cyan-400" />
              <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                <AnimatedCounter 
                  value={collaboration.externalContributions} 
                  duration={2000}
                  delay={600}
                />
              </h1>
            </>
          ) : (
            <>
              <Shield className="w-16 h-16 text-purple-400" />
              <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                <AnimatedCounter 
                  value={collaboration.reviewCount} 
                  duration={2000}
                  delay={600}
                />
              </h1>
            </>
          )}
        </div>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-2xl font-light text-white mb-2"
      >
        {isOSSChampion ? 'external contributions' : 'code reviews'}
      </motion.p>

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-400 max-w-lg mb-10 text-lg text-center"
      >
        {isOSSChampion 
          ? narratives.ossContrib(collaboration.externalContributions, collaboration.externalRepos)
          : narratives.reviews(collaboration.reviewCount, collaboration.reviewToCommitRatio)
        }
      </motion.p>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl"
      >
        {/* PRs Merged */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <GitPullRequest className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{collaboration.prsMerged}</div>
          <div className="text-xs text-gray-500">PRs Merged</div>
        </div>

        {/* Merge Rate */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-green-400 text-xs font-bold">✓</span>
          </div>
          <div className="text-2xl font-bold text-white">{collaboration.mergeRate}%</div>
          <div className="text-xs text-gray-500">Merge Rate</div>
        </div>

        {/* Reviews */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <MessageSquare className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{collaboration.reviewCount}</div>
          <div className="text-xs text-gray-500">Reviews</div>
        </div>

        {/* External Repos */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{collaboration.externalRepos}</div>
          <div className="text-xs text-gray-500">External Repos</div>
        </div>
      </motion.div>

      {/* Organizations */}
      {user.organizations && user.organizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 flex items-center gap-4"
        >
          <Building className="w-5 h-5 text-gray-500" />
          <div className="flex -space-x-2">
            {user.organizations.slice(0, 5).map((org, i) => (
              <motion.img
                key={org.login}
                src={org.avatarUrl}
                alt={org.login}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                className="w-8 h-8 rounded-full border-2 border-gray-900"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Member of {user.organizations.length} organization{user.organizations.length > 1 ? 's' : ''}
          </span>
        </motion.div>
      )}

      {/* Review/Commit Ratio Badge */}
      {isReviewer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
        >
          <span className="text-purple-400 text-sm">
            🛡️ Review-to-commit ratio: {collaboration.reviewToCommitRatio}:1 — Quality guardian
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CollaborationSlide;


