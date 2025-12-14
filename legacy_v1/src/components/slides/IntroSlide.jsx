import { motion } from 'framer-motion';

const IntroSlide = ({ data, onNext }) => {
    return (
        <div className="text-center flex flex-col items-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative mb-8"
            >
                {data.type === 'user' ? (
                    <img
                        src={data.avatarUrl}
                        alt={data.name}
                        className="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                    />
                ) : (
                    <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-4xl font-bold border-4 border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                        {data.name[0].toUpperCase()}
                    </div>
                )}
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-secondary font-light mb-2"
            >
                Hello, {data.name}!
            </motion.h2>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-6xl font-black mb-8 leading-tight"
            >
                Ready for your <br />
                <span className="text-gradient">2024 Wrapped?</span>
            </motion.h1>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onNext}
                className="btn-primary text-xl px-12 py-4 animate-pulse"
            >
                Let's Go!
            </motion.button>
        </div>
    );
};

export default IntroSlide;
