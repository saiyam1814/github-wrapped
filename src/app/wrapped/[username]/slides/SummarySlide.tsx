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

  useEffect(() => {
    if (!confetti) return;

    const duration = 4000;
    const animationEnd = Date.now() + duration;
    // New color scheme - Emerald/Cyan/Teal
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
    
    try {
      // Create carousel slides data
      const slides = [
        {
          title: "GitHub Wrapped 2025",
          subtitle: data.user.name,
          emoji: "🎁",
          stat: data.contributions.total.toLocaleString(),
          statLabel: "contributions",
          gradient: "from-emerald-600 to-cyan-600",
        },
        {
          title: "Contributions",
          subtitle: `${data.contributions.commits.toLocaleString()} commits`,
          emoji: "📊",
          stat: data.contributions.total.toLocaleString(),
          statLabel: "total contributions",
          gradient: "from-emerald-600 to-teal-600",
        },
        {
          title: "Longest Streak",
          subtitle: "Days of consistency",
          emoji: "🔥",
          stat: data.activity.longestStreak.toString(),
          statLabel: "consecutive days",
          gradient: "from-amber-600 to-orange-600",
        },
        {
          title: "Top Language",
          subtitle: data.languages.top?.name || "Code",
          emoji: "💻",
          stat: `${data.languages.top?.percentage || 0}%`,
          statLabel: "of your code",
          gradient: "from-cyan-600 to-blue-600",
        },
        {
          title: "Stars Earned",
          subtitle: "Recognition from others",
          emoji: "⭐",
          stat: data.impact.totalStars.toLocaleString(),
          statLabel: "total stars",
          gradient: "from-yellow-600 to-amber-600",
        },
        {
          title: data.personality.title,
          subtitle: data.personality.tagline,
          emoji: data.personality.emoji,
          stat: "",
          statLabel: "",
          gradient: "from-emerald-600 to-cyan-600",
          isPersonality: true,
        },
      ];

      // Create temporary container
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Create slide element
        const slideEl = document.createElement("div");
        slideEl.style.width = "1080px";
        slideEl.style.height = "1080px";
        slideEl.style.backgroundColor = "#0a0f0d";
        slideEl.style.display = "flex";
        slideEl.style.flexDirection = "column";
        slideEl.style.alignItems = "center";
        slideEl.style.justifyContent = "center";
        slideEl.style.padding = "60px";
        slideEl.style.fontFamily = "system-ui, -apple-system, sans-serif";
        
        slideEl.innerHTML = `
          <div style="
            background: linear-gradient(135deg, ${slide.gradient.includes('emerald') ? '#059669' : slide.gradient.includes('amber') ? '#d97706' : slide.gradient.includes('cyan') ? '#0891b2' : '#059669'}, ${slide.gradient.includes('cyan') ? '#0891b2' : slide.gradient.includes('orange') ? '#ea580c' : slide.gradient.includes('blue') ? '#2563eb' : '#14b8a6'});
            width: 100%;
            height: 100%;
            border-radius: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
            position: relative;
            overflow: hidden;
          ">
            <div style="position: absolute; inset: 0; opacity: 0.1; background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
            
            <div style="font-size: 120px; margin-bottom: 20px; position: relative;">${slide.emoji}</div>
            
            <h1 style="font-size: 64px; font-weight: 900; color: white; text-align: center; margin: 0 0 16px 0; position: relative;">${slide.title}</h1>
            
            <p style="font-size: 32px; color: rgba(255,255,255,0.8); text-align: center; margin: 0 0 40px 0; position: relative;">${slide.subtitle}</p>
            
            ${slide.stat ? `
              <div style="font-size: 140px; font-weight: 900; color: white; text-align: center; position: relative; line-height: 1;">${slide.stat}</div>
              <p style="font-size: 28px; color: rgba(255,255,255,0.7); text-align: center; margin-top: 16px; position: relative;">${slide.statLabel}</p>
            ` : ''}
            
            <div style="position: absolute; bottom: 40px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="/images/kubesimplify-logo.png" style="width: 40px; height: 40px; border-radius: 50%;" />
                <span style="color: rgba(255,255,255,0.6); font-size: 18px;">Powered by Kubesimplify</span>
              </div>
              <span style="color: rgba(255,255,255,0.5); font-size: 16px;">@${data.user.login}</span>
            </div>
          </div>
        `;
        
        container.appendChild(slideEl);
        
        // Capture
        const canvas = await html2canvas(slideEl, {
          backgroundColor: "#0a0f0d",
          scale: 1,
          logging: false,
          useCORS: true,
          width: 1080,
          height: 1080,
        });
        
        // Download
        const link = document.createElement("a");
        link.download = `github-wrapped-2025-${data.user.login}-slide-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        container.removeChild(slideEl);
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 300));
      }
      
      document.body.removeChild(container);
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setDownloadingAll(false);
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

      {/* Shareable Card - NEW Emerald/Cyan theme */}
      <motion.div
        ref={cardRef}
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        {/* Header - Emerald/Cyan gradient */}
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

      {/* Action Buttons - Updated colors */}
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
          {downloading ? "Generating..." : "Download Card"}
        </button>

        <button
          onClick={handleDownloadAllSlides}
          disabled={downloadingAll}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
        >
          {downloadingAll ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Images className="w-5 h-5" />
          )}
          {downloadingAll ? "Generating..." : "Download Carousel"}
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
        💡 <span className="text-emerald-400">Download Carousel</span> creates 6 slides perfect for Instagram/LinkedIn!
      </motion.p>
    </div>
  );
}
