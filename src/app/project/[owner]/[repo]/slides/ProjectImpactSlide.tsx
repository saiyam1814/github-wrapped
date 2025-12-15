"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Users, Download } from "lucide-react";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

export default function ProjectImpactSlide({ data }: Props) {
  const { stats, releases, personality, repository } = data;

  const impactMetrics = [
    {
      icon: Star,
      label: "Stars Gained",
      value: stats.stars.gained2025,
      total: stats.stars.total,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      fill: true,
    },
    {
      icon: GitFork,
      label: "New Forks",
      value: stats.forks.gained2025,
      total: stats.forks.total,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      fill: false,
    },
    {
      icon: Users,
      label: "Contributors",
      value: stats.contributors.total,
      total: null,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      fill: false,
    },
    {
      icon: Download,
      label: "Downloads",
      value: releases.totalDownloads2025,
      total: null,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      fill: false,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-6"
      >
        Your project's reach in 2025
      </motion.p>

      {/* Impact Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 w-full max-w-lg mb-10"
      >
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`${metric.bg} rounded-2xl p-5 border border-white/5 text-center relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <metric.icon 
              className={`w-6 h-6 ${metric.color} mx-auto mb-2 relative`}
              fill={metric.fill ? "currentColor" : "none"}
            />
            <div className={`text-3xl font-black ${metric.color} relative`}>
              {metric.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1 relative">{metric.label}</div>
            {metric.total && (
              <div className="text-xs text-gray-600 mt-1 relative">
                of {metric.total.toLocaleString()} total
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Personality Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          className="text-5xl mb-3"
        >
          {personality.emoji}
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          {personality.title}
        </h2>
        <p className="text-gray-400 mt-2 max-w-md">
          "{personality.tagline}"
        </p>
      </motion.div>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="flex flex-wrap justify-center gap-2 mt-6"
      >
        {personality.traits.slice(0, 4).map((trait, index) => (
          <motion.div
            key={trait.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 + index * 0.1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <span>{trait.icon}</span>
            <span className="text-sm text-gray-300">{trait.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

