"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Generate ambient lofi sounds using Web Audio API - no CORS issues!
class LofiGenerator {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;

  async init() {
    if (this.audioContext) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioContext.destination);
  }

  createNoise(): AudioBufferSourceNode {
    const ctx = this.audioContext!;
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create pink noise (softer than white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    // Low pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    
    return noise;
  }

  createChord(frequencies: number[], startTime: number, duration: number) {
    const ctx = this.audioContext!;
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const gain = ctx.createGain();
      gain.gain.value = 0;
      
      // Soft attack and release
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.03, startTime + 0.5);
      gain.gain.setValueAtTime(0.03, startTime + duration - 1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      // Low pass for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
      
      this.oscillators.push(osc);
    });
  }

  async play() {
    await this.init();
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    const ctx = this.audioContext!;
    
    // Resume context if suspended
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    
    // Fade in
    this.masterGain!.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain!.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1);
    
    // Start ambient noise
    this.noiseNode = this.createNoise();
    this.noiseNode.start();
    
    // Lofi chord progressions (jazzy chords)
    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [329.63, 392.00, 493.88, 587.33], // Em7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [392.00, 493.88, 587.33, 698.46], // G7
      [440.00, 523.25, 659.25, 783.99], // Am7
    ];
    
    // Play chord progression in loop
    const playProgression = () => {
      if (!this.isPlaying) return;
      
      const now = ctx.currentTime;
      const chordDuration = 4;
      
      chordProgressions.forEach((chord, i) => {
        // Transpose down an octave for warmth
        const lowChord = chord.map(f => f / 2);
        this.createChord(lowChord, now + (i * chordDuration), chordDuration + 0.5);
      });
      
      // Schedule next progression
      setTimeout(playProgression, chordProgressions.length * chordDuration * 1000);
    };
    
    playProgression();
  }

  stop() {
    if (!this.isPlaying || !this.audioContext) return;
    
    this.isPlaying = false;
    
    // Fade out
    const ctx = this.audioContext;
    this.masterGain!.gain.setValueAtTime(this.masterGain!.gain.value, ctx.currentTime);
    this.masterGain!.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    
    // Stop noise after fade
    setTimeout(() => {
      if (this.noiseNode) {
        try {
          this.noiseNode.stop();
        } catch (e) {}
        this.noiseNode = null;
      }
    }, 600);
    
    this.oscillators = [];
  }

  setVolume(volume: number) {
    if (this.masterGain && this.isPlaying) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
    }
  }
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const generatorRef = useRef<LofiGenerator | null>(null);

  useEffect(() => {
    generatorRef.current = new LofiGenerator();
    
    // Hide hint after 5 seconds
    const hintTimer = setTimeout(() => setShowHint(false), 5000);

    return () => {
      if (generatorRef.current) {
        generatorRef.current.stop();
      }
      clearTimeout(hintTimer);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!generatorRef.current) return;

    try {
      if (isPlaying) {
        generatorRef.current.stop();
        setIsPlaying(false);
      } else {
        await generatorRef.current.play();
        setIsPlaying(true);
        setShowHint(false);
      }
    } catch (err) {
      console.log("Audio play failed:", err);
    }
  }, [isPlaying]);

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
            <span>Click for ambient vibes 🎵</span>
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
        title={isPlaying ? "Mute music" : "Play ambient music"}
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
