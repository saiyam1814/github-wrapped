import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Search, Key } from 'lucide-react';
import './InputForm.css';

const InputForm = ({ onStart, loading, error }) => {
    const [mode, setMode] = useState('user'); // 'user' or 'project'
    const [inputVal, setInputVal] = useState('');
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;
        onStart(mode, inputVal, token);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full glass-panel p-8 text-center"
        >
            <div className="mb-6 flex justify-center">
                <Github size={48} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold mb-2">
                GitHub <span className="text-gradient">Wrapped</span>
            </h1>
            <p className="text-secondary mb-8">
                Your 2024 Year in Code. Discover your stats, personality, and impact.
            </p>

            {/* Mode Toggle */}
            <div className="flex bg-black/20 p-1 rounded-xl mb-6">
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'user' ? 'bg-white/10 text-white shadow-lg' : 'text-secondary hover:text-white'}`}
                    onClick={() => setMode('user')}
                >
                    Personal Profile
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'project' ? 'bg-white/10 text-white shadow-lg' : 'text-secondary hover:text-white'}`}
                    onClick={() => setMode('project')}
                >
                    Project / Repo
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={mode === 'user' ? "Enter GitHub Username" : "Enter Repository URL (owner/repo)"}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
                </div>

                <div className="relative group">
                    <input
                        type="password"
                        placeholder="GitHub Token (Optional for public, required for personal)"
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <Key className="absolute left-3 top-3.5 text-gray-500" size={20} />
                    <div className="text-xs text-left mt-2 text-gray-400">
                        <span className="text-indigo-400 font-bold">Tip:</span> Use a token to avoid rate limits and unlock full Personal Stats.
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                        <>Get My Wrapped <span>→</span></>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => onStart('demo')}
                    className="w-full mt-4 text-sm text-gray-500 hover:text-white transition-colors underline"
                >
                    No token? Try a Demo Profile
                </button>
            </form>

            <p className="mt-6 text-xs text-gray-600">
                This runs 100% in your browser. No data is stored.
            </p>
        </motion.div>
    );
};

export default InputForm;
