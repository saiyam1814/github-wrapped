"use client";

import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 py-3 px-4 bg-gradient-to-t from-[#0a0f0d] to-transparent">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Powered by Kubesimplify */}
        <div className="flex items-center gap-2">
          <img 
            src="/images/kubesimplify-logo.png" 
            alt="Kubesimplify" 
            className="w-6 h-6 object-contain"
          />
          <span className="text-xs text-emerald-400 font-medium">
            Powered by Kubesimplify
          </span>
        </div>

        {/* Made by Saiyam Pathak */}
        <a
          href="https://x.com/SaiyamPathak"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors group"
        >
          <span>Made with 💚 by</span>
          <span className="font-semibold text-gray-400 group-hover:text-white transition-colors">
            Saiyam Pathak
          </span>
          <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
        </a>
      </div>
    </footer>
  );
}


