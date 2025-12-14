import { WrappedData } from "@/lib/types";
import { motion } from "framer-motion";

export default function StatsSlide({ data }: { data: WrappedData }) {
    const stats = [
        { label: "Commits Pushed", value: data.stats.totalCommits, color: "text-green-400" },
        { label: "Pull Requests", value: data.stats.totalPRs, color: "text-purple-400" },
        { label: "Issues Opened", value: data.stats.totalIssues, color: "text-orange-400" },
        { label: "Code Reviews", value: data.stats.totalReviews, color: "text-blue-400" },
    ];

    return (
        <div className="w-full max-w-4xl px-4">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
                The Numbers
            </motion.h2>

            <div className="grid grid-cols-2 gap-8 md:gap-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="text-center"
                    >
                        <div className={`text-6xl md:text-8xl font-black mb-2 ${stat.color}`}>
                            {stat.value}
                        </div>
                        <div className="text-xl text-gray-400 font-medium uppercase tracking-widest">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
