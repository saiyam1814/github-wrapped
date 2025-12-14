import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Download, Share2, Twitter, RotateCcw, Star, GitCommit, Flame, Code2 } from 'lucide-react';
import { developerNarratives } from '../../lib/narratives';

const SummarySlide = ({ data, onReset }) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const narratives = developerNarratives.summary;
  const isUser = data.type === 'developer';

  useEffect(() => {
    // Epic confetti celebration
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const colors = ['#6366f1', '#ec4899', '#fbbf24', '#10b981', '#3b82f6'];

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      // Right side
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });
    }, 250);

    return () => clearInterval(confettiInterval);
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
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      const name = isUser ? data.user.login : data.repo.name;
      link.download = `github-wrapped-2024-${name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const name = isUser ? data.user.name : data.repo.name;
    const text = isUser 
      ? `🎁 My GitHub Wrapped 2024:\n\n📊 ${data.contributions.total.toLocaleString()} contributions\n🔥 ${data.activity.longestStreak} day streak\n⭐ ${data.impact.totalStars.toLocaleString()} stars\n💻 Top language: ${data.languages.top?.name || 'Code'}\n\n${data.personality.emoji} I'm "${data.personality.title}"\n\nGet yours at github-wrapped.dev`
      : `🎁 ${name}'s GitHub Wrapped 2024:\n\n⭐ ${data.repo.stars.toLocaleString()} stars\n👥 ${data.community.totalContributors} contributors\n\nGet yours at github-wrapped.dev`;
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Get display data
  const displayData = isUser ? {
    name: data.user.name,
    avatar: data.user.avatarUrl,
    stats: [
      { icon: GitCommit, label: 'Contributions', value: data.contributions.total.toLocaleString(), color: 'text-green-400' },
      { icon: Flame, label: 'Longest Streak', value: `${data.activity.longestStreak} days`, color: 'text-orange-400' },
      { icon: Star, label: 'Stars Earned', value: data.impact.totalStars.toLocaleString(), color: 'text-yellow-400' },
      { icon: Code2, label: 'Top Language', value: data.languages.top?.name || 'Code', color: 'text-blue-400' },
    ],
    personality: data.personality,
  } : {
    name: data.repo.name,
    avatar: null,
    stats: [
      { icon: Star, label: 'Stars', value: data.repo.stars.toLocaleString(), color: 'text-yellow-400' },
      { icon: GitCommit, label: 'Contributors', value: data.community.totalContributors.toString(), color: 'text-green-400' },
    ],
    personality: data.personality,
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-center mb-8"
      >
        {narratives.headline}
      </motion.h1>

      {/* Shareable Card */}
      <motion.div
        ref={cardRef}
        initial={{ y: 50, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Header with gradient */}
        <div className="relative p-6 pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Avatar */}
          <div className="relative flex justify-center">
            {displayData.avatar ? (
              <img
                src={displayData.avatar}
                alt={displayData.name}
                crossOrigin="anonymous"
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-black/30 flex items-center justify-center text-4xl font-bold text-white border-4 border-white/30">
                {displayData.name[0]}
              </div>
            )}
          </div>

          {/* Name & Year */}
          <h2 className="relative text-2xl font-black text-white text-center mt-4">
            {displayData.name}
          </h2>
          <p className="relative text-white/80 text-center font-medium">
            2024 GitHub Wrapped
          </p>
        </div>

        {/* Stats */}
        <div className="relative -mt-12 mx-4">
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#111111] border border-white/10">
            {displayData.stats.map((stat, i) => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/5">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Personality</div>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                {displayData.personality.title} {displayData.personality.emoji}
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
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

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-gray-500 text-center max-w-md"
      >
        {narratives.body(2024)}
      </motion.p>
    </div>
  );
};

export default SummarySlide;


