"use client";

import { motion } from "framer-motion";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function PersonalitySlide({ data }: Props) {
  const { personality } = data;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Background effect - Emerald/Cyan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-radial from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-emerald-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl" />
      </motion.div>

      {/* Intro Text */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-400 mb-8 z-10"
      >
        Based on your coding patterns, you are...
      </motion.p>

      {/* Main Personality Card - Emerald/Cyan gradient */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 blur-2xl opacity-50"
        />

        <div className="relative p-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500">
          <div className="bg-[#0a0f0d]/95 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="text-6xl md:text-8xl mb-4 text-center"
            >
              {personality.emoji}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-4xl md:text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-cyan-200 to-teal-200"
            >
              {personality.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-lg md:text-xl text-gray-400 text-center mt-2"
            >
              {personality.tagline}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="max-w-lg text-center text-gray-300 mt-8 text-lg z-10"
      >
        "{personality.description}"
      </motion.p>

      {/* Traits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
        className="flex flex-wrap justify-center gap-2 mt-8 z-10"
      >
        {personality.traits?.slice(0, 4).map((trait, index) => (
          <motion.div
            key={trait.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 + index * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <span>{trait.icon}</span>
            <span className="text-sm text-gray-300">{trait.name}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Badges */}
      {personality.badges && personality.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="flex flex-wrap justify-center gap-2 mt-6 z-10"
        >
          {personality.badges.slice(0, 4).map((badge, index) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 + index * 0.1 }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-sm text-emerald-300"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
