"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Medal, Award } from "lucide-react";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

export default function ProjectContributorsSlide({ data }: Props) {
  const { stats } = data;
  
  // Safely get values (2025 active contributors)
  const contributorsTotal = stats?.contributors?.total2025 || stats?.contributors?.total || 0;
  const topContributors = stats?.contributors?.top || [];

  const getMedal = (index: number) => {
    if (index === 0) return { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/20" };
    if (index === 1) return { icon: Medal, color: "text-gray-300", bg: "bg-gray-500/20" };
    if (index === 2) return { icon: Award, color: "text-amber-600", bg: "bg-amber-600/20" };
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        Powered by the community
      </motion.p>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 blur-2xl bg-emerald-500/30 scale-150" />
        <div className="relative flex items-center gap-3">
          <Users className="w-10 h-10 text-emerald-400" />
          <span className="text-6xl md:text-7xl font-black text-gradient">
            {contributorsTotal.toLocaleString()}
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-400 mb-8"
      >
        contributors active in 2025
      </motion.p>

      {/* Top Contributors */}
      {topContributors.length > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 mb-4"
          >
            Top contributors by commits
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-5 gap-3 max-w-xl"
          >
            {topContributors.slice(0, 5).map((contributor, index) => {
              const medal = getMedal(index);
              return (
                <motion.div
                  key={contributor.login || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    {medal && (
                      <div className={`absolute -top-2 -right-2 p-1 rounded-full ${medal.bg} z-10`}>
                        <medal.icon className={`w-3 h-3 ${medal.color}`} fill="currentColor" />
                      </div>
                    )}
                    <img
                      src={contributor.avatarUrl || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                      alt={contributor.login || "Contributor"}
                      className={`w-12 h-12 rounded-full border-2 ${
                        index === 0 
                          ? "border-yellow-400" 
                          : index === 1 
                          ? "border-gray-400" 
                          : index === 2 
                          ? "border-amber-600" 
                          : "border-white/10"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-2 truncate max-w-full">
                    {contributor.login || "User"}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    {(contributor.contributions || 0).toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {topContributors.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex -space-x-2 mt-6"
            >
              {topContributors.slice(5, 10).map((contributor, index) => (
                <motion.img
                  key={contributor.login || index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 + index * 0.05 }}
                  src={contributor.avatarUrl || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                  alt={contributor.login || "Contributor"}
                  title={`${contributor.login || "User"} (${(contributor.contributions || 0).toLocaleString()} commits)`}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0f0d]"
                />
              ))}
              {contributorsTotal > 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-[#0a0f0d] flex items-center justify-center text-xs text-emerald-400"
                >
                  +{contributorsTotal - 10}
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-gray-500 text-center mt-8 max-w-md"
      >
        Every contributor matters. Open source is built on community.
      </motion.p>
    </div>
  );
}
