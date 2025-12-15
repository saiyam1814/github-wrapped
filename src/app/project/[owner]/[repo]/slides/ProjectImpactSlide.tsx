"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Users, Download, TrendingUp, Rocket, AlertCircle } from "lucide-react";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

export default function ProjectImpactSlide({ data }: Props) {
  const { stats, releases, personality } = data;

  // 2025-specific values
  const starsGained2025 = stats?.stars?.gained2025 ?? 0;
  const forksGained2025 = stats?.forks?.gained2025 || 0;
  const contributorsTotal = stats?.contributors?.total || 0;
  const totalDownloads2025 = releases?.totalDownloads2025 || 0;
  const releaseCount = releases?.count2025 || 0;

  // Check for API limitations
  const starsUnavailable = starsGained2025 < 0;
  const downloadsExternal = totalDownloads2025 === 0 && releaseCount > 0;

  // Calculate impact score (excluding unavailable data)
  const effectiveStars = starsUnavailable ? 0 : starsGained2025;
  const impactScore = effectiveStars + (forksGained2025 * 2) + (totalDownloads2025 / 100);
  
  const getImpactLevel = () => {
    if (impactScore >= 10000) return { level: "Legendary", emoji: "🏆", color: "text-yellow-400" };
    if (impactScore >= 5000) return { level: "Massive", emoji: "🚀", color: "text-purple-400" };
    if (impactScore >= 1000) return { level: "Significant", emoji: "⚡", color: "text-cyan-400" };
    if (impactScore >= 100) return { level: "Growing", emoji: "📈", color: "text-emerald-400" };
    return { level: "Building", emoji: "🌱", color: "text-green-400" };
  };

  const impact = getImpactLevel();

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        2025 Impact
      </motion.p>

      {/* Impact Level Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-emerald-500/20">
          <span className="text-2xl">{impact.emoji}</span>
          <div>
            <span className={`text-lg font-bold ${impact.color}`}>{impact.level}</span>
            <span className="text-gray-500 text-sm ml-2">Impact</span>
          </div>
          <TrendingUp className={`w-5 h-5 ${impact.color}`} />
        </div>
      </motion.div>

      {/* Impact Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8"
      >
        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-yellow-500/10 rounded-2xl p-5 border border-white/5 text-center relative overflow-hidden"
        >
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" fill="currentColor" />
          {starsUnavailable ? (
            <>
              <div className="text-xl font-bold text-yellow-400/60 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" /> N/A
              </div>
              <div className="text-xs text-gray-500 mt-1">Stars (API limit)</div>
            </>
          ) : (
            <>
              <div className="text-3xl font-black text-yellow-400">+{formatNumber(starsGained2025)}</div>
              <div className="text-sm text-gray-500 mt-1">Stars Gained</div>
            </>
          )}
        </motion.div>

        {/* Forks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-emerald-500/10 rounded-2xl p-5 border border-white/5 text-center relative overflow-hidden"
        >
          <GitFork className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-3xl font-black text-emerald-400">+{formatNumber(forksGained2025)}</div>
          <div className="text-sm text-gray-500 mt-1">Forks Gained</div>
        </motion.div>

        {/* Contributors */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-cyan-500/10 rounded-2xl p-5 border border-white/5 text-center relative overflow-hidden"
        >
          <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-3xl font-black text-cyan-400">{formatNumber(contributorsTotal)}</div>
          <div className="text-sm text-gray-500 mt-1">Contributors</div>
        </motion.div>

        {/* Downloads */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-purple-500/10 rounded-2xl p-5 border border-white/5 text-center relative overflow-hidden"
        >
          <Download className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          {downloadsExternal ? (
            <>
              <div className="text-xl font-bold text-purple-400/60">External</div>
              <div className="text-xs text-gray-500 mt-1">Downloads</div>
            </>
          ) : (
            <>
              <div className="text-3xl font-black text-purple-400">{formatNumber(totalDownloads2025)}</div>
              <div className="text-sm text-gray-500 mt-1">Downloads</div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Personality Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.4, type: "spring" }}
          className="text-5xl mb-3"
        >
          {personality?.emoji || "🚀"}
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          {personality?.title || "Growing Project"}
        </h2>
        <p className="text-gray-400 mt-2 max-w-md">
          "{personality?.tagline || "Building something great"}"
        </p>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-gray-500 text-center mt-6 flex items-center gap-2"
      >
        <Rocket className="w-4 h-4" />
        <span>What a year of growth! 🎉</span>
      </motion.p>
    </div>
  );
}
