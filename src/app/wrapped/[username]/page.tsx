"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Pause, Play, Home } from "lucide-react";
import Link from "next/link";

// Import slide components
import IntroSlide from "./slides/IntroSlide";
import ContributionsSlide from "./slides/ContributionsSlide";
import StreakSlide from "./slides/StreakSlide";
import LanguagesSlide from "./slides/LanguagesSlide";
import ActivitySlide from "./slides/ActivitySlide";
import ImpactSlide from "./slides/ImpactSlide";
import PersonalitySlide from "./slides/PersonalitySlide";
import SummarySlide from "./slides/SummarySlide";

import { generateDemoData, type DeveloperData } from "./utils";

export default function WrappedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const isDemo = searchParams.get("demo") === "true";

  const [data, setData] = useState<DeveloperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides = [
    { component: IntroSlide, duration: 6000 },
    { component: ContributionsSlide, duration: 8000 },
    { component: StreakSlide, duration: 7000 },
    { component: LanguagesSlide, duration: 7000 },
    { component: ActivitySlide, duration: 7000 },
    { component: ImpactSlide, duration: 7000 },
    { component: PersonalitySlide, duration: 8000 },
    { component: SummarySlide, duration: 0 },
  ];

  const currentDuration = slides[currentSlide]?.duration || 0;

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        if (isDemo || username.toLowerCase() === "octocat") {
          await new Promise(r => setTimeout(r, 1000));
          setData(generateDemoData());
          return;
        }

        // Use the server API route
        const response = await fetch(`/api/wrapped?username=${encodeURIComponent(username)}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch data");
        }
        
        setData(result);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [username, isDemo]);

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

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || currentSlide >= slides.length - 1 || currentDuration === 0 || !data) {
      return;
    }

    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / currentDuration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= currentDuration) {
        handleNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, currentDuration, handleNext, data, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "p") {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Generating your 2025 wrapped...</p>
          <p className="text-gray-600 text-sm mt-2">Fetching data for @{username}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error || "Could not load data"}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-mesh">
      {/* Background gradients - Teal/Emerald */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-emerald-900/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-cyan-900/20 to-transparent" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-emerald-500/20 transition-all"
        >
          {isPaused ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-emerald-500/20 transition-all"
      >
        <Home className="w-5 h-5 text-white" />
      </Link>

      {/* Progress Bars - Emerald/Cyan gradient */}
      <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 p-4">
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: "0%" }}
              animate={{
                width: idx < currentSlide ? "100%" : idx === currentSlide ? `${progress}%` : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl h-screen flex items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center"
          >
            <CurrentSlideComponent data={data} onNext={handleNext} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-40">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full transition-all ${
            currentSlide === 0
              ? "opacity-0 cursor-default"
              : "bg-white/5 hover:bg-white/10 border border-emerald-500/20 text-white"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

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
                  ? "w-8 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {currentSlide < slides.length - 1 && (
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-emerald-500/20 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {currentSlide === slides.length - 1 && <div className="w-12" />}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600">
        Use ← → arrows to navigate
      </div>
    </div>
  );
}
