import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Pause, Play } from 'lucide-react';

// Developer Slides
import IntroSlide from './slides/IntroSlide';
import ContributionsSlide from './slides/ContributionsSlide';
import StreakSlide from './slides/StreakSlide';
import LanguagesSlide from './slides/LanguagesSlide';
import ActivitySlide from './slides/ActivitySlide';
import ImpactSlide from './slides/ImpactSlide';
import CollaborationSlide from './slides/CollaborationSlide';
import PersonalitySlide from './slides/PersonalitySlide';
import SummarySlide from './slides/SummarySlide';

// Project Slides
import ProjectIntroSlide from './slides/ProjectIntroSlide';
import ProjectStatsSlide from './slides/ProjectStatsSlide';
import ProjectHealthSlide from './slides/ProjectHealthSlide';
import ProjectSummarySlide from './slides/ProjectSummarySlide';

const WrappedCarousel = ({ data, onReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  const isProject = data.type === 'repository';

  // Define slides based on data type
  const slides = isProject ? [
    { component: ProjectIntroSlide, key: 'intro', duration: 6000 },
    { component: ProjectStatsSlide, key: 'growth', variant: 'growth', duration: 7000 },
    { component: ProjectStatsSlide, key: 'velocity', variant: 'velocity', duration: 7000 },
    { component: ProjectHealthSlide, key: 'health', duration: 7000 },
    { component: ProjectSummarySlide, key: 'summary', duration: 0 },
  ] : [
    { component: IntroSlide, key: 'intro', duration: 6000 },
    { component: ContributionsSlide, key: 'contributions', duration: 8000 },
    { component: StreakSlide, key: 'streak', duration: 7000 },
    { component: LanguagesSlide, key: 'languages', duration: 7000 },
    { component: ActivitySlide, key: 'activity', duration: 7000 },
    { component: ImpactSlide, key: 'impact', duration: 7000 },
    { component: CollaborationSlide, key: 'collaboration', duration: 7000 },
    { component: PersonalitySlide, key: 'personality', duration: 8000 },
    { component: SummarySlide, key: 'summary', duration: 0 },
  ];

  const currentDuration = slides[currentSlide]?.duration || 0;

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    }
  }, [currentSlide, slides.length]);

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  // Auto-advance with progress bar
  useEffect(() => {
    if (isPaused || currentSlide >= slides.length - 1 || currentDuration === 0) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    const startTime = Date.now();
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / currentDuration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= currentDuration) {
        handleNext();
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSlide, isPaused, currentDuration, handleNext, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'p') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  // Slide animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden bg-mesh">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-indigo-900/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-pink-900/20 to-transparent" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {/* Pause/Play */}
        <button
          onClick={togglePause}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          title={isPaused ? 'Resume (P)' : 'Pause (P)'}
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-white" />
          ) : (
            <Pause className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Music Toggle */}
        <button
          onClick={toggleMusic}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          title="Toggle Music"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/50" />
          )}
        </button>
      </div>

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 p-4">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/10"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{
                width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl h-full flex items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentSlide}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <CurrentSlideComponent
              data={data}
              onNext={handleNext}
              onReset={onReset}
              variant={slides[currentSlide].variant}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-40">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full transition-all ${
            currentSlide === 0 
              ? 'opacity-0 cursor-default' 
              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setProgress(0);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide 
                  ? 'w-8 h-2 bg-gradient-to-r from-indigo-500 to-pink-500' 
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        {currentSlide < slides.length - 1 && (
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {currentSlide === slides.length - 1 && (
          <div className="w-12" /> // Spacer
        )}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600">
        Use ← → arrows or space to navigate
      </div>
    </div>
  );
};

export default WrappedCarousel;

