"use client";

import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, CircleDot, Eye, FolderGit2 } from "lucide-react";
import type { DeveloperData } from "../utils";
import { useEffect, useState } from "react";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = value;
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
  }, [value, delay]);

  return <span>{display.toLocaleString()}</span>;
}

export default function ContributionsSlide({ data }: Props) {
  const { contributions, activity } = data;

  const stats = [
    { label: "Commits", value: contributions.commits, icon: GitCommit, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pull Requests", value: contributions.pullRequests, icon: GitPullRequest, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Issues", value: contributions.issues, icon: CircleDot, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Reviews", value: contributions.reviews, icon: Eye, color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  const getHeadline = (count: number) => {
    if (count >= 5000) return "You're a force of nature";
    if (count >= 2000) return "You've been absolutely crushing it";
    if (count >= 1000) return "Now that's commitment";
    if (count >= 500) return "Solid year of shipping";
    return "Every contribution counts";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 mb-4"
      >
        {getHeadline(contributions.total)}
      </motion.p>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="relative mb-4"
      >
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 scale-150" />
        <h1 className="relative text-7xl md:text-9xl font-black text-gradient glow">
          <AnimatedNumber value={contributions.total} delay={600} />
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-2xl md:text-3xl font-light text-white mb-2"
      >
        contributions
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-400 max-w-lg mb-6 text-lg"
      >
        That's an average of <span className="text-emerald-400 font-bold">{activity.averagePerDay}</span> contributions per active day
      </motion.p>

      {/* Repos Contributed To */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
      >
        <FolderGit2 className="w-5 h-5 text-purple-400" />
        <span className="text-purple-300">
          Contributed to <span className="font-bold text-purple-400">{contributions.reposContributedTo}</span> repositories
        </span>
      </motion.div>

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
            className={`${stat.bg} rounded-xl p-4 border border-white/5`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2 mx-auto`} />
            <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
              <AnimatedNumber value={stat.value} delay={1600 + index * 100} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
