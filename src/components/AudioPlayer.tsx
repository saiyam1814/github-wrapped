"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Royalty-free lofi tracks from Pixabay (free to use)
const LOFI_TRACKS = [
  "https://cdn.pixabay.com/audio/2024/11/04/audio_a53f46c87f.mp3", // lofi-chill
  "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", // lofi-study  
  "https://cdn.pixabay.com/audio/2024/02/14/audio_78e11ef470.mp3", // lofi-relax
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pick a random track
    const trackIndex = Math.floor(Math.random() * LOFI_TRACKS.length);
    const audio = new Audio(LOFI_TRACKS[trackIndex]);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setIsLoaded(true);
    });

    // Hide hint after 5 seconds
    const hintTimer = setTimeout(() => setShowHint(false), 5000);

    return () => {
      audio.pause();
      audio.src = "";
      clearTimeout(hintTimer);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowHint(false);
      }
    } catch (err) {
      console.log("Audio play failed:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && isLoaded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/10 backdrop-blur-md border border-emerald-500/20 rounded-xl px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
          >
            <Music className="w-4 h-4 text-emerald-400" />
            <span>Click for lofi vibes 🎵</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause button */}
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isPlaying
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
            : "bg-white/10 backdrop-blur-md border border-emerald-500/20 hover:bg-white/15"
        }`}
        title={isPlaying ? "Mute music" : "Play lofi music"}
      >
        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
        
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-white relative z-10" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400 relative z-10" />
        )}
      </motion.button>

      {/* Equalizer bars animation when playing */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full"
              animate={{
                height: ["8px", "24px", "12px", "20px", "8px"],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

