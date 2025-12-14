import { WrappedData } from "@/lib/types";
import { motion } from "framer-motion";

export default function PersonalitySlide({ data }: { data: WrappedData }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-2xl">
            <h3 className="text-2xl text-purple-300 font-medium mb-8">Your Developer Persona</h3>

            <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.8 }} // slower reveal
                className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/20 p-12 rounded-3xl shadow-2xl transform-preserve-3d"
            >
                <div className="text-6xl mb-6">🔮</div>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-6">
                    {data.personality.type}
                </h1>
                <p className="text-xl md:text-2xl text-purple-100 leading-relaxed font-light">
                    {data.personality.description}
                </p>
            </motion.div>
        </div>
    );
}
