"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitFork, Users, Package, Images, Loader2 } from "lucide-react";
import type { ProjectData } from "../page";
import Link from "next/link";
import confetti from "canvas-confetti";

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
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0f0d",
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `github-wrapped-2025-${repoOwner}-${repoName}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed:", e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllSlides = async () => {
    if (downloadingAll || !onNavigateToSlide) {
      return;
    }
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      
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
        link.download = `github-wrapped-2025-${repoOwner}-${repoName}-slide-${i + 1}.png`;
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
      alert("Download failed. Your browser may not support this feature.");
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
    { icon: Star, label: "Stars", value: totalStars.toLocaleString(), color: "#eab308" },
    { icon: GitFork, label: "Forks", value: totalForks.toLocaleString(), color: "#10b981" },
    { icon: Users, label: "Contributors", value: contributorsTotal.toLocaleString(), color: "#06b6d4" },
    { icon: Package, label: "Downloads", value: totalDownloads.toLocaleString(), color: "#a855f7" },
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

      {/* Shareable Card - Using inline styles for html2canvas compatibility */}
      <motion.div
        ref={cardRef}
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        {/* Header */}
        <div 
          className="relative p-5 pb-14"
          style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)" }}
        >
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
              className="w-16 h-16 rounded-full border-4 shadow-xl"
              style={{ borderColor: "#ffffff" }}
            />
          </div>
          <h2 className="relative text-lg font-black text-center mt-2" style={{ color: "#ffffff" }}>{repoName}</h2>
          <p className="relative text-center text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>by {repoOwner}</p>
          <p className="relative text-center text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-8 mx-3">
          <div 
            className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl"
            style={{ backgroundColor: "#0d1512", border: "1px solid rgba(16, 185, 129, 0.2)" }}
          >
            {summaryStats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl text-center" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <stat.icon className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: stat.color }} />
                <div className="text-base font-bold" style={{ color: "#ffffff" }}>{stat.value}</div>
                <div className="text-[9px]" style={{ color: "#6b7280" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-3 pt-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[9px] mb-0.5" style={{ color: "#6b7280" }}>Project Type</div>
              <div 
                className="text-xs font-bold"
                style={{ 
                  background: "linear-gradient(90deg, #10b981, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
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
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-[10px] font-medium" style={{ color: "#10b981" }}>
              Powered by Kubesimplify
            </div>
            <div className="text-[9px] font-mono" style={{ color: "#6b7280" }}>
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 text-sm"
          style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)" }}
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 text-sm"
          style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all text-sm"
          style={{ backgroundColor: "#1DA1F2" }}
        >
          <Twitter className="w-4 h-4" />
          Share
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all text-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}
        >
          <RotateCcw className="w-4 h-4" />
          New
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center text-xs max-w-sm"
        style={{ color: "#6b7280" }}
      >
        💡 <span style={{ color: "#a855f7" }}>All Slides</span> downloads each slide as shown
      </motion.p>
    </div>
  );
}
