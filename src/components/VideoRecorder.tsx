"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Download, X, Loader2, Play, Square, Monitor } from "lucide-react";

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
  totalSlides: number;
  slideDurations: number[];
  goToSlide: (n: number) => void;
  showButton: boolean;
}

export default function VideoRecorder({ totalSlides, slideDurations, goToSlide, showButton }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [phase, setPhase] = useState<"idle"|"recording"|"processing"|"done">("idle");
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [slideNum, setSlideNum] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const runningRef = useRef(false);

  const totalMs = slideDurations.reduce((a,b) => a + (b || 5000), 0);
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runRecording = async () => {
    setError(null);
    
    try {
      // Request screen capture - user will pick this tab
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      runningRef.current = true;
      chunksRef.current = [];
      setPhase("recording");
      setShowModal(false);
      setSlideNum(0);

      // Setup recorder
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
      
      recorder.ondataavailable = e => { 
        if(e.data.size > 0) chunksRef.current.push(e.data); 
      };
      
      // Handle if user stops sharing
      stream.getVideoTracks()[0].onended = () => {
        if (runningRef.current) stopRecording();
      };
      
      mediaRecorderRef.current = recorder;
      recorder.start(100);

      // Small delay then start slides
      await wait(500);
      goToSlide(0);
      await wait(500);
      
      // Go through ALL slides
      for (let i = 0; i < totalSlides; i++) {
        if (!runningRef.current) break;
        setSlideNum(i);
        goToSlide(i);
        const duration = slideDurations[i] || 5000;
        await wait(duration);
      }

      // Extra time on last slide
      if (runningRef.current) await wait(2000);

      // Stop recording
      await stopRecording();
      
    } catch (err: any) {
      setError(err.message || "Failed to start screen capture. Please allow screen sharing.");
      setPhase("idle");
      runningRef.current = false;
    }
  };

  const stopRecording = async () => {
    runningRef.current = false;
    setPhase("processing");
    
    const recorder = mediaRecorderRef.current;
    const stream = streamRef.current;
    
    if (recorder && recorder.state !== "inactive") {
      return new Promise<void>(resolve => {
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          setVideoBlob(blob);
          setPhase("done");
          setShowModal(true);
          if (stream) stream.getTracks().forEach(track => track.stop());
          resolve();
        };
        recorder.stop();
      });
    } else {
      setPhase("idle");
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  };

  const stopEarly = () => {
    runningRef.current = false;
    stopRecording();
  };

  const download = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "github-wrapped-2025.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setVideoBlob(null);
    setPhase("idle");
    setSlideNum(0);
    setError(null);
  };

  useEffect(() => {
    return () => { 
      runningRef.current = false;
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const progress = Math.round(((slideNum + 1) / totalSlides) * 100);
  const shouldShowButton = showButton && phase === "idle";

  return (
    <>
      {shouldShowButton && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
            <Video className="w-5 h-5" /> Record Video
          </button>
        </div>
      )}

      {phase === "recording" && (
        <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl bg-gray-900/95 border border-red-500/50 shadow-2xl backdrop-blur">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-white font-medium">Recording</span>
          <span className="text-gray-400">Slide {slideNum+1}/{totalSlides}</span>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all" style={{width:`${progress}%`}}/>
          </div>
          <button onClick={stopEarly} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 flex items-center gap-2">
            <Square className="w-4 h-4"/> Stop
          </button>
        </motion.div>
      )}

      {phase === "processing" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4"/>
            <p className="text-white text-lg">Processing video...</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={e => { if(e.target === e.currentTarget && phase !== "recording") setShowModal(false); }}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}}
              className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-emerald-500/20">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5 text-gray-400"/>
              </button>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${phase==="done"?"bg-emerald-500":"bg-gradient-to-br from-rose-500 to-pink-500"}`}>
                  {phase==="done" ? <Download className="w-8 h-8 text-white"/> : <Monitor className="w-8 h-8 text-white"/>}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {phase==="done" ? "Video Ready! 🎉" : "Record Your Wrapped"}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {phase==="done" ? "Your video is ready to download" : `Records all ${totalSlides} slides (~${Math.round(totalMs/1000)}s)`}
                </p>
                
                {phase === "idle" && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 text-left">
                    <p className="text-amber-400 text-sm">
                      <strong>📺 Screen sharing required:</strong> When prompted, select <strong>&quot;This Tab&quot;</strong> to record the slides with full animations.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {phase === "idle" && (
                  <button onClick={runRecording}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90">
                    <Play className="w-5 h-5"/> Start Recording
                  </button>
                )}
                {phase === "done" && videoBlob && (
                  <>
                    <button onClick={download}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold mb-3 flex items-center justify-center gap-2">
                      <Download className="w-5 h-5"/> Download ({(videoBlob.size/1024/1024).toFixed(1)} MB)
                    </button>
                    <button onClick={reset} className="w-full py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10">
                      Record Again
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
