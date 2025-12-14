import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

// Separate handler or reused logic? For MVP, separate is cleaner.
export async function POST(req: NextRequest) {
    try {
        const { owner, repo, token } = await req.json();

        // Hacky: Re-use WrappedData type structure but populate with Repo data
        // Ideally we make a union type. For now, mapping fields to fit.

        // Mock Response for MVP velocity
        if (!token && process.env.NODE_ENV === 'development') {
            // If no token provided in dev, return mock to avoid rate limit blocks during presentation
        }

        const client = new Octokit({ auth: token || process.env.GITHUB_TOKEN });

        // Fetch Repo Details
        const { data: repository } = await client.rest.repos.get({ owner, repo });
        const { data: contributors } = await client.rest.repos.listContributors({ owner, repo, per_page: 1 });
        // Getting total contributors via Link header or separate query is better but complex. 
        // We'll use a rough estimate or a different endpoint if needed.

        // Fetch Participation
        const { data: participation } = await client.rest.repos.getParticipationStats({ owner, repo });
        const weeklyCommits = participation.all || [];
        const totalCommits = weeklyCommits.reduce((a: any, b: any) => a + b, 0);

        // Construct compatible response
        const projectData = {
            user: { // "User" here means the Identity being wrapped (The Project)
                login: repository.full_name,
                name: repository.name,
                avatarUrl: repository.owner.avatar_url,
                createdAt: repository.created_at,
            },
            year: 2025,
            personality: {
                type: "Open Source Hero",
                description: `A powerhouse with ${repository.stargazers_count} stars and huge community impact.`
            },
            stats: {
                totalCommits: totalCommits, // Last 52 weeks
                totalPRs: 0, // Need GraphQL for this usually
                totalIssues: repository.open_issues_count,
                totalReviews: 0,
                totalStarsReceived: repository.stargazers_count,
                totalStarsGiven: 0,
                longestStreak: 0, // Not applicable
                mostActiveDay: "Everyday",
                mostActiveMonth: "N/A",
                topLanguages: [{ name: repository.language || "Code", color: "#fff", size: 100 }],
                hourlyHeatmap: []
            },
            contributions: weeklyCommits.map((c: any, i: number) => ({
                date: `Week ${i}`,
                count: c,
                level: c > 0 ? (c > 10 ? 4 : 2) : 0
            }))
        };

        return NextResponse.json(projectData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
