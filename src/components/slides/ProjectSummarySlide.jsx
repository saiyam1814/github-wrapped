import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Download, Share2, Twitter, RotateCcw, Star, GitFork, Users, Package } from 'lucide-react';

const ProjectSummarySlide = ({ data, onReset }) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const { repo, community, pullRequests, releases, personality, health } = data;

  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#6366f1', '#ec4899', '#fbbf24', '#10b981'];

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
        backgroundColor: '#0a0a0a',
        scale: 3,
        logging: false,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `github-wrapped-2024-${repo.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const text = `🎁 ${repo.name}'s GitHub Wrapped 2024:\n\n⭐ ${repo.stars.toLocaleString()} stars\n👥 ${community.totalContributors} contributors\n🔄 ${pullRequests.merged} PRs merged\n📦 ${releases.count} releases\n\n${personality.emoji} "${personality.title}"\n\nGet yours at github-wrapped.dev`;
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-center mb-8"
      >
        That's a wrap! 🎉
      </motion.h1>

      {/* Shareable Card */}
      <motion.div
        ref={cardRef}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Header */}
        <div className="relative p-6 pb-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-black/20 flex items-center justify-center text-3xl font-bold text-white">
              {repo.name[0]}
            </div>
            <h2 className="text-2xl font-black text-white">{repo.name}</h2>
            <p className="text-white/80 text-sm">2024 GitHub Wrapped</p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative -mt-8 mx-4">
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#111111] border border-white/10">
            <div className="p-3 rounded-xl bg-white/5">
              <Star className="w-4 h-4 text-yellow-400 mb-1" />
              <div className="text-lg font-bold text-white">{repo.stars.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Stars</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <Users className="w-4 h-4 text-green-400 mb-1" />
              <div className="text-lg font-bold text-white">{community.totalContributors}</div>
              <div className="text-xs text-gray-500">Contributors</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <GitFork className="w-4 h-4 text-blue-400 mb-1" />
              <div className="text-lg font-bold text-white">{repo.forks.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Forks</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <Package className="w-4 h-4 text-purple-400 mb-1" />
              <div className="text-lg font-bold text-white">{releases.count}</div>
              <div className="text-xs text-gray-500">Releases</div>
            </div>
          </div>
        </div>

        {/* Personality */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Project Type</div>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                {personality.title}
              </div>
            </div>
            <div className="text-[10px] text-gray-600 font-mono px-2 py-1 rounded border border-white/10">
              github-wrapped.dev
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {downloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {downloading ? 'Generating...' : 'Download'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2] text-white font-semibold hover:bg-[#1a8cd8] transition-all"
        >
          <Twitter className="w-5 h-5" />
          Share
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Start Over
        </button>
      </motion.div>
    </div>
  );
};

export default ProjectSummarySlide;


