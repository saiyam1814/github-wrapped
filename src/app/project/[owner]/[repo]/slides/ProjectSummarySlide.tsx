"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitFork, Users, Package, Images } from "lucide-react";
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
  onNavigateToSlide?: (index: number) => void;
  totalSlides?: number;
}

export default function ProjectSummarySlide({ data, onNavigateToSlide, totalSlides = 7 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { repository, stats, releases, personality } = data;

  // Safely get all values
  const repoName = repository?.name || "Repository";
  const repoOwner = repository?.owner?.login || "owner";
  const ownerAvatar = repository?.owner?.avatarUrl || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  const totalStars = stats?.stars?.total || 0;
  const totalForks = stats?.forks?.total || 0;
  const contributorsTotal = stats?.contributors?.total || 0;
  const totalDownloads = releases?.totalDownloads2025 || 0;
  const personalityTitle = personality?.title || "Growing Project";
  const personalityEmoji = personality?.emoji || "🌱";

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
      link.download = `github-wrapped-2025-${repoOwner}-${repoName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllSlides = async () => {
    if (downloadingAll || !html2canvas || !onNavigateToSlide) return;
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      // Capture each slide
      for (let i = 0; i < totalSlides; i++) {
        setDownloadProgress(Math.round(((i + 1) / totalSlides) * 100));
        
        // Navigate to slide
        onNavigateToSlide(i);
        
        // Wait for animation to complete
        await new Promise(r => setTimeout(r, 1000));
        
        // Find the slide content area
        const slideContent = document.querySelector('[data-slide-content]');
        if (!slideContent) {
          console.log("Slide content not found");
          continue;
        }
        
        // Capture the slide
        const canvas = await html2canvas(slideContent as HTMLElement, {
          backgroundColor: "#0a0f0d",
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        // Download
        const link = document.createElement("a");
        link.download = `github-wrapped-2025-${repoOwner}-${repoName}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Return to summary slide
      onNavigateToSlide(totalSlides - 1);
      
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = () => {
    const text = `🎁 ${repoOwner}/${repoName} GitHub Wrapped 2025:\n\n⭐ ${totalStars.toLocaleString()} stars\n🍴 ${totalForks.toLocaleString()} forks\n👥 ${contributorsTotal} contributors\n📥 ${totalDownloads.toLocaleString()} downloads\n\n${personalityEmoji} "${personalityTitle}"\n\nGet yours at https://github-wrapped-five.vercel.app`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const summaryStats = [
    { icon: Star, label: "Stars", value: totalStars.toLocaleString(), color: "text-yellow-400" },
    { icon: GitFork, label: "Forks", value: totalForks.toLocaleString(), color: "text-emerald-400" },
    { icon: Users, label: "Contributors", value: contributorsTotal.toLocaleString(), color: "text-cyan-400" },
    { icon: Package, label: "Downloads", value: totalDownloads.toLocaleString(), color: "text-purple-400" },
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
        <div className="relative p-5 pb-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex justify-center">
            <img
              src={ownerAvatar}
              alt={repoOwner}
              crossOrigin="anonymous"
              className="w-16 h-16 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <h2 className="relative text-lg font-black text-white text-center mt-2">{repoName}</h2>
          <p className="relative text-white/80 text-center text-xs">by {repoOwner}</p>
          <p className="relative text-white/60 text-center text-[10px] mt-0.5">2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-8 mx-3">
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[#0d1512] border border-emerald-500/20">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl bg-white/5 text-center">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color} mx-auto mb-0.5`} />
                <div className="text-base font-bold text-white">{stat.value}</div>
                <div className="text-[9px] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-3 pt-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[9px] text-gray-500 mb-0.5">Project Type</div>
              <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {personalityTitle} {personalityEmoji}
              </div>
            </div>
            <img 
              src="/images/kubesimplify-logo.png" 
              alt="Kubesimplify" 
              className="w-10 h-10 object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-[10px] text-emerald-400 font-medium">
              Powered by Kubesimplify
            </div>
            <div className="text-[9px] text-gray-500 font-mono">
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
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
