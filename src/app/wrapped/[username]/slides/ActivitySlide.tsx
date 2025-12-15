"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Zap } from "lucide-react";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function ActivitySlide({ data }: Props) {
  const activity = data?.activity || {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Safe access to weekdayDistribution
  const weekdayDist = activity.weekdayDistribution || {};
  const values = Object.values(weekdayDist);
  const maxVal = values.length > 0 ? Math.max(...values.map(v => Number(v) || 0)) : 0;

  const getTimeMessage = () => {
    const hour = activity.busiestHour || 12;
    if (hour >= 5 && hour < 12) return "You're an early bird 🐦";
    if (hour >= 12 && hour < 17) return "Afternoon is your prime time ☀️";
    if (hour >= 17 && hour < 21) return "Evening is when you shine 🌆";
    return "A true night owl 🦉";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-6 text-center"
      >
        When you're at your best
      </motion.p>

      {/* Busiest Day Highlight */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative mb-10"
      >
        <div className="absolute inset-0 blur-2xl bg-emerald-500/30 scale-150" />
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl md:text-7xl font-black text-gradient"
          >
            {activity.busiestDay || "Monday"}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-400 mt-2"
          >
            is your most productive day
          </motion.p>
        </div>
      </motion.div>

      {/* Weekly Distribution Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full max-w-md mb-10"
      >
        <div className="flex justify-between items-end h-32 gap-2">
          {dayNames.map((day, index) => {
            const count = Number(weekdayDist[index]) || 0;
            const height = maxVal > 0 ? (count / maxVal) * 100 : 0;
            const isHighest = count === maxVal && maxVal > 0;

            return (
              <motion.div
                key={day}
                className="flex-1 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.05 }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 5)}%` }}
                  transition={{ delay: 1.2 + index * 0.05, duration: 0.6 }}
                  className={`w-full rounded-t-lg ${
                    isHighest
                      ? "bg-gradient-to-t from-emerald-500 to-cyan-400"
                      : "bg-white/10"
                  }`}
                  style={{ minHeight: "8px" }}
                />
                <span className={`text-xs mt-2 ${isHighest ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  {day}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="grid grid-cols-3 gap-4 w-full max-w-md"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/20 text-center">
          <Calendar className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-400">
            {activity.peakMonth?.split("-")[1] ? 
              new Date(2025, parseInt(activity.peakMonth.split("-")[1]) - 1).toLocaleString("default", { month: "short" }) 
              : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Peak Month</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 text-center">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-cyan-400">
            {activity.busiestHour || 12}:00
          </div>
          <div className="text-xs text-gray-500">Peak Hour</div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-teal-500/20 text-center">
          <Zap className="w-5 h-5 text-teal-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-teal-400">
            {activity.busiestDayCount || 0}
          </div>
          <div className="text-xs text-gray-500">{activity.busiestDay || "Day"} Total</div>
        </div>
      </motion.div>

      {/* Time Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-gray-400 text-center mt-8"
      >
        {getTimeMessage()}
      </motion.p>
    </div>
  );
}
