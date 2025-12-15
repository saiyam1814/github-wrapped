"use client";

import { motion } from "framer-motion";
import { Package, Download, Tag, ArrowDown } from "lucide-react";
import type { ProjectData } from "../page";
import { useEffect, useState } from "react";

interface Props {
  data: ProjectData;
  onNext: () => void;
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = safeValue;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(end * eased));

        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [safeValue, delay]);

  return <span>{display.toLocaleString()}</span>;
}

function formatDownloads(num: number): string {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ProjectReleasesSlide({ data }: Props) {
  const { releases } = data;
  
  // Safely get values
  const releaseCount = releases?.count2025 || 0;
  const totalDownloads = releases?.totalDownloads2025 || 0;
  const releasesList = releases?.releases || [];

  // No releases case
  if (releaseCount === 0 && releasesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl mb-6"
        >
          📦
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-4"
        >
          No stable releases in 2025
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 max-w-md"
        >
          Alpha, beta, RC, and pre-releases are excluded. Stable releases coming soon!
        </motion.p>
      </div>
    );
  }

  const topReleases = releasesList.slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-2"
      >
        Shipped in 2025
      </motion.p>

      {/* Main Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {/* Releases Count */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center"
        >
          <div className="relative mb-2">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/30" />
            <div className="relative flex items-center gap-2">
              <Package className="w-8 h-8 text-cyan-400" />
              <span className="text-5xl md:text-6xl font-black text-cyan-400">
                <AnimatedNumber value={releaseCount} delay={500} />
              </span>
            </div>
          </div>
          <p className="text-gray-400">stable releases</p>
        </motion.div>

        {/* Downloads - show only if we have data, otherwise indicate external hosting */}
        {totalDownloads > 0 ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className="relative mb-2">
              <div className="absolute inset-0 blur-2xl bg-emerald-500/30" />
              <div className="relative flex items-center gap-2">
                <Download className="w-8 h-8 text-emerald-400" />
                <span className="text-5xl md:text-6xl font-black text-emerald-400">
                  <AnimatedNumber value={totalDownloads} delay={700} />
                </span>
              </div>
            </div>
            <p className="text-gray-400">total downloads</p>
          </motion.div>
        ) : releaseCount > 0 ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className="relative mb-2">
              <div className="absolute inset-0 blur-xl bg-emerald-500/20" />
              <div className="relative flex items-center gap-2">
                <Download className="w-8 h-8 text-emerald-400/60" />
                <span className="text-3xl md:text-4xl font-bold text-emerald-400/60">
                  External
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">downloads tracked externally</p>
          </motion.div>
        ) : null}
      </div>

      {/* Top Releases */}
      {topReleases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full max-w-md"
        >
          <p className="text-sm text-gray-500 mb-3 text-center">
            {totalDownloads > 0 ? "Top releases by downloads" : "Recent releases"}
          </p>
          <div className="space-y-2">
            {topReleases.map((release, index) => (
              <motion.div
                key={release.tagName || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-white font-medium text-sm">
                      {release.name || release.tagName || "Release"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {release.publishedAt ? new Date(release.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }) : ""}
                    </div>
                  </div>
                </div>
                {totalDownloads > 0 && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ArrowDown className="w-4 h-4" />
                    <span className="font-bold">{formatDownloads(release.downloads || 0)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-gray-500 text-center mt-8"
      >
        Every release brings improvements to users worldwide
      </motion.p>
    </div>
  );
}
