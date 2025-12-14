import { motion } from 'framer-motion';

const StatsSlide = ({ data, slideType }) => {
    // Determine content based on data type and slide type
    let title, value, subtext, icon;

    if (data.type === 'user') {
        if (slideType === 'primary') {
            title = "Total Contributions";
            value = data.totalContributions;
            subtext = "You pushed code like a machine!";
        } else {
            title = "Max Streak";
            value = `${data.maxStreak} Days`;
            subtext = "Consistency is key.";
        }
    } else {
        // Project
        if (slideType === 'primary') {
            title = "Total Downloads";
            value = data.totalDownloads.toLocaleString();
            subtext = "People love your work!";
        } else {
            title = "New Stars";
            value = data.stars.toLocaleString(); // Note: This is total in our API currently, maybe label "Total Stars"
            subtext = "Shining bright.";
        }
    }

    // Animation for numbers counting up could be added here, simplified for now

    return (
        <div className="text-center">
            <h3 className="text-3xl text-secondary font-light mb-6">{title}</h3>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-8xl font-black text-white glow-text mb-4"
            >
                {value}
            </motion.div>
            <p className="text-xl text-gray-400">{subtext}</p>

            {/* Extra info for secondary view */}
            {slideType === 'secondary' && data.type === 'user' && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                        <h4 className="text-sm text-secondary mb-2">Busiest Day</h4>
                        <div className="text-xl font-bold text-white">{data.busiestDay || "N/A"}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <h4 className="text-sm text-secondary mb-2">PR / Issue Ratio</h4>
                        <div className="text-xl font-bold text-white">{data.ratio || "0"}</div>
                    </div>
                    <div className="col-span-2">
                        <h4 className="text-sm text-secondary mb-2">Top Languages</h4>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {data.topLanguages.map(lang => (
                                <span key={lang} className="px-3 py-1 bg-indigo-500/20 text-indigo-200 rounded-full border border-indigo-500/30 text-xs">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {slideType === 'secondary' && data.type === 'project' && (
                <div className="mt-12 flex justify-center gap-8">
                    <div>
                        <div className="text-4xl font-bold">{data.contributorsCount}</div>
                        <div className="text-sm text-secondary">Contributors</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold">{data.releasesCount}</div>
                        <div className="text-sm text-secondary">Releases</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsSlide;
