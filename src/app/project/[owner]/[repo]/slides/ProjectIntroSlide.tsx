"use client";

import { motion } from "framer-motion";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

export default function ProjectIntroSlide({ data, onNext }: Props) {
  const { repository } = data;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      {/* Floating particles */}
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

      {/* Owner Avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-50 scale-110" />
        <div className="pulse-ring" />
        <img
          src={repository.owner.avatarUrl}
          alt={repository.owner.login}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-emerald-500/30 shadow-2xl object-cover"
        />
      </motion.div>

      {/* Repository Name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-6xl lg:text-7xl font-black mb-2"
      >
        <span className="text-gradient">{repository.name}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-gray-400 mb-4"
      >
        by {repository.owner.login}
      </motion.p>

      {/* Year Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="text-3xl md:text-5xl font-bold mb-4"
      >
        <span className="text-gradient">2025</span> Wrapped
      </motion.div>

      {/* Description */}
      {repository.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-gray-500 max-w-lg mb-8 line-clamp-2"
        >
          {repository.description}
        </motion.p>
      )}

      {/* Language & Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {repository.primaryLanguage && (
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${repository.primaryLanguage.color}20`,
              color: repository.primaryLanguage.color,
              border: `1px solid ${repository.primaryLanguage.color}40`,
            }}
          >
            {repository.primaryLanguage.name}
          </span>
        )}
        {repository.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-400 border border-white/10"
          >
            {topic}
          </span>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-transform group-hover:scale-105" />
        <span className="relative flex items-center gap-2 text-white">
          See the Stats
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            →
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}


