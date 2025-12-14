import { WrappedData } from "@/lib/types";
import { motion } from "framer-motion";

export default function HeatmapSlide({ data }: { data: WrappedData }) {
    const total = data.stats.totalCommits; // or total contributions
    const bestDay = data.stats.mostActiveDay;

    return (
        <div className="text-center max-w-5xl w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-12"
            >
                <h2 className="text-3xl text-gray-400 font-light mb-4">You were unstoppable on</h2>
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-2">{bestDay}s</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-flow-col gap-1 auto-rows-[minmax(0,_1fr)] overflow-hidden h-48 md:h-64 mask-image-b-0"
                style={{ gridTemplateRows: "repeat(7, 1fr)" }}
            >
                {/* Simplified rendering of contribution days */}
                {data.contributions.map((day, i) => (
                    <div
                        key={i}
                        className={`w-2 md:w-3 rounded-sm ${day.level === 0 ? "bg-white/5" :
                                day.level === 1 ? "bg-green-900" :
                                    day.level === 2 ? "bg-green-700" :
                                        day.level === 3 ? "bg-green-500" :
                                            "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                            }`}
                        title={`${day.date}: ${day.count}`}
                    />
                ))}
            </motion.div>
            <p className="mt-8 text-gray-500 text-sm">Your Contribution Graph</p>
        </div>
    );
}
