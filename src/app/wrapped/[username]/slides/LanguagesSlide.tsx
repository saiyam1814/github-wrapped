"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import type { DeveloperData } from "../utils";

interface Props {
  data: DeveloperData;
  onNext: () => void;
}

export default function LanguagesSlide({ data }: Props) {
  const { languages } = data;

  const getMessage = () => {
    if (languages.isPolyglot) {
      return "You're a true polyglot—comfortable across multiple languages";
    }
    if (languages.isSpecialist && languages.top) {
      return `${languages.top.name} is clearly your weapon of choice`;
    }
    return "Every language is a tool in your belt";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-6 text-center"
      >
        Your top languages this year
      </motion.p>

      {/* Top Language Highlight */}
      {languages.top && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative mb-8"
        >
          <div
            className="absolute inset-0 blur-2xl opacity-40 scale-150"
            style={{ backgroundColor: languages.top.color }}
          />
          <div className="relative flex items-center gap-4 px-8 py-6 rounded-2xl bg-white/5 border border-white/10">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${languages.top.color}20` }}
            >
              <Code2 className="w-8 h-8" style={{ color: languages.top.color }} />
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black" style={{ color: languages.top.color }}>
                {languages.top.name}
              </div>
              <div className="text-gray-400 text-lg">{languages.top.percentage}% of your code</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Language Bars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md space-y-4"
      >
        {languages.all.slice(0, 6).map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="group"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-white font-medium">{lang.name}</span>
              </div>
              <span className="text-gray-500 text-sm">{lang.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ delay: 1 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: lang.color }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-gray-400 text-center mt-8 max-w-md"
      >
        {getMessage()}
      </motion.p>

      {/* Badge */}
      {(languages.isPolyglot || languages.isSpecialist) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1 }}
          className="mt-6 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
        >
          <span className="text-emerald-300 text-sm font-medium">
            {languages.isPolyglot ? "🌍 Polyglot Developer" : `🎯 ${languages.top?.name} Specialist`}
          </span>
        </motion.div>
      )}
    </div>
  );
}
