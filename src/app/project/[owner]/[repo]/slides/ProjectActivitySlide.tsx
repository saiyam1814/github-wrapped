"use client";

import { motion } from "framer-motion";
import { TrendingUp, GitCommit, Calendar } from "lucide-react";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

export default function ProjectActivitySlide({ data }: Props) {
  const { activity, stats } = data;
  
  // Get monthly data sorted
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = monthNames.map((name, index) => {
    const key = `2025-${String(index + 1).padStart(2, '0')}`;
    return {
      name,
      commits: activity.monthlyCommits[key] || 0,
    };
  });
  
  const maxCommits = Math.max(...monthlyData.map(m => m.commits), 1);
  const peakMonth = monthlyData.reduce((max, m) => m.commits > max.commits ? m : max, monthlyData[0]);
  const totalCommits = monthlyData.reduce((sum, m) => sum + m.commits, 0);
  
  // Find the month with most activity
  const activeMonths = monthlyData.filter(m => m.commits > 0).length;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        Commit activity in 2025
      </motion.p>

      {/* Total Commits */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 blur-2xl bg-purple-500/30 scale-150" />
        <div className="relative flex items-center gap-3">
          <GitCommit className="w-8 h-8 text-purple-400" />
          <span className="text-5xl md:text-6xl font-black text-purple-400">
            {totalCommits.toLocaleString()}
          </span>
        </div>
        <p className="text-gray-400 text-center mt-2">commits this year</p>
      </motion.div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-2xl mb-8"
      >
        <div className="flex items-end justify-between h-40 gap-1">
          {monthlyData.map((month, index) => {
            const height = maxCommits > 0 ? (month.commits / maxCommits) * 100 : 0;
            const isPeak = month.name === peakMonth.name && month.commits > 0;
            
            return (
              <motion.div
                key={month.name}
                className="flex-1 flex flex-col items-center"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
                style={{ transformOrigin: "bottom" }}
              >
                <div className="relative w-full flex flex-col items-center" style={{ height: "120px" }}>
                  {isPeak && month.commits > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="absolute -top-6 text-xs text-emerald-400 font-bold whitespace-nowrap"
                    >
                      Peak: {month.commits}
                    </motion.div>
                  )}
                  <div className="flex-1 w-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 3)}%` }}
                      transition={{ delay: 0.8 + index * 0.05, duration: 0.6 }}
                      className={`w-full rounded-t-md ${
                        isPeak
                          ? "bg-gradient-to-t from-emerald-500 to-cyan-400"
                          : "bg-purple-500/40"
                      }`}
                      style={{ minHeight: month.commits > 0 ? "8px" : "4px" }}
                    />
                  </div>
                </div>
                <span className={`text-xs mt-2 ${isPeak ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  {month.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="grid grid-cols-3 gap-4 w-full max-w-md"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20 text-center">
          <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-400">{peakMonth.name}</div>
          <div className="text-xs text-gray-500">Peak Month</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-purple-500/20 text-center">
          <GitCommit className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-400">
            {activeMonths > 0 ? Math.round(totalCommits / activeMonths) : 0}
          </div>
          <div className="text-xs text-gray-500">Avg/Month</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 text-center">
          <Calendar className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-cyan-400">{activeMonths}</div>
          <div className="text-xs text-gray-500">Active Months</div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-gray-500 text-center mt-6 max-w-md"
      >
        Consistent progress throughout the year keeps projects healthy
      </motion.p>
    </div>
  );
}

