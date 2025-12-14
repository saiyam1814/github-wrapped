import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const SummarySlide = ({ data }) => {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // Confetti Explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#ec4899', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#ec4899', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const handleDownload = async () => {
        if (cardRef.current && !downloading) {
            setDownloading(true);
            try {
                // Wait for images to load if any?
                const canvas = await html2canvas(cardRef.current, {
                    backgroundColor: '#0a0a0a', // Match theme
                    scale: 2, // Retina quality
                    logging: false,
                    useCORS: true // For User Avatar
                });
                const link = document.createElement('a');
                link.download = `github-wrapped-2024-${data.username || data.name}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (e) {
                console.error("Export failed", e);
            } finally {
                setDownloading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            {/* The Card to be Captured */}
            <motion.div
                ref={cardRef}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-0 max-w-sm w-full relative overflow-hidden text-center rounded-3xl border border-white/10 shadow-2xl bg-[#0a0a0a]"
            >
                {/* Header Graphic */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                    <div className="flex justify-center mb-4 relative z-10">
                        {data.avatarUrl ? (
                            <img src={data.avatarUrl} crossOrigin="anonymous" className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt="Avatar" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-3xl font-bold text-white border-4 border-white/20">
                                {data.name[0]}
                            </div>
                        )}
                    </div>
                    <h2 className="text-3xl font-black text-white relative z-10">{data.name}</h2>
                    <p className="text-white/80 font-medium relative z-10">
                        2024 GitHub Wrapped
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="p-6 grid grid-cols-2 gap-4 text-left">
                    {data.type === 'user' ? (
                        <>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Total Contributions</div>
                                <div className="text-2xl font-bold text-white">{data.totalContributions}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Top Language</div>
                                <div className="text-xl font-bold text-gradient">{data.topLanguages[0] || 'N/A'}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Longest Streak</div>
                                <div className="text-xl font-bold text-white">{data.maxStreak} Days</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Total Stars</div>
                                <div className="text-2xl font-bold text-yellow-400">{data.totalStars} ★</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Total Downloads</div>
                                <div className="text-xl font-bold text-white">{data.totalDownloads > 1000 ? (data.totalDownloads / 1000).toFixed(1) + 'k' : data.totalDownloads}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-secondary mb-1">Contributors</div>
                                <div className="text-xl font-bold text-white">{data.contributorsCount}</div>
                            </div>
                            <div className="col-span-2 bg-white/5 p-3 rounded-xl flex items-center justify-between">
                                <div className="text-xs text-secondary">Total Stars</div>
                                <div className="text-2xl font-bold text-yellow-400">{data.stars} ★</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="pb-6 px-6 flex justify-between items-end">
                    <div className="text-left">
                        <div className="text-xs text-gray-400">Persona</div>
                        <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                            {data.type === 'user' ? (data.maxStreak > 20 ? "The Machine" : "The Builder") : "Open Source Hero"}
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono border border-white/10 px-2 py-1 rounded">
                        git-wrapped.com
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-4 mt-8"
            >
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 btn-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
                >
                    {downloading ? <span className="animate-spin text-white">⟳</span> : <Download size={18} />}
                    {downloading ? "Generating..." : "Download Card"}
                </button>
            </motion.div>
        </div>
    );
};

export default SummarySlide;
