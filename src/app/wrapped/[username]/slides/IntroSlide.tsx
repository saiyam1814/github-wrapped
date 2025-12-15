"use client";

import { motion } from "framer-motion";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function IntroSlide({ data, onNext }: Props) {
  const user = data?.user || {};
  const userName = user.name || user.login || "Developer";
  const avatarUrl = user.avatarUrl || "";

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-500/20"
            initial={{ x: `${Math.random() * 100}%`, y: "100%", scale: Math.random() * 0.5 + 0.5 }}
            animate={{ y: "-20%", opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-50 scale-110" />
        <div className="pulse-ring" />
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500/30 shadow-2xl object-cover"
          />
        ) : (
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-500/30 shadow-2xl bg-emerald-500/20 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        Hey, {userName}! 👋
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
      >
        Your <span className="text-gradient">2025</span>
        <br />
        <span className="text-gradient">GitHub Wrapped</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-lg md:text-xl text-gray-500 mb-10 max-w-md"
      >
        Let's unwrap your year in code
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-transform group-hover:scale-105" />
        <span className="relative flex items-center gap-2 text-white">
          Let's Go
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            →
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}
