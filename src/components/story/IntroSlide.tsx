import { WrappedData } from "@/lib/types";
import { motion } from "framer-motion";

export default function IntroSlide({ data }: { data: WrappedData }) {
    return (
        <div className="text-center flex flex-col items-center max-w-2xl">
            <motion.img
                src={data.user.avatarUrl}
                className="w-48 h-48 rounded-full border-4 border-white/20 mb-8 shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl text-purple-300 font-medium mb-4"
            >
                2025 GitHub Wrapped
            </motion.h2>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-6xl md:text-8xl font-black tracking-tighter"
            >
                Hi, {data.user.name.split(' ')[0]}
            </motion.h1>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 1, duration: 1 }}
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 mt-8 rounded-full"
            />
        </div>
    );
}
