"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitCommit, Flame, Code2, Images, Loader2 } from "lucide-react";
import type { DeveloperData } from "../utils";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Props {
  data: DeveloperData;
  onNext: () => void;
  onNavigateToSlide?: (index: number) => void;
  totalSlides?: number;
}

// CSS override to fix oklab/lab colors for html2canvas
const CSS_COLOR_FIX = `
  * {
    --tw-gradient-from: #10b981 !important;
    --tw-gradient-to: #06b6d4 !important;
    --tw-gradient-stops: #10b981, #06b6d4 !important;
  }
  .text-emerald-400 { color: #34d399 !important; }
  .text-cyan-400 { color: #22d3ee !important; }
  .text-amber-400 { color: #fbbf24 !important; }
  .text-yellow-400 { color: #facc15 !important; }
  .text-purple-400 { color: #c084fc !important; }
  .text-pink-400 { color: #f472b6 !important; }
  .text-green-400 { color: #4ade80 !important; }
  .text-blue-400 { color: #60a5fa !important; }
  .text-red-400 { color: #f87171 !important; }
  .text-orange-400 { color: #fb923c !important; }
  .text-gray-400 { color: #9ca3af !important; }
  .text-gray-500 { color: #6b7280 !important; }
  .text-gray-600 { color: #4b5563 !important; }
  .text-white { color: #ffffff !important; }
  .bg-emerald-500 { background-color: #10b981 !important; }
  .bg-cyan-500 { background-color: #06b6d4 !important; }
  .bg-purple-500 { background-color: #a855f7 !important; }
  .bg-pink-500 { background-color: #ec4899 !important; }
  .bg-amber-500 { background-color: #f59e0b !important; }
  .bg-yellow-500 { background-color: #eab308 !important; }
  .from-emerald-500 { --tw-gradient-from: #10b981 !important; }
  .to-cyan-500 { --tw-gradient-to: #06b6d4 !important; }
  .from-emerald-600 { --tw-gradient-from: #059669 !important; }
  .to-cyan-600 { --tw-gradient-to: #0891b2 !important; }
  .from-purple-500 { --tw-gradient-from: #a855f7 !important; }
  .to-pink-500 { --tw-gradient-to: #ec4899 !important; }
  .from-amber-600 { --tw-gradient-from: #d97706 !important; }
  .to-orange-600 { --tw-gradient-to: #ea580c !important; }
  .border-emerald-500\\/20 { border-color: rgba(16, 185, 129, 0.2) !important; }
  .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05) !important; }
  .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
  .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
  .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
  .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) !important; }
  .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)) !important; }
  .bg-gradient-to-t { background-image: linear-gradient(to top, var(--tw-gradient-from), var(--tw-gradient-to)) !important; }
  .bg-\\[\\#0a0f0d\\] { background-color: #0a0f0d !important; }
  .bg-\\[\\#0d1512\\] { background-color: #0d1512 !important; }
  .bg-mesh { background-color: #0a0f0d !important; }
  .text-gradient { 
    background: linear-gradient(90deg, #10b981, #06b6d4) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
`;

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
      const html2canvas = (await import("html2canvas")).default;
      
      // Add CSS fix
      const style = document.createElement("style");
      style.textContent = CSS_COLOR_FIX;
      document.head.appendChild(style);
      
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0f0d",
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Remove CSS fix
      document.head.removeChild(style);

      const link = document.createElement("a");
      link.download = `github-wrapped-2025-${data.user.login}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export failed:", e);
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
    
    // Add CSS fix for all slides
    const style = document.createElement("style");
    style.id = "html2canvas-color-fix";
    style.textContent = CSS_COLOR_FIX;
    document.head.appendChild(style);
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      
      for (let i = 0; i < totalSlides; i++) {
        setDownloadProgress(Math.round(((i + 1) / totalSlides) * 100));
        
        // Navigate to slide
        onNavigateToSlide(i);
        
        // Wait for animation to complete
        await new Promise(r => setTimeout(r, 1500));
        
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
      // Remove CSS fix
      const styleEl = document.getElementById("html2canvas-color-fix");
      if (styleEl) document.head.removeChild(styleEl);
      
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
    { icon: GitCommit, label: "Contributions", value: data.contributions.total.toLocaleString(), color: "#10b981" },
    { icon: Flame, label: "Longest Streak", value: `${data.activity.longestStreak} days`, color: "#f59e0b" },
    { icon: Star, label: "Stars Earned", value: data.impact.totalStars.toLocaleString(), color: "#eab308" },
    { icon: Code2, label: "Top Language", value: data.languages.top?.name || "Code", color: "#06b6d4" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-center mb-6"
        style={{ color: "#ffffff" }}
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
        <div 
          className="relative p-6 pb-16"
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
              src={data.user.avatarUrl}
              alt={data.user.name}
              crossOrigin="anonymous"
              className="w-20 h-20 rounded-full border-4 shadow-xl"
              style={{ borderColor: "#ffffff" }}
            />
          </div>
          <h2 className="relative text-xl font-black text-center mt-3" style={{ color: "#ffffff" }}>{data.user.name}</h2>
          <p className="relative text-center text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>2025 GitHub Wrapped</p>
        </div>

        {/* Stats */}
        <div className="relative -mt-10 mx-4">
          <div 
            className="grid grid-cols-2 gap-2 p-3 rounded-2xl"
            style={{ backgroundColor: "#0d1512", border: "1px solid rgba(16, 185, 129, 0.2)" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="p-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <stat.icon className="w-4 h-4 mb-1" style={{ color: stat.color }} />
                <div className="text-base font-bold" style={{ color: "#ffffff" }}>{stat.value}</div>
                <div className="text-[10px]" style={{ color: "#6b7280" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality & Kubesimplify */}
        <div className="p-4 pt-3 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] mb-0.5" style={{ color: "#6b7280" }}>Personality</div>
              <div 
                className="text-sm font-bold"
                style={{ color: "#10b981" }}
              >
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
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="text-[11px] font-medium" style={{ color: "#10b981" }}>
              Powered by Kubesimplify
            </div>
            <div className="text-[10px] font-mono" style={{ color: "#6b7280" }}>
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
