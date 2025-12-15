"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitCommit, Flame, Code2, Images, Loader2 } from "lucide-react";
import type { DeveloperData } from "../utils";
import Link from "next/link";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";

interface Props {
  data: DeveloperData;
  onNext: () => void;
  onNavigateToSlide?: (index: number) => void;
  totalSlides?: number;
}

export default function SummarySlide({ data, onNavigateToSlide, totalSlides = 8 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
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
    if (!cardRef.current || downloading) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0f0d",
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `github-wrapped-2025-${data.user.login}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllSlides = async () => {
    if (downloadingAll || !onNavigateToSlide) {
      console.log("Cannot download: downloadingAll=", downloadingAll, "onNavigateToSlide=", !!onNavigateToSlide);
      return;
    }
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      for (let i = 0; i < totalSlides; i++) {
        setDownloadProgress(Math.round(((i + 1) / totalSlides) * 100));
        
        // Navigate to slide
        onNavigateToSlide(i);
        
        // Wait for animation to complete
        await new Promise(r => setTimeout(r, 1200));
        
        // Find the slide content area
        const slideContent = document.querySelector('[data-slide-content]');
        if (!slideContent) {
          console.log("Slide content not found for slide", i);
          continue;
        }
        
        // Capture the slide
        const canvas = await html2canvas(slideContent as HTMLElement, {
          backgroundColor: "#0a0f0d",
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        // Download
        const link = document.createElement("a");
        link.download = `github-wrapped-2025-${data.user.login}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Return to summary slide
      onNavigateToSlide(totalSlides - 1);
      
    } catch (e) {
      console.error("Export failed:", e);
      alert("Download failed. Please try again.");
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
        className="text-4xl md:text-5xl font-black text-center mb-6"
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
              src={data.user.avatarUrl}
              alt={data.user.name}
              crossOrigin="anonymous"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <h2 className="relative text-xl font-black text-white text-center mt-3">{data.user.name}</h2>
          <p className="relative text-white/80 text-center text-sm">2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-10 mx-4">
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0d1512] border border-emerald-500/20">
            {stats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl bg-white/5">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                <div className="text-base font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-4 pt-3 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5">Personality</div>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {data.personality.title} {data.personality.emoji}
              </div>
            </div>
            <img 
              src="/images/kubesimplify-logo.png" 
              alt="Kubesimplify" 
              className="w-12 h-12 object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-[11px] text-emerald-400 font-medium">
              Powered by Kubesimplify
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
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
        className="flex flex-wrap justify-center gap-3 mt-6"
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 text-sm"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloading ? "Saving..." : "Download"}
        </button>

        <button
          onClick={handleDownloadAllSlides}
          disabled={downloadingAll || !onNavigateToSlide}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 text-sm"
        >
          {downloadingAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{downloadProgress}%</span>
            </>
          ) : (
            <>
              <Images className="w-4 h-4" />
              <span>All Slides</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DA1F2] text-white font-semibold hover:bg-[#1a8cd8] transition-all text-sm"
        >
          <Twitter className="w-4 h-4" />
          Share
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-emerald-500/20 text-white font-semibold hover:bg-white/10 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          New
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-gray-500 text-center text-xs max-w-sm"
      >
        💡 <span className="text-purple-400">All Slides</span> downloads each slide as shown
      </motion.p>
    </div>
  );
}
