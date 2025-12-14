import { WrappedData } from "@/lib/types";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useRef } from "react";
// import html2canvas from "html2canvas"; // user requested this later? for now just UI.

export default function SummarySlide({ data }: { data: WrappedData }) {
    const cardRef = useRef(null);

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <motion.div
                ref={cardRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black border border-white/20 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/30 blur-[60px]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/30 blur-[60px]" />

                <div className="flex items-center gap-4 mb-8">
                    <img src={data.user.avatarUrl} className="w-16 h-16 rounded-full border border-white/20" />
                    <div className="text-left">
                        <div className="font-bold text-lg text-white">{data.user.name}</div>
                        <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded inline-block">
                            2025 GitHub Wrapped
                        </div>
                    </div>
                </div>

                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                    {data.personality.type}
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">Commits</div>
                        <div className="text-xl font-bold text-white">{data.stats.totalCommits}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">Top Lang</div>
                        <div className="text-xl font-bold text-white">{data.stats.topLanguages[0]?.name || 'N/A'}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">Streak</div>
                        <div className="text-xl font-bold text-white">{data.stats.longestStreak} days</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <div className="text-xs text-gray-400">Active On</div>
                        <div className="text-xl font-bold text-white">{data.stats.mostActiveDay}</div>
                    </div>
                </div>

                <div className="mt-8 text-[10px] text-gray-600 font-mono">
                    wrapped-2025.example.com
                </div>
            </motion.div>

            <button
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200"
                onClick={() => window.print()} // Placeholder for now
            >
                <Download size={18} /> Download Card
            </button>
        </div>
    );
}
