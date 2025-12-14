import { DeveloperPersona } from "@/lib/types";

export function determinePersona(stats: any): { type: DeveloperPersona; description: string } {
    const { totalCommits, totalPRs, totalReviews, topLanguages, longestStreak } = stats;

    if (totalCommits > 2000) {
        return {
            type: "The Machine",
            description: "You turn coffee into code at an alarming rate. Your contribution graph is a solid wall of green.",
        };
    }

    if (topLanguages.length >= 5) {
        return {
            type: "The Explorer",
            description: "You're not afraid of new syntax. From Rust to Python, you speak them all.",
        };
    }

    if (totalReviews > totalPRs) {
        return {
            type: "The Guardian",
            description: "You ensure quality. You review more than you write, keeping the codebase clean and safe.",
        };
    }

    if (longestStreak > 30) {
        return {
            type: "The Machine", // or customized "The Marathon Runner"
            description: "Consistency is your superpower. You showed up every single day.",
        };
    }

    if (totalPRs > totalCommits / 2) {
        // High PR ratio?
        return {
            type: "The Fixer",
            description: "You ship features. You don't just commit; you deliver.",
        };
    }

    // Default
    return {
        type: "The Architect",
        description: "You build steady and strong. You might not push every hour, but when you do, it counts.",
    };
}
