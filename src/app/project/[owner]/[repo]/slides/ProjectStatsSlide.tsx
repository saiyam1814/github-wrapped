"use client";

import { motion } from "framer-motion";
import { Star, GitFork, GitPullRequest, CircleDot, GitCommit, Users, TrendingUp } from "lucide-react";
import type { ProjectData } from "../page";
import { useEffect, useState } from "react";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

function AnimatedNumber({ value, delay = 0, prefix = "", suffix = "" }: { value: number; delay?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;

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

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function ProjectStatsSlide({ data }: Props) {
  const { stats } = data;

  // 2025-specific values only!
  const starsGained2025 = stats?.stars?.gained2025 || 0;
  const forksGained2025 = stats?.forks?.gained2025 || 0;
  const prsCreated2025 = stats?.pullRequests?.created2025 || 0;
  const prsMerged2025 = stats?.pullRequests?.merged2025 || 0;
  const issuesCreated2025 = stats?.issues?.created2025 || 0;
  const commits2025 = stats?.commits?.total2025 || 0;
  const contributorsTotal = stats?.contributors?.total || 0;

  // Calculate growth indicators
  const totalStars = stats?.stars?.total || 0;
  const starsGrowthPercent = totalStars > 0 ? Math.round((starsGained2025 / (totalStars - starsGained2025)) * 100) : 0;

  const mainStats = [
    { 
      label: "Stars Gained", 
      value: starsGained2025, 
      icon: Star, 
      color: "text-yellow-400", 
      bg: "bg-yellow-500/10",
      fill: true,
      prefix: "+",
    },
    { 
      label: "Forks Gained", 
      value: forksGained2025, 
      icon: GitFork, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      fill: false,
      prefix: "+",
    },
  ];

  const activityStats = [
    { label: "PRs Created", value: prsCreated2025, icon: GitPullRequest, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "PRs Merged", value: prsMerged2025, icon: GitPullRequest, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Issues Opened", value: issuesCreated2025, icon: CircleDot, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Commits", value: commits2025, icon: GitCommit, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

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
        className="text-sm text-gray-500 mb-8"
      >
        What changed this year
      </motion.p>

      {/* Main Stats - Stars & Forks GAINED in 2025 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-6 mb-8 w-full max-w-lg"
      >
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.15 }}
            className={`${stat.bg} rounded-2xl p-6 border border-white/5 text-center relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="absolute top-3 right-3">
              <TrendingUp className={`w-4 h-4 ${stat.color} opacity-50`} />
            </div>
            <stat.icon 
              className={`w-8 h-8 ${stat.color} mx-auto mb-3 relative`} 
              fill={stat.fill ? "currentColor" : "none"}
            />
            <div className={`text-4xl md:text-5xl font-black ${stat.color} relative`}>
              <AnimatedNumber value={stat.value} delay={700 + index * 150} prefix={stat.prefix} />
            </div>
            <div className="text-sm text-gray-500 mt-2 relative">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Growth indicator */}
      {starsGrowthPercent > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-8 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20"
        >
          <span className="text-yellow-400 font-semibold">
            📈 {starsGrowthPercent}% star growth this year!
          </span>
        </motion.div>
      )}

      {/* 2025 Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {activityStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className={`${stat.bg} rounded-xl p-4 border border-white/5 text-center`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${stat.color}`}>
              <AnimatedNumber value={stat.value} delay={1400 + index * 100} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Contributors Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-8 flex items-center gap-3"
      >
        <Users className="w-5 h-5 text-emerald-400" />
        <span className="text-gray-400">
          <span className="text-emerald-400 font-bold">{contributorsTotal.toLocaleString()}</span> contributors building together
        </span>
      </motion.div>
    </div>
  );
}
