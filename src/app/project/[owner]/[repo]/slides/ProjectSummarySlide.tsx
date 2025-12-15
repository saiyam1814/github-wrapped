"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Twitter, RotateCcw, Star, GitPullRequest, Users, Tag, Flame, Images, Loader2 } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { ProjectData } from "../page";

interface Props {
  data: ProjectData;
  onNext: () => void;
  onNavigateToSlide?: (index: number) => void;
  totalSlides?: number;
}

export default function ProjectSummarySlide({ data }: Props) {
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

  // Extract values safely
  const repoName = data.repository?.name || "Project";
  const fullName = data.repository?.nameWithOwner || "owner/repo";
  const avatarUrl = data.repository?.owner?.avatarUrl || "";
  const starsGained = data.stats?.stars?.gained2025 || 0;
  const totalStars = data.stats?.stars?.total || 0;
  const contributors = data.stats?.contributors?.total || 0;
  const mergedPRs = data.stats?.pullRequests?.merged2025 || 0;
  const totalCommits = data.stats?.commits?.total2025 || 0;
  const totalReleases = data.releases?.count2025 || 0;
  const totalDownloads = data.releases?.totalDownloads2025 || 0;
  const forksGained = data.stats?.forks?.gained2025 || 0;
  const totalPRs = data.stats?.pullRequests?.created2025 || 0;
  const totalIssues = data.stats?.issues?.created2025 || 0;
  const personality = data.personality || { title: "Innovator", emoji: "🚀", tagline: "Building the future" };

  // Generate card image using Canvas API
  const generateCardImage = async (): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    
    const width = 400 * 3;
    const height = 560 * 3;
    canvas.width = width;
    canvas.height = height;
    
    const scale = 3;
    
    // Background
    ctx.fillStyle = "#0a0f0d";
    ctx.fillRect(0, 0, width, height);
    
    // Header gradient
    const headerGradient = ctx.createLinearGradient(0, 0, width, 200 * scale);
    headerGradient.addColorStop(0, "#059669");
    headerGradient.addColorStop(0.5, "#0d9488");
    headerGradient.addColorStop(1, "#0891b2");
    ctx.fillStyle = headerGradient;
    roundRect(ctx, 20 * scale, 20 * scale, width - 40 * scale, 180 * scale, 24 * scale);
    ctx.fill();
    
    // Avatar
    if (avatarUrl) {
      try {
        const avatar = await loadImage(avatarUrl);
        const avatarSize = 70 * scale;
        const avatarX = (width - avatarSize) / 2;
        const avatarY = 45 * scale;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.stroke();
      } catch (e) {
        ctx.fillStyle = "#1f2937";
        ctx.beginPath();
        ctx.arc(width/2, 80 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Repo name
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(repoName, width/2, 150 * scale);
    
    // Subtitle
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `${12 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText("2025 Project Wrapped", width/2, 175 * scale);
    
    // Stats box
    ctx.fillStyle = "#0d1512";
    roundRect(ctx, 30 * scale, 205 * scale, width - 60 * scale, 190 * scale, 16 * scale);
    ctx.fill();
    ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    
    // Stats
    const stats = [
      { label: "Stars Gained", value: starsGained.toLocaleString(), icon: "⭐" },
      { label: "Contributors", value: contributors.toLocaleString(), icon: "👥" },
      { label: "PRs Merged", value: mergedPRs.toLocaleString(), icon: "🔀" },
      { label: "Downloads", value: formatNumber(totalDownloads), icon: "📦" },
      { label: "Commits", value: totalCommits.toLocaleString(), icon: "📝" },
      { label: "Releases", value: totalReleases.toLocaleString(), icon: "🏷️" },
    ];
    
    const statWidth = (width - 80 * scale) / 2;
    const statHeight = 60 * scale;
    
    stats.forEach((stat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 40 * scale + col * statWidth;
      const y = 215 * scale + row * statHeight;
      
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(ctx, x + 5 * scale, y + 5 * scale, statWidth - 10 * scale, statHeight - 10 * scale, 8 * scale);
      ctx.fill();
      
      ctx.font = `${14 * scale}px system-ui`;
      ctx.textAlign = "left";
      ctx.fillText(stat.icon, x + 15 * scale, y + 28 * scale);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${15 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(stat.value, x + 15 * scale, y + 48 * scale);
      
      ctx.fillStyle = "#6b7280";
      ctx.font = `${8 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(stat.label, x + 40 * scale, y + 28 * scale);
    });
    
    // Personality
    ctx.fillStyle = "#6b7280";
    ctx.font = `${10 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText("Project Personality", 40 * scale, 420 * scale);
    
    ctx.fillStyle = "#10b981";
    ctx.font = `bold ${13 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`${personality.title} ${personality.emoji}`, 40 * scale, 440 * scale);
    
    // Footer line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(40 * scale, 470 * scale);
    ctx.lineTo(width - 40 * scale, 470 * scale);
    ctx.stroke();
    
    // Footer
    ctx.fillStyle = "#10b981";
    ctx.font = `${10 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText("Powered by Kubesimplify", 40 * scale, 495 * scale);
    
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "right";
    ctx.fillText("github-wrapped-five.vercel.app", width - 40 * scale, 495 * scale);
    
    return canvas.toDataURL("image/png");
  };

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);
    try {
      const imageUrl = await generateCardImage();
      
      const link = document.createElement("a");
      link.download = `github-wrapped-2025-${fullName.replace("/", "-")}.png`;
      link.href = imageUrl;
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
    if (downloadingAll) return;
    
    setDownloadingAll(true);
    setDownloadProgress(0);
    
    try {
      const slideData = [
        { title: repoName, subtitle: "2025 Project Wrapped", emoji: "📦", stat: "", color1: "#059669", color2: "#0891b2" },
        { title: "Stars Gained", subtitle: "Community recognition", emoji: "⭐", stat: starsGained.toLocaleString(), color1: "#ca8a04", color2: "#d97706" },
        { title: "Contributors", subtitle: `Building together`, emoji: "👥", stat: contributors.toLocaleString(), color1: "#059669", color2: "#0d9488" },
        { title: "Releases", subtitle: `${formatNumber(totalDownloads)} downloads`, emoji: "🏷️", stat: totalReleases.toLocaleString(), color1: "#7c3aed", color2: "#a855f7" },
        { title: "Activity", subtitle: `${totalPRs.toLocaleString()} PRs, ${totalIssues.toLocaleString()} issues`, emoji: "📊", stat: `${totalCommits.toLocaleString()} commits`, color1: "#0891b2", color2: "#2563eb" },
        { title: "Impact", subtitle: `${forksGained.toLocaleString()} forks in 2025`, emoji: "🚀", stat: `${totalStars.toLocaleString()} total stars`, color1: "#d97706", color2: "#ea580c" },
        { title: personality.title, subtitle: personality.tagline, emoji: personality.emoji, stat: "", color1: "#059669", color2: "#0891b2" },
      ];
      
      for (let i = 0; i < slideData.length; i++) {
        setDownloadProgress(Math.round(((i + 1) / slideData.length) * 100));
        
        const slide = slideData[i];
        const imageUrl = await generateSlideImage(slide);
        
        const link = document.createElement("a");
        link.download = `github-wrapped-2025-${fullName.replace("/", "-")}-slide-${i + 1}.png`;
        link.href = imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        await new Promise(r => setTimeout(r, 300));
      }
      
    } catch (e) {
      console.error("Export failed:", e);
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = () => {
    const text = `📦 ${repoName} - 2025 Project Wrapped:\n\n⭐ ${starsGained.toLocaleString()} stars gained\n👥 ${contributors.toLocaleString()} contributors\n🔀 ${mergedPRs.toLocaleString()} PRs merged\n📦 ${formatNumber(totalDownloads)} downloads\n\n${personality.emoji} "${personality.title}"\n\nGet yours at https://github-wrapped-five.vercel.app`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const statsForDisplay = [
    { icon: Star, label: "Stars Gained", value: starsGained.toLocaleString(), color: "#eab308" },
    { icon: Users, label: "Contributors", value: contributors.toLocaleString(), color: "#10b981" },
    { icon: GitPullRequest, label: "PRs Merged", value: mergedPRs.toLocaleString(), color: "#06b6d4" },
    { icon: Tag, label: "Downloads", value: formatNumber(totalDownloads), color: "#a855f7" },
    { icon: Flame, label: "Commits", value: totalCommits.toLocaleString(), color: "#f59e0b" },
    { icon: Tag, label: "Releases", value: totalReleases.toLocaleString(), color: "#ec4899" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-black text-center mb-5 text-white"
      >
        That's a wrap! 🎬
      </motion.h1>

      {/* Visual Card Preview */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        <div 
          className="relative p-5 pb-14"
          style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)" }}
        >
          <div className="relative flex justify-center">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={repoName}
                className="w-16 h-16 rounded-full border-4 border-white shadow-xl"
              />
            )}
          </div>
          <h2 className="relative text-lg font-black text-white text-center mt-2">{repoName}</h2>
          <p className="relative text-white/80 text-center text-xs">2025 Project Wrapped</p>
        </div>

        <div className="relative -mt-8 mx-4">
          <div 
            className="grid grid-cols-2 gap-1.5 p-2.5 rounded-xl"
            style={{ backgroundColor: "#0d1512", border: "1px solid rgba(16, 185, 129, 0.2)" }}
          >
            {statsForDisplay.map((stat) => (
              <div key={stat.label} className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <stat.icon className="w-3 h-3 mb-1" style={{ color: stat.color }} />
                <div className="text-sm font-bold text-white">{stat.value}</div>
                <div className="text-[8px] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 pt-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[8px] text-gray-500 mb-0.5">Personality</div>
              <div className="text-xs font-bold text-emerald-400">
                {personality.title} {personality.emoji}
              </div>
            </div>
            <img 
              src="/images/kubesimplify-logo.png" 
              alt="Kubesimplify" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-[10px] font-medium text-emerald-400">
              Powered by Kubesimplify
            </div>
            <div className="text-[8px] font-mono text-gray-500">
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
        className="flex flex-wrap justify-center gap-3 mt-5"
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all disabled:opacity-50 text-sm"
          style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)" }}
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Saving..." : "Download"}
        </button>

        <button
          onClick={handleDownloadAllSlides}
          disabled={downloadingAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all disabled:opacity-50 text-sm"
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all text-sm"
          style={{ backgroundColor: "#1DA1F2" }}
        >
          <Twitter className="w-4 h-4" />
          Share
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all text-sm border"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}
        >
          <RotateCcw className="w-4 h-4" />
          New
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-3 text-gray-500 text-center text-xs max-w-sm"
      >
        💡 <span className="text-purple-400">All Slides</span> generates 7 carousel images
      </motion.p>
    </div>
  );
}

// Helper functions
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

async function generateSlideImage(
  slide: { title: string; subtitle: string; emoji: string; stat: string; color1: string; color2: string }
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  
  // Background
  ctx.fillStyle = "#0a0f0d";
  ctx.fillRect(0, 0, size, size);
  
  // Main gradient card
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, slide.color1);
  gradient.addColorStop(1, slide.color2);
  ctx.fillStyle = gradient;
  roundRect(ctx, 40, 40, size - 80, size - 80, 48);
  ctx.fill();
  
  // Pattern overlay
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if ((i + j) % 3 === 0) {
        ctx.fillRect(60 + i * 50, 60 + j * 50, 4, 4);
      }
    }
  }
  
  // Emoji
  ctx.font = "120px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(slide.emoji, size/2, 280);
  
  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  ctx.fillText(slide.title, size/2, 400);
  
  // Subtitle
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "32px system-ui, -apple-system, sans-serif";
  ctx.fillText(slide.subtitle, size/2, 460);
  
  // Stat
  if (slide.stat) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 140px system-ui, -apple-system, sans-serif";
    ctx.fillText(slide.stat, size/2, 650);
  }
  
  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "18px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Powered by Kubesimplify", 80, size - 60);
  
  ctx.textAlign = "right";
  ctx.fillText("github-wrapped-five.vercel.app", size - 80, size - 60);
  
  return canvas.toDataURL("image/png");
}
