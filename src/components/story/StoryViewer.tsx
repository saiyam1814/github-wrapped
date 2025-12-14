"use client";

import { useState, useEffect } from "react";
import { WrappedData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import IntroSlide from "./IntroSlide";
import StatsSlide from "./StatsSlide";
import HeatmapSlide from "./HeatmapSlide";
import PersonalitySlide from "./PersonalitySlide";
import SummarySlide from "./SummarySlide";

const SLIDES = [
    { id: 'intro', component: IntroSlide },
    { id: 'stats', component: StatsSlide },
    { id: 'heatmap', component: HeatmapSlide },
    { id: 'personality', component: PersonalitySlide },
    { id: 'summary', component: SummarySlide },
];

export default function StoryViewer({ data }: { data: WrappedData }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlide]);

    const SlideComponent = SLIDES[currentSlide].component;

    return (
        <div className="h-screen w-full bg-black overflow-hidden relative font-sans text-white">

            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 z-50 flex gap-2">
                {SLIDES.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: idx < currentSlide ? "100%" : idx === currentSlide ? "100%" : "0%" }}
                            transition={idx === currentSlide ? { duration: 10, ease: "linear" } : { duration: 0.3 }}
                            onAnimationComplete={() => {
                                if (idx === currentSlide) handleNext();
                            }}
                            className={`h-full ${idx < currentSlide ? "bg-purple-500" : "bg-white"}`}
                        />
                    </div>
                ))}
            </div>

            {/* Slide Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full flex items-center justify-center p-6"
                    onClick={handleNext} // Click to advance
                >
                    <SlideComponent data={data} />
                </motion.div>
            </AnimatePresence>

            {/* Controls hint */}
            <div className="absolute bottom-6 w-full text-center text-xs text-gray-500 opacity-50 pointer-events-none">
                Click or use arrows to navigate
            </div>
        </div>
    );
}
