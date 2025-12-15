"use client";

import { motion } from "framer-motion";
import { Star, GitFork, GitPullRequest, CircleDot, GitCommit, Users, TrendingUp, Info } from "lucide-react";
import type { ProjectData } from "../page";
import { useEffect, useState } from "react";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const safeValue = typeof value === 'number' && !isNaN(value) && value >= 0 ? value : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const end = safeValue;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(end * eased));

        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [safeValue, delay]);

  return <span>{display.toLocaleString()}</span>;
}

function formatLargeNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export default function ProjectStatsSlide({ data }: Props) {
  const { stats } = data;

  // 2025-specific values
  const starsGained2025 = stats?.stars?.gained2025 ?? 0;
  const totalStars = stats?.stars?.total || 0;
  const forksGained2025 = stats?.forks?.gained2025 || 0;
  const prsCreated2025 = stats?.pullRequests?.created2025 || 0;
  const prsMerged2025 = stats?.pullRequests?.merged2025 || 0;
  const issuesCreated2025 = stats?.issues?.created2025 || 0;
  const commits2025 = stats?.commits?.total2025 || 0;
  const contributorsTotal = stats?.contributors?.total2025 || stats?.contributors?.total || 0;

  // Check if stars data is unavailable due to API limits (-1 means unavailable)
  const starsUnavailable = starsGained2025 < 0;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        2025 Growth
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-6"
      >
        What changed this year
      </motion.p>

      {/* Main Stats - Stars & Forks */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-500/10 rounded-2xl p-5 border border-yellow-500/20 text-center relative overflow-hidden"
        >
          <div className="absolute top-2 right-2">
            <TrendingUp className="w-4 h-4 text-yellow-500/50" />
          </div>
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" fill="currentColor" />
          {starsUnavailable ? (
            <>
              <div className="text-4xl md:text-5xl font-black text-yellow-400">
                {formatLargeNumber(totalStars)}
              </div>
              <div className="text-sm text-gray-400 mt-1">Total Stars</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> 2025 data unavailable
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-yellow-400">
                +<AnimatedNumber value={starsGained2025} delay={600} />
              </div>
              <div className="text-sm text-gray-400 mt-1">Stars Gained</div>
            </>
          )}
        </motion.div>

        {/* Forks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20 text-center relative overflow-hidden"
        >
          <div className="absolute top-2 right-2">
            <TrendingUp className="w-4 h-4 text-emerald-500/50" />
          </div>
          <GitFork className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-4xl md:text-5xl font-black text-emerald-400">
            +{formatLargeNumber(forksGained2025)}
          </div>
          <div className="text-sm text-gray-400 mt-1">Forks Gained</div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20 text-center">
          <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-cyan-400">{formatLargeNumber(contributorsTotal)}</div>
          <div className="text-xs text-gray-500">Contributors</div>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center">
          <GitCommit className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-purple-400">{formatLargeNumber(commits2025)}</div>
          <div className="text-xs text-gray-500">Commits</div>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center">
          <GitPullRequest className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-blue-400">{formatLargeNumber(prsMerged2025)}</div>
          <div className="text-xs text-gray-500">PRs Merged</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 text-center">
          <CircleDot className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-amber-400">{formatLargeNumber(issuesCreated2025)}</div>
          <div className="text-xs text-gray-500">Issues Opened</div>
        </div>
      </motion.div>

      {/* Context */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-gray-500 text-sm mt-6 flex items-center gap-2"
      >
        <Star className="w-4 h-4 text-yellow-500/50" />
        {formatLargeNumber(contributorsTotal)} contributors building together
      </motion.p>
    </div>
  );
}
