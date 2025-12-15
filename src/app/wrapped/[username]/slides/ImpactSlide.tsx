"use client";

import { motion } from "framer-motion";
import { Star, GitFork, FolderGit2, Flame, Globe } from "lucide-react";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function ImpactSlide({ data }: Props) {
  const { impact } = data;

  const getMessage = () => {
    const stars = impact.totalStars;
    if (stars >= 10000) return "You're basically a GitHub celebrity 🌟";
    if (stars >= 1000) return "Thousands trust your code. That's real impact";
    if (stars >= 100) return "Your work is getting noticed. Keep shipping!";
    if (stars >= 10) return "Every star represents someone you've helped";
    return "Impact isn't just about stars. It's about the problems you solve";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Floating stars animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-6 text-center"
      >
        Your impact on the community
      </motion.p>

      {/* Stars Highlight */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 blur-3xl bg-yellow-500/30 scale-150" />
        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star className="w-16 h-16 text-yellow-400" fill="currentColor" />
          </motion.div>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-6xl md:text-7xl font-black text-gradient-gold"
            >
              {impact.totalStars.toLocaleString()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-lg"
            >
              total stars earned
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-8 mb-8"
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <GitFork className="w-5 h-5 text-emerald-400" />
            <span className="text-3xl font-bold text-emerald-400">{impact.totalForks.toLocaleString()}</span>
          </div>
          <div className="text-gray-500 text-sm">Forks</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span className="text-3xl font-bold text-cyan-400">{impact.repositoryCount}</span>
          </div>
          <div className="text-gray-500 text-sm">Repositories</div>
        </div>

        {impact.ossContributions && impact.ossContributions.repoCount > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">{impact.ossContributions.repoCount}</span>
            </div>
            <div className="text-gray-500 text-sm">OSS Repos</div>
          </div>
        )}
      </motion.div>

      {/* Most Contributed Repository */}
      {impact.mostContributedRepo && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full max-w-md mb-4"
        >
          <p className="text-sm text-gray-500 mb-3 text-center">Most contributed repository</p>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{impact.mostContributedRepo.nameWithOwner}</h3>
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="text-emerald-400">{impact.mostContributedRepo.commits} commits</span>
                  <span className="text-cyan-400">{impact.mostContributedRepo.prs} PRs</span>
                  <span className="text-amber-400">{impact.mostContributedRepo.issues} issues</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm">{impact.mostContributedRepo.total}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Repository by Stars */}
      {impact.mostStarredRepo && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="w-full max-w-md"
        >
          <p className="text-sm text-gray-500 mb-3 text-center">Most starred repository</p>
          <div className="p-4 rounded-2xl bg-white/5 border border-yellow-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{impact.mostStarredRepo.name}</h3>
                {impact.mostStarredRepo.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                    {impact.mostStarredRepo.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-yellow-400 font-bold">{impact.mostStarredRepo.stars.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-gray-400 text-center mt-6 max-w-md"
      >
        {getMessage()}
      </motion.p>
    </div>
  );
}
