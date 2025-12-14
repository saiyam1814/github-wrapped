export type DeveloperPersona =
    | "The Architect"
    | "The Machine"
    | "The Fixer"
    | "The Artist"
    | "The Explorer"
    | "The Guardian";

export type ContributionDay = {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // GitHub contribution level
};

export type LanguageStat = {
    name: string;
    color: string;
    size: number; // Bytes or rough occurrence count
};

export type WrappedData = {
    user: {
        login: string;
        name: string;
        avatarUrl: string;
        createdAt: string;
    };
    year: number;
    personality: {
        type: DeveloperPersona;
        description: string;
    };
    stats: {
        totalCommits: number;
        totalPRs: number;
        totalIssues: number;
        totalReviews: number;
        totalStarsGiven: number;
        totalStarsReceived: number;
        longestStreak: number;
        mostActiveDay: string; // "Tuesday"
        mostActiveMonth: string; // "October"
        topLanguages: LanguageStat[];
        hourlyHeatmap: number[]; // 0-23 array summing commits per hour
    };
    contributions: ContributionDay[]; // For the big heatmap
};
