"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Search, User, FolderGit2, Sparkles, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"user" | "project">("user");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modes = [
    { id: "user" as const, label: "Developer", icon: User, description: "Your personal GitHub wrapped" },
    { id: "project" as const, label: "Repository", icon: FolderGit2, description: "Any public repository" },
  ];

  const getPlaceholder = () => {
    switch (mode) {
      case "user":
        return "Enter GitHub username (e.g., saiyam1814)";
      case "project":
        return "Enter repo (e.g., facebook/react)";
      default:
        return "Enter identifier";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === "user") {
        router.push(`/wrapped/${encodeURIComponent(inputVal.trim())}`);
      } else {
        const parts = inputVal.trim().split("/");
        if (parts.length >= 2) {
          router.push(`/project/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}`);
        } else {
          setError("Please enter in format: owner/repo");
          setLoading(false);
        }
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleDemo = () => {
    router.push("/wrapped/octocat?demo=true");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-mesh">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Main Card */}
        <div className="glass-strong rounded-3xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6"
            >
              <Github className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black mb-3"
            >
              GitHub <span className="text-gradient">Wrapped</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400"
            >
              Your <span className="text-emerald-400 font-semibold">2025</span> year in code. Discover your stats, personality, and impact.
            </motion.p>
          </div>

          {/* Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-xl bg-white/5"
          >
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all ${
                  mode === m.id
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                <m.icon className={`w-5 h-5 ${mode === m.id ? "text-emerald-400" : "text-gray-400"}`} />
                <span className={`text-xs font-medium ${mode === m.id ? "text-white" : "text-gray-400"}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Username/Repo Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={getPlaceholder()}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                disabled={loading}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button - New Emerald/Cyan gradient */}
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="w-full relative overflow-hidden rounded-xl py-4 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Wrapped
                  </>
                )}
              </span>
            </button>

            {/* Demo Button */}
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Try with <span className="underline text-emerald-400">@octocat</span> demo
            </button>
          </motion.form>
        </div>

        {/* Privacy Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-600 mt-6"
        >
          <Shield className="w-3 h-3 inline mr-1" />
          We only access public GitHub data. Nothing is stored.
        </motion.p>
      </motion.div>
    </div>
  );
}
