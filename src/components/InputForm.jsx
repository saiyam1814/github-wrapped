import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Search, Key, User, FolderGit2, Building2, Sparkles, ExternalLink, Shield, Eye } from 'lucide-react';

const InputForm = ({ onStart, loading, error }) => {
  const [mode, setMode] = useState('user'); // 'user' | 'project' | 'org'
  const [inputVal, setInputVal] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onStart(mode, inputVal.trim(), token.trim());
  };

  const modes = [
    { id: 'user', label: 'Developer', icon: User, description: 'Your personal GitHub wrapped' },
    { id: 'project', label: 'Repository', icon: FolderGit2, description: 'Any public repository' },
    { id: 'org', label: 'Organization', icon: Building2, description: 'Coming soon', disabled: true },
  ];

  const getPlaceholder = () => {
    switch (mode) {
      case 'user': return 'Enter GitHub username (e.g., octocat)';
      case 'project': return 'Enter repo (e.g., facebook/react)';
      case 'org': return 'Enter organization name';
      default: return 'Enter identifier';
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-mesh">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 mb-6"
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
              Your 2024 year in code. Discover your stats, personality, and impact.
            </motion.p>
          </div>

          {/* Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-2 mb-6 p-1 rounded-xl bg-white/5"
          >
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => !m.disabled && setMode(m.id)}
                disabled={m.disabled}
                className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all ${
                  mode === m.id
                    ? 'bg-gradient-to-r from-indigo-500/20 to-pink-500/20 border border-indigo-500/30'
                    : 'hover:bg-white/5'
                } ${m.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <m.icon className={`w-5 h-5 ${mode === m.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${mode === m.id ? 'text-white' : 'text-gray-400'}`}>
                  {m.label}
                </span>
                {m.disabled && (
                  <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-400">
                    Soon
                  </span>
                )}
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Token Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="GitHub Token (required for personal stats)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>

              <button
                type="button"
                onClick={() => setShowTokenInfo(!showTokenInfo)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Why do I need a token?
              </button>

              {showTokenInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm"
                >
                  <div className="flex items-start gap-2 text-gray-300">
                    <Eye className="w-4 h-4 mt-0.5 text-indigo-400" />
                    <div>
                      <p className="mb-2">We use <strong>read-only</strong> access to:</p>
                      <ul className="list-disc list-inside text-gray-400 space-y-1 text-xs">
                        <li>Your public profile information</li>
                        <li>Contribution statistics</li>
                        <li>Repository languages and stars</li>
                      </ul>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=read:user,repo&description=GitHub%20Wrapped%202024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-indigo-400 hover:text-indigo-300"
                      >
                        Create a token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="w-full relative overflow-hidden rounded-xl py-4 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating your wrapped...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get My Wrapped
                  </>
                )}
              </span>
            </button>

            {/* Demo Button */}
            <button
              type="button"
              onClick={() => onStart('demo')}
              disabled={loading}
              className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
            >
              No token? <span className="underline">Try a demo profile</span>
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
          100% client-side. Your data never leaves your browser.
        </motion.p>

        {/* GitHub link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-4"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InputForm;

