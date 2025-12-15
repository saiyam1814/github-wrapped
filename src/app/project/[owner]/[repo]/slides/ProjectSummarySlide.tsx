"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitFork, Users, Package } from "lucide-react";
import type { ProjectData } from "../page";
import Link from "next/link";

// Import dynamically to avoid SSR issues
let confetti: any = null;
let html2canvas: any = null;

if (typeof window !== "undefined") {
  import("canvas-confetti").then((mod) => {
    confetti = mod.default;
  });
  import("html2canvas").then((mod) => {
    html2canvas = mod.default;
  });
}

interface Props {
  data: ProjectData;
  onNext: () => void;
}

export default function ProjectSummarySlide({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { repository, stats, releases, personality } = data;

  useEffect(() => {
    if (!confetti) return;

    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const colors = ["#10b981", "#06b6d4", "#14b8a6", "#22d3ee", "#fbbf24"];

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: Math.random(), y: 0.6 },
        colors,
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || downloading || !html2canvas) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0f0d",
        scale: 3,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `github-wrapped-2025-${repository.nameWithOwner.replace("/", "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const text = `🎁 ${repository.nameWithOwner} GitHub Wrapped 2025:\n\n⭐ ${stats.stars.total.toLocaleString()} stars (+${stats.stars.gained2025} this year)\n🍴 ${stats.forks.total.toLocaleString()} forks\n👥 ${stats.contributors.total} contributors\n📦 ${releases.count2025} releases, ${releases.totalDownloads2025.toLocaleString()} downloads\n\n${personality.emoji} "${personality.title}"\n\nGet yours at https://github-wrapped-five.vercel.app`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const summaryStats = [
    { icon: Star, label: "Stars", value: stats.stars.total.toLocaleString(), color: "text-yellow-400" },
    { icon: GitFork, label: "Forks", value: stats.forks.total.toLocaleString(), color: "text-emerald-400" },
    { icon: Users, label: "Contributors", value: stats.contributors.total.toString(), color: "text-cyan-400" },
    { icon: Package, label: "Downloads", value: releases.totalDownloads2025.toLocaleString(), color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-center mb-8"
      >
        That's a wrap! 🎬
      </motion.h1>

      {/* Shareable Card */}
      <motion.div
        ref={cardRef}
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        {/* Header */}
        <div className="relative p-6 pb-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex justify-center">
            <img
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              crossOrigin="anonymous"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <h2 className="relative text-xl font-black text-white text-center mt-3">{repository.name}</h2>
          <p className="relative text-white/80 text-center text-sm">by {repository.owner.login}</p>
          <p className="relative text-white/60 text-center text-xs mt-1">2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-10 mx-4">
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0d1512] border border-emerald-500/20">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl bg-white/5 text-center">
                <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Project Type</div>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {personality.title} {personality.emoji}
              </div>
            </div>
            {/* Kubesimplify Logo */}
            <img 
              src="/images/kubesimplify-logo.png" 
              alt="Kubesimplify" 
              className="w-10 h-10 object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="text-[10px] text-emerald-400 font-medium">
              Powered by Kubesimplify
            </div>
            <div className="text-[10px] text-gray-600 font-mono">
              github-wrapped-five.vercel.app
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {downloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {downloading ? "Generating..." : "Download"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2] text-white font-semibold hover:bg-[#1a8cd8] transition-all"
        >
          <Twitter className="w-5 h-5" />
          Share
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-emerald-500/20 text-white font-semibold hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Start Over
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-gray-500 text-center max-w-md"
      >
        Open source makes the world better. Thank you for contributing!
      </motion.p>
    </div>
  );
}
