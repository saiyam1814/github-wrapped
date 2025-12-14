// Types
export interface DeveloperData {
  type: string;
  year: number;
  user: {
    login: string;
    name: string;
    avatarUrl: string;
    bio?: string;
    followers: number;
    following: number;
  };
  contributions: {
    total: number;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  };
  activity: {
    longestStreak: number;
    currentStreak: number;
    busiestDay: string;
    busiestDayCount: number;
    busiestHour: number;
    peakMonth: string;
    peakMonthCount: number;
    totalActiveDays: number;
    totalDays: number;
    averagePerDay: string;
    weekdayDistribution: Record<number, number>;
  };
  languages: {
    all: Array<{
      name: string;
      color: string;
      percentage: string;
      repoCount: number;
    }>;
    top: { name: string; color: string; percentage: string } | null;
    count: number;
    isPolyglot: boolean;
    isSpecialist: boolean;
    topLanguagePercentage: number;
  };
  impact: {
    totalStars: number;
    totalForks: number;
    repositoryCount: number;
    mostStarredRepo?: {
      name: string;
      stars: number;
      description?: string;
    };
  };
  personality: {
    archetype: string;
    title: string;
    emoji: string;
    tagline: string;
    description: string;
    traits: Array<{
      name: string;
      description: string;
      score: number;
      icon: string;
    }>;
    badges: string[];
  };
}

export const CURRENT_YEAR = 2025;

export function generateDemoData(): DeveloperData {
  return {
    type: "developer",
    year: CURRENT_YEAR,
    user: {
      login: "octocat",
      name: "The Octocat",
      avatarUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      bio: "Building the future, one commit at a time",
      followers: 12500,
      following: 42,
    },
    contributions: {
      total: 2847,
      commits: 1823,
      pullRequests: 234,
      issues: 89,
      reviews: 156,
    },
    activity: {
      longestStreak: 47,
      currentStreak: 12,
      busiestDay: "Tuesday",
      busiestDayCount: 623,
      busiestHour: 14,
      peakMonth: "2025-03",
      peakMonthCount: 412,
      totalActiveDays: 147,
      totalDays: 165,
      averagePerDay: "19.4",
      weekdayDistribution: { 0: 312, 1: 489, 2: 623, 3: 567, 4: 478, 5: 312, 6: 66 },
    },
    languages: {
      all: [
        { name: "TypeScript", color: "#3178c6", percentage: "42.1", repoCount: 12 },
        { name: "Python", color: "#3572a5", percentage: "28.1", repoCount: 8 },
        { name: "Go", color: "#00add8", percentage: "16.0", repoCount: 5 },
        { name: "Rust", color: "#dea584", percentage: "8.1", repoCount: 3 },
        { name: "JavaScript", color: "#f1e05a", percentage: "5.7", repoCount: 4 },
      ],
      top: { name: "TypeScript", color: "#3178c6", percentage: "42.1" },
      count: 5,
      isPolyglot: true,
      isSpecialist: false,
      topLanguagePercentage: 42.1,
    },
    impact: {
      totalStars: 8934,
      totalForks: 1247,
      repositoryCount: 32,
      mostStarredRepo: {
        name: "awesome-project",
        stars: 4521,
        description: "An awesome open source project",
      },
    },
    personality: {
      archetype: "polyglot",
      title: "The Polyglot",
      emoji: "🌍",
      tagline: "Master of many, limited by none",
      description: "5 languages in your arsenal. You don't see technologies as barriers—you see them as tools.",
      traits: [
        { name: "Polyglot", description: "5+ languages", score: 92, icon: "🌍" },
        { name: "Streak Master", description: "47 day streak", score: 85, icon: "🔥" },
        { name: "Maintainer", description: "8934 stars", score: 90, icon: "⭐" },
      ],
      badges: ["🌟 Legendary Streak", "👑 Commit King", "🌐 Open Source Hero", "✨ Star Collector"],
    },
  };
}
