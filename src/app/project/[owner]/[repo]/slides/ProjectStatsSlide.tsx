"use client";

import { motion } from "framer-motion";
import { Star, GitFork, GitPullRequest, CircleDot, GitCommit, Eye } from "lucide-react";
import type { ProjectData } from "../page";
import { useEffect, useState } from "react";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
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

export default function ProjectStatsSlide({ data }: Props) {
  const { stats } = data;

  // Safely get values with fallbacks
  const totalStars = stats?.stars?.total || 0;
  const totalForks = stats?.forks?.total || 0;
  const prsCreated = stats?.pullRequests?.created2025 || 0;
  const prsMerged = stats?.pullRequests?.merged2025 || 0;
  const issuesCreated = stats?.issues?.created2025 || 0;
  const commits = stats?.commits?.total2025 || 0;
  const contributorsTotal = stats?.contributors?.total || 0;

  const mainStats = [
    { 
      label: "Total Stars", 
      value: totalStars, 
      icon: Star, 
      color: "text-yellow-400", 
      bg: "bg-yellow-500/10",
      fill: true
    },
    { 
      label: "Total Forks", 
      value: totalForks, 
      icon: GitFork, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      fill: false
    },
  ];

  const yearStats = [
    { label: "PRs Created", value: prsCreated, icon: GitPullRequest, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "PRs Merged", value: prsMerged, icon: GitPullRequest, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Issues Created", value: issuesCreated, icon: CircleDot, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Commits", value: commits, icon: GitCommit, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-8"
      >
        2025 in numbers
      </motion.p>

      {/* Main Stats - Stars & Forks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-6 mb-10 w-full max-w-lg"
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
            <stat.icon 
              className={`w-8 h-8 ${stat.color} mx-auto mb-3 relative`} 
              fill={stat.fill ? "currentColor" : "none"}
            />
            <div className={`text-4xl md:text-5xl font-black ${stat.color} relative`}>
              <AnimatedNumber value={stat.value} delay={700 + index * 150} />
            </div>
            <div className="text-sm text-gray-500 mt-2 relative">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2025 Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {yearStats.map((stat, index) => (
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
        <Eye className="w-5 h-5 text-gray-500" />
        <span className="text-gray-400">
          <span className="text-white font-bold">{contributorsTotal.toLocaleString()}</span> contributors made this possible
        </span>
      </motion.div>
    </div>
  );
}
