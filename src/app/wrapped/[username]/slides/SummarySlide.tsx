"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitCommit, Flame, Code2, Images } from "lucide-react";
import type { DeveloperData } from "../utils";
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
  data: DeveloperData;
  onNext: () => void;
}

export default function SummarySlide({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
      link.download = `github-wrapped-2025-${data.user.login}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllSlides = async () => {
    if (downloadingAll || !html2canvas) return;
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      // Find the main content container that holds slides
      const mainContent = document.querySelector('.w-full.max-w-5xl');
      if (!mainContent) {
        console.error("Could not find main content");
        return;
      }

      // Get all progress bar segments to know how many slides there are
      const progressBars = document.querySelectorAll('.absolute.top-0 .flex-1');
      const totalSlides = progressBars.length;
      
      // Find navigation buttons
      const prevBtn = document.querySelector('button[class*="ChevronLeft"]')?.parentElement || 
                      Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-chevron-left'));
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-chevron-right'));
      
      // Find dot navigation buttons
      const dotButtons = document.querySelectorAll('.flex.items-center.gap-2 button');
      
      if (dotButtons.length === 0) {
        alert("Could not find slide navigation. Please try again.");
        setDownloadingAll(false);
        return;
      }

      // Capture each slide
      for (let i = 0; i < dotButtons.length; i++) {
        setDownloadProgress(Math.round(((i + 1) / dotButtons.length) * 100));
        
        // Click the dot to navigate to slide
        (dotButtons[i] as HTMLButtonElement).click();
        
        // Wait for animation to complete
        await new Promise(r => setTimeout(r, 800));
        
        // Find the slide content area
        const slideContent = document.querySelector('.w-full.max-w-5xl .w-full.h-full.flex');
        if (!slideContent) continue;
        
        // Capture the slide
        const canvas = await html2canvas(slideContent as HTMLElement, {
          backgroundColor: "#0a0f0d",
          scale: 2,
          logging: false,
          useCORS: true,
          width: 1080,
          height: 1080,
          windowWidth: 1080,
          windowHeight: 1080,
        });
        
        // Download
        const link = document.createElement("a");
        link.download = `github-wrapped-2025-${data.user.login}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Return to summary slide
      (dotButtons[dotButtons.length - 1] as HTMLButtonElement).click();
      
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = () => {
    const text = `🎁 My GitHub Wrapped 2025:\n\n📊 ${data.contributions.total.toLocaleString()} contributions\n🔥 ${data.activity.longestStreak} day streak\n⭐ ${data.impact.totalStars.toLocaleString()} stars\n💻 Top language: ${data.languages.top?.name || "Code"}\n\n${data.personality.emoji} I'm "${data.personality.title}"\n\nGet yours at https://github-wrapped-five.vercel.app`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const stats = [
    { icon: GitCommit, label: "Contributions", value: data.contributions.total.toLocaleString(), color: "text-emerald-400" },
    { icon: Flame, label: "Longest Streak", value: `${data.activity.longestStreak} days`, color: "text-amber-400" },
    { icon: Star, label: "Stars Earned", value: data.impact.totalStars.toLocaleString(), color: "text-yellow-400" },
    { icon: Code2, label: "Top Language", value: data.languages.top?.name || "Code", color: "text-cyan-400" },
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
        <div className="relative p-6 pb-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex justify-center">
            <img
              src={data.user.avatarUrl}
              alt={data.user.name}
              crossOrigin="anonymous"
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <h2 className="relative text-2xl font-black text-white text-center mt-4">{data.user.name}</h2>
          <p className="relative text-white/80 text-center font-medium">2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-12 mx-4">
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0d1512] border border-emerald-500/20">
            {stats.map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/5">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Personality</div>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {data.personality.title} {data.personality.emoji}
              </div>
            </div>
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
          {downloading ? "Saving..." : "Download Card"}
        </button>

        <button
          onClick={handleDownloadAllSlides}
          disabled={downloadingAll}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
        >
          {downloadingAll ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{downloadProgress}%</span>
            </>
          ) : (
            <>
              <Images className="w-5 h-5" />
              <span>Download All Slides</span>
            </>
          )}
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
        className="mt-6 text-gray-500 text-center text-sm max-w-md"
      >
        💡 <span className="text-purple-400">Download All Slides</span> captures each slide exactly as shown!
      </motion.p>
    </div>
  );
}
