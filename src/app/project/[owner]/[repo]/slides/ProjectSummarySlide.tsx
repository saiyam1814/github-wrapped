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
}

export default function ProjectSummarySlide({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const { repository, stats, releases, personality } = data;

  // Safely get all values
  const repoName = repository?.name || "Repository";
  const repoOwner = repository?.owner?.login || "owner";
  const ownerAvatar = repository?.owner?.avatarUrl || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  const totalStars = stats?.stars?.total || 0;
  const totalForks = stats?.forks?.total || 0;
  const contributorsTotal = stats?.contributors?.total || 0;
  const totalDownloads = releases?.totalDownloads2025 || 0;
  const totalCommits = stats?.commits?.total2025 || 0;
  const prsCreated = stats?.pullRequests?.created2025 || 0;
  const personalityTitle = personality?.title || "Growing Project";
  const personalityEmoji = personality?.emoji || "🌱";
  const personalityTagline = personality?.tagline || "Building something great";

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
    if (downloadingAll || !html2canvas) return;
    
    setDownloadingAll(true);
    
    try {
      // Create carousel slides data for project
      const slides = [
        {
          title: repoName,
          subtitle: `${repoOwner}'s 2025 Wrapped`,
          emoji: "🎁",
          stat: "",
          statLabel: "",
          gradient: "from-emerald-600 to-cyan-600",
        },
        {
          title: "Stars & Forks",
          subtitle: "Community recognition",
          emoji: "⭐",
          stat: totalStars.toLocaleString(),
          stat2: totalForks.toLocaleString(),
          statLabel: "stars",
          statLabel2: "forks",
          gradient: "from-yellow-600 to-amber-600",
        },
        {
          title: "PRs & Commits",
          subtitle: "2025 activity",
          emoji: "🔄",
          stat: prsCreated.toLocaleString(),
          stat2: totalCommits.toLocaleString(),
          statLabel: "PRs created",
          statLabel2: "commits",
          gradient: "from-cyan-600 to-blue-600",
        },
        {
          title: "Contributors",
          subtitle: "Community power",
          emoji: "👥",
          stat: contributorsTotal.toLocaleString(),
          statLabel: "contributors",
          gradient: "from-emerald-600 to-teal-600",
        },
        {
          title: "Downloads",
          subtitle: "2025 reach",
          emoji: "📥",
          stat: totalDownloads.toLocaleString(),
          statLabel: "total downloads",
          gradient: "from-purple-600 to-pink-600",
        },
        {
          title: personalityTitle,
          subtitle: personalityTagline,
          emoji: personalityEmoji,
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
        const slide = slides[i] as any;
        
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
        
        const bgColor1 = slide.gradient.includes('emerald') ? '#059669' : 
                         slide.gradient.includes('yellow') ? '#ca8a04' : 
                         slide.gradient.includes('cyan') ? '#0891b2' : 
                         slide.gradient.includes('purple') ? '#9333ea' : '#059669';
        const bgColor2 = slide.gradient.includes('cyan') ? '#0891b2' : 
                         slide.gradient.includes('amber') ? '#d97706' : 
                         slide.gradient.includes('blue') ? '#2563eb' : 
                         slide.gradient.includes('pink') ? '#db2777' :
                         slide.gradient.includes('teal') ? '#14b8a6' : '#14b8a6';
        
        slideEl.innerHTML = `
          <div style="
            background: linear-gradient(135deg, ${bgColor1}, ${bgColor2});
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
            
            ${slide.stat2 ? `
              <div style="display: flex; gap: 60px; position: relative;">
                <div style="text-align: center;">
                  <div style="font-size: 100px; font-weight: 900; color: white; line-height: 1;">${slide.stat}</div>
                  <p style="font-size: 24px; color: rgba(255,255,255,0.7); margin-top: 8px;">${slide.statLabel}</p>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 100px; font-weight: 900; color: white; line-height: 1;">${slide.stat2}</div>
                  <p style="font-size: 24px; color: rgba(255,255,255,0.7); margin-top: 8px;">${slide.statLabel2}</p>
                </div>
              </div>
            ` : slide.stat ? `
              <div style="font-size: 140px; font-weight: 900; color: white; text-align: center; position: relative; line-height: 1;">${slide.stat}</div>
              <p style="font-size: 28px; color: rgba(255,255,255,0.7); text-align: center; margin-top: 16px; position: relative;">${slide.statLabel}</p>
            ` : ''}
            
            <div style="position: absolute; bottom: 40px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="/images/kubesimplify-logo.png" style="width: 40px; height: 40px; border-radius: 50%;" />
                <span style="color: rgba(255,255,255,0.6); font-size: 18px;">Powered by Kubesimplify</span>
              </div>
              <span style="color: rgba(255,255,255,0.5); font-size: 16px;">${repoOwner}/${repoName}</span>
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
        link.download = `github-wrapped-2025-${repoOwner}-${repoName}-slide-${i + 1}.png`;
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
              src={ownerAvatar}
              alt={repoOwner}
              crossOrigin="anonymous"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <h2 className="relative text-xl font-black text-white text-center mt-3">{repoName}</h2>
          <p className="relative text-white/80 text-center text-sm">by {repoOwner}</p>
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
                {personalityTitle} {personalityEmoji}
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
