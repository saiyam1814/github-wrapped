"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WrappedData } from "@/lib/types";
import StoryViewer from "@/components/story/StoryViewer";
import { motion } from "framer-motion";

export default function ProjectPage() {
    const { owner, repo } = useParams();
    const [data, setData] = useState<WrappedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!owner || !repo) return;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("gh_token");
                const res = await fetch("/api/project", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ owner, repo, token }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to fetch project data");
                }

                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error("Project Analysis Failed:", err);
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [owner, repo]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
                />
                <div className="absolute mt-24 text-blue-300 font-mono text-sm animate-pulse">
                    Analyzing {owner}/{repo}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white p-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                    Analysis Failed
                </h1>
                <p className="text-gray-400 mb-8 max-w-md">{error}</p>
                <a href="/" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    Try Another
                </a>
            </div>
        );
    }

    return <StoryViewer data={data!} />;
}
