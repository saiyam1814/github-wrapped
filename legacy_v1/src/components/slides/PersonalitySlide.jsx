import { motion } from 'framer-motion';

const getPersona = (data) => {
    if (data.type === 'project') {
        if (data.totalDownloads > 100000) return { title: "The Heavyweight", desc: "Your project is carrying the internet." };
        if (data.contributorsCount > 50) return { title: "Community Magnet", desc: "People just want to be part of this." };
        if (data.stars > 1000) return { title: "The Rock Star", desc: "Everyone is watching you." };
        return { title: "The Hidden Gem", desc: "Small but mighty. Greatness awaits." };
    } else {
        // User
        if (data.totalContributions > 2000) return { title: "The Machine", desc: "Do you even sleep? Your code output is legendary." };
        if (data.topLanguages.length >= 5) return { title: "The Polyglot", desc: "You speak more languages than C-3PO." };
        if (data.maxStreak > 14) return { title: "The Marathon Runner", desc: "Consistency is your middle name." };
        if (data.topLanguages.length === 1) return { title: "The Specialist", desc: "Master of one, feared by many." };
        return { title: "The Builder", desc: "Brick by brick, commit by commit." };
    }
};

const PersonalitySlide = ({ data }) => {
    const { title, desc } = getPersona(data);

    return (
        <div className="text-center px-4">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-secondary mb-4"
            >
                Based on your stats, you are...
            </motion.p>

            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl inline-block mb-8"
            >
                <div className="bg-black/90 p-8 rounded-2xl backdrop-blur-xl">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">
                        {title}
                    </h2>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-light text-gray-300 max-w-lg mx-auto"
            >
                "{desc}"
            </motion.p>
        </div>
    );
};

export default PersonalitySlide;
