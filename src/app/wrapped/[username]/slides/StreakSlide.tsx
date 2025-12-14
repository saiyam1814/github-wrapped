"use client";

import { motion } from "framer-motion";
import { Flame, Calendar, TrendingUp } from "lucide-react";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function StreakSlide({ data }: Props) {
  const { activity } = data;

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return "You're on fire! Legendary commitment 🏆";
    if (streak >= 50) return "Incredible discipline! That's half a year of momentum";
    if (streak >= 30) return "A whole month of continuous coding. That's dedication";
    if (streak >= 14) return "Two weeks straight! You've built a solid habit";
    if (streak >= 7) return "A week of consistency is where it all starts";
    return "Every day you show up is a win";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Fire animations - Amber/Orange */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ y: "100vh", x: `${10 + i * 12}%`, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            🔥
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-6 text-center"
      >
        Your longest streak this year
      </motion.p>

      {/* Main Streak Number */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
        className="relative mb-4"
      >
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-amber-500/40 to-orange-500/40 scale-150" />
        <div className="relative flex items-baseline justify-center">
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-orange-400 to-red-400"
          >
            {activity.longestStreak}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-amber-500/60 ml-2"
          >
            days
          </motion.span>
        </div>
      </motion.div>

      {/* Fire Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="mb-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Flame className="w-16 h-16 text-amber-500 drop-shadow-lg" fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-lg md:text-xl text-gray-300 text-center max-w-md mb-10"
      >
        {getStreakMessage(activity.longestStreak)}
      </motion.p>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-3 gap-4 w-full max-w-md"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20 text-center">
          <Flame className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-400">{activity.currentStreak}</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20 text-center">
          <Calendar className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-400">{activity.totalActiveDays}</div>
          <div className="text-xs text-gray-500">Active Days</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 text-center">
          <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-cyan-400">{activity.averagePerDay}</div>
          <div className="text-xs text-gray-500">Per Day Avg</div>
        </div>
      </motion.div>
    </div>
  );
}
