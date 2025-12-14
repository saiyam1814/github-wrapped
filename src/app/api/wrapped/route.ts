import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const CURRENT_YEAR = 2025;

const DEVELOPER_QUERY = `
query DeveloperWrapped($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    followers { totalCount }
    following { totalCount }
    
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
      
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          primaryLanguage { name color }
          stargazerCount
        }
        contributions { totalCount }
      }
    }
    
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount
      nodes {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node { name color }
          }
          totalSize
        }
      }
    }
  }
}
`;

async function graphql(query: string, variables: Record<string, any>, token: string) {
  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || "GraphQL query failed");
  }
  
  return data.data;
}

function processUserData(user: any, year: number) {
  const contrib = user.contributionsCollection;
  const calendar = contrib.contributionCalendar;
  
  // Process calendar for streaks and activity
  const allDays: any[] = [];
  const weekdayDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const monthlyDist: Record<string, number> = {};
  
  calendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      allDays.push(day);
      weekdayDist[day.weekday] += day.contributionCount;
      const month = day.date.substring(0, 7);
      monthlyDist[month] = (monthlyDist[month] || 0) + day.contributionCount;
    });
  });

  // Calculate streaks
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  
  allDays.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  // Check current streak (from end of array)
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i].contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Find busiest day
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let busiestDayIdx = 0;
  let busiestDayCount = 0;
  Object.entries(weekdayDist).forEach(([day, count]) => {
    if (count > busiestDayCount) {
      busiestDayCount = count;
      busiestDayIdx = parseInt(day);
    }
  });

  // Find peak month
  let peakMonth = "";
  let peakMonthCount = 0;
  Object.entries(monthlyDist).forEach(([month, count]) => {
    if (count > peakMonthCount) {
      peakMonthCount = count;
      peakMonth = month;
    }
  });

  // Process languages
  const langMap = new Map<string, { size: number; color: string; repoCount: number }>();
  user.repositories.nodes.forEach((repo: any) => {
    repo.languages?.edges?.forEach((edge: any) => {
      const lang = edge.node.name;
      const existing = langMap.get(lang) || { size: 0, color: edge.node.color || "#6366f1", repoCount: 0 };
      existing.size += edge.size;
      existing.repoCount++;
      langMap.set(lang, existing);
    });
  });

  const totalSize = Array.from(langMap.values()).reduce((sum, l) => sum + l.size, 0);
  const languages = Array.from(langMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.size,
      percentage: totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : "0",
      repoCount: data.repoCount,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 8);

  const topLang = languages[0] || null;
  const isPolyglot = languages.filter(l => parseFloat(l.percentage) > 10).length >= 4;
  const isSpecialist = topLang && parseFloat(topLang.percentage) > 70;

  // Calculate impact
  const totalStars = user.repositories.nodes.reduce((sum: number, r: any) => sum + r.stargazerCount, 0);
  const totalForks = user.repositories.nodes.reduce((sum: number, r: any) => sum + r.forkCount, 0);
  const topRepo = user.repositories.nodes[0];

  // Calculate activity stats
  const activeDays = allDays.filter(d => d.contributionCount > 0).length;
  const totalDays = allDays.length;

  // Determine personality
  const personality = classifyPersonality(
    longestStreak,
    contrib.totalCommitContributions,
    contrib.totalPullRequestReviewContributions,
    isPolyglot,
    isSpecialist,
    topLang?.name,
    totalStars
  );

  return {
    type: "developer",
    year,
    user: {
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
    },
    contributions: {
      total: calendar.totalContributions,
      commits: contrib.totalCommitContributions,
      pullRequests: contrib.totalPullRequestContributions,
      issues: contrib.totalIssueContributions,
      reviews: contrib.totalPullRequestReviewContributions,
    },
    activity: {
      longestStreak,
      currentStreak,
      busiestDay: dayNames[busiestDayIdx],
      busiestDayCount,
      busiestHour: 14,
      peakMonth,
      peakMonthCount,
      totalActiveDays: activeDays,
      totalDays,
      averagePerDay: activeDays > 0 ? (calendar.totalContributions / activeDays).toFixed(1) : "0",
      weekdayDistribution: weekdayDist,
    },
    languages: {
      all: languages,
      top: topLang ? { name: topLang.name, color: topLang.color, percentage: topLang.percentage } : null,
      count: languages.length,
      isPolyglot,
      isSpecialist: !!isSpecialist,
      topLanguagePercentage: topLang ? parseFloat(topLang.percentage) : 0,
    },
    impact: {
      totalStars,
      totalForks,
      repositoryCount: user.repositories.totalCount,
      mostStarredRepo: topRepo ? {
        name: topRepo.name,
        stars: topRepo.stargazerCount,
        description: topRepo.description,
      } : undefined,
    },
    personality,
  };
}

function classifyPersonality(
  streak: number,
  commits: number,
  reviews: number,
  isPolyglot: boolean,
  isSpecialist: boolean,
  topLang: string | undefined,
  stars: number
) {
  const traits: any[] = [];
  let archetype = "builder";
  
  if (streak >= 30) {
    archetype = "marathon-runner";
    traits.push({ name: "Streak Master", description: `${streak} day streak`, score: 90, icon: "🔥" });
  }
  
  if (isPolyglot) {
    archetype = "polyglot";
    traits.push({ name: "Polyglot", description: "Multiple languages", score: 88, icon: "🌍" });
  }
  
  if (isSpecialist) {
    archetype = "specialist";
    traits.push({ name: "Specialist", description: `${topLang} expert`, score: 85, icon: "🎯" });
  }
  
  if (commits >= 1000) {
    archetype = "prolific-shipper";
    traits.push({ name: "Prolific Shipper", description: `${commits}+ commits`, score: 95, icon: "🚀" });
  }
  
  if (reviews >= 50) {
    archetype = "code-reviewer";
    traits.push({ name: "Guardian", description: "Code reviewer", score: 87, icon: "🛡️" });
  }
  
  if (stars >= 100) {
    archetype = "maintainer";
    traits.push({ name: "Maintainer", description: `${stars} stars`, score: 90, icon: "⭐" });
  }

  if (traits.length === 0) {
    traits.push({ name: "Builder", description: "Building great things", score: 75, icon: "🔨" });
  }

  const archetypeDetails: Record<string, any> = {
    "marathon-runner": { title: "The Marathon Runner", emoji: "🏃", tagline: "Consistency is your superpower", description: `${streak} days of continuous contributions. That's not discipline—that's dedication.` },
    "polyglot": { title: "The Polyglot", emoji: "🌍", tagline: "Master of many, limited by none", description: "Multiple languages in your arsenal. You see technologies as tools, not limitations." },
    "specialist": { title: "The Specialist", emoji: "🎯", tagline: "Depth over breadth", description: `Expert in ${topLang}. You've chosen your weapon and mastered it.` },
    "prolific-shipper": { title: "The Prolific Shipper", emoji: "🚀", tagline: "Move fast, ship faster", description: `${commits} commits. While others plan, you execute.` },
    "code-reviewer": { title: "The Guardian", emoji: "🛡️", tagline: "Quality is non-negotiable", description: `${reviews} code reviews. Your feedback makes everyone better.` },
    "maintainer": { title: "The Maintainer", emoji: "⭐", tagline: "Trusted by thousands", description: `${stars} stars. Developers around the world rely on your code.` },
    "builder": { title: "The Builder", emoji: "🔨", tagline: "Brick by brick", description: "Every commit is progress. Keep building." },
  };

  const details = archetypeDetails[archetype] || archetypeDetails["builder"];

  return {
    archetype,
    ...details,
    traits: traits.slice(0, 4),
    badges: generateBadges(streak, commits, reviews, stars),
  };
}

function generateBadges(streak: number, commits: number, reviews: number, stars: number) {
  const badges: string[] = [];
  if (streak >= 7) badges.push("🔥 Streak Starter");
  if (streak >= 30) badges.push("⚡ Streak Master");
  if (commits >= 100) badges.push("💻 Centurion");
  if (commits >= 500) badges.push("🎖️ Commit Commander");
  if (stars >= 10) badges.push("⭐ Rising Star");
  if (stars >= 100) badges.push("✨ Star Collector");
  if (reviews >= 20) badges.push("👀 Eagle Eye");
  return badges.slice(0, 6);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // Use server-side token from environment variable
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json({ 
      error: "Server configuration error: GitHub token not configured" 
    }, { status: 500 });
  }

  try {
    const year = CURRENT_YEAR;
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const data = await graphql(DEVELOPER_QUERY, { login: username, from, to }, token);
    
    if (!data.user) {
      return NextResponse.json({ error: `User "${username}" not found` }, { status: 404 });
    }

    const wrappedData = processUserData(data.user, year);
    
    return NextResponse.json(wrappedData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch data" 
    }, { status: 500 });
  }
}
