import { WrappedData, DeveloperPersona, LanguageStat } from "@/lib/types";
import { determinePersona } from "./personality";

export function processGitHubData(raw: any, year: number): WrappedData {
    const contributions = raw.contributionsCollection;
    const calendar = contributions.contributionCalendar;

    // 1. Calculate Streak
    let currentStreak = 0;
    let maxStreak = 0;
    let totalContributions = 0;

    const contributionDays: any[] = [];

    // Flatten weeks
    calendar.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
            contributionDays.push(day);
            totalContributions += day.contributionCount;
            if (day.contributionCount > 0) {
                currentStreak++;
            } else {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 0;
            }
        });
    });
    maxStreak = Math.max(maxStreak, currentStreak);

    // 2. Top Languages
    const langMap = new Map<string, { size: number; color: string }>();
    raw.repositories.nodes.forEach((repo: any) => {
        if (repo.languages && repo.languages.edges) {
            repo.languages.edges.forEach((edge: any) => {
                const { size, node } = edge;
                const current = langMap.get(node.name) || { size: 0, color: node.color };
                langMap.set(node.name, { size: current.size + size, color: node.color });
            });
        }
    });

    const topLanguages: LanguageStat[] = Array.from(langMap.entries())
        .map(([name, stat]) => ({ name, color: stat.color, size: stat.size }))
        .sort((a, b) => b.size - a.size)
        .slice(0, 5);

    // 3. Activity Patterns (Day of Week)
    // Simplified for MVP: Just counting total by weekday index
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    contributionDays.forEach(day => {
        if (day.contributionCount > 0) {
            // day.weekday is 0-6
            dayCounts[day.weekday] += day.contributionCount;
        }
    });
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const mostActiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));

    // 4. Stats Object
    const stats = {
        totalCommits: contributions.totalCommitContributions,
        totalPRs: contributions.totalPullRequestContributions,
        totalIssues: contributions.totalIssueContributions,
        totalReviews: contributions.totalPullRequestReviewContributions,
        totalStarsReceived: raw.repositories.nodes.reduce((acc: number, r: any) => acc + r.stargazers.totalCount, 0),
        totalStarsGiven: 0, // Not fetched in MVP query to save cost/complexity
        longestStreak: maxStreak,
        mostActiveDay: days[mostActiveDayIndex],
        mostActiveMonth: "N/A", // TODO: Implement if needed
        topLanguages,
        hourlyHeatmap: [], // TODO: Needs Commit History timestamp query (expensive)
    };

    // 5. Personality
    const personality = determinePersona(stats);

    return {
        user: {
            login: raw.login,
            name: raw.name || raw.login,
            avatarUrl: raw.avatarUrl,
            createdAt: raw.createdAt,
        },
        year,
        personality,
        stats,
        contributions: contributionDays.map(d => ({
            date: d.date,
            count: d.contributionCount,
            level: d.contributionCount === 0 ? 0 : d.contributionCount < 3 ? 1 : d.contributionCount < 6 ? 2 : d.contributionCount < 10 ? 3 : 4
        })),
    };
}
