import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlide from './slides/IntroSlide';
import StatsSlide from './slides/StatsSlide';
import PersonalitySlide from './slides/PersonalitySlide';
import SummarySlide from './slides/SummarySlide';
import { ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

const WrappedCarousel = ({ data, onReset }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3')); // Placeholder royalty free music

    // Slides configuration based on data type
    const slides = [
        { component: IntroSlide, key: 'intro' },
        { component: StatsSlide, key: 'stats-1', type: 'primary' }, // Main stat (Commits or Stars)
        { component: StatsSlide, key: 'stats-2', type: 'secondary' }, // Secondary stats (Streak/Languages or Contributors/Downloads)
        { component: PersonalitySlide, key: 'personality' },
        { component: SummarySlide, key: 'summary' },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    /* Auto-Advance Logic */
    useEffect(() => {
        const timer = setInterval(() => {
            // Only auto-advance if not on summary slide (last slide)
            if (currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
            }
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, [currentSlide, slides.length]);

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed interaction required", e));
        }
        setIsPlaying(!isPlaying);
    };

    // Cleanup audio & Start on Mount (attempt)
    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;
        audio.volume = 0.5;

        // Attempt auto-play with interaction catch
        // Better UX: Start playing when component mounts if user already interacted?
        // User requested "presentation should auto move". 
        // We can try to play logic immediately.
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

        return () => {
            audio.pause();
        };
    }, []);

    const CurrentSlideComponent = slides[currentSlide].component;

    return (
        <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={toggleMusic} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
                    {isPlaying ? <Volume2 className="text-white" /> : <VolumeX className="text-white/50" />}
                </button>
            </div>

            <div className="w-full h-full relative overflow-hidden glass-panel flex flex-col">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex items-center justify-center p-8"
                    >
                        <CurrentSlideComponent data={data} slideIndex={currentSlide} totalSlides={slides.length} slideType={slides[currentSlide].type} onNext={handleNext} />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12 items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`p-2 rounded-full transition-all ${currentSlide === 0 ? 'opacity-0 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="flex gap-2">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    {currentSlide < slides.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            <ChevronRight size={32} />
                        </button>
                    ) : (
                        <button
                            onClick={onReset}
                            className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all"
                        >
                            Fresh Start
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WrappedCarousel;
