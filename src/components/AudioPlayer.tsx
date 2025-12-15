"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Free lofi tracks from Internet Archive (public domain / Creative Commons)
const LOFI_TRACKS = [
  "https://ia800605.us.archive.org/8/items/LofiHipHopMix/Lofi%20Hip%20Hop%20Mix.mp3",
  "https://ia600501.us.archive.org/23/items/RelaxingPianoMusic_765/RelaxingPianoMusic.mp3",
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.25;
    audio.crossOrigin = "anonymous";
    
    // Try first track
    let trackIndex = 0;
    audio.src = LOFI_TRACKS[trackIndex];
    audioRef.current = audio;

    // Handle errors - try next track
    audio.onerror = () => {
      trackIndex++;
      if (trackIndex < LOFI_TRACKS.length) {
        audio.src = LOFI_TRACKS[trackIndex];
      } else {
        setHasError(true);
      }
    };

    // Hide hint after 5 seconds
    const hintTimer = setTimeout(() => setShowHint(false), 5000);

    return () => {
      audio.pause();
      audio.src = "";
      clearTimeout(hintTimer);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current || hasError) return;

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
      setHasError(true);
    }
  };

  // Don't render if audio failed
  if (hasError) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && (
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
