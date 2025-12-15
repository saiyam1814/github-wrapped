import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const CURRENT_YEAR = 2025;

// Simplified query to avoid resource limits
const DEVELOPER_QUERY = `
query DeveloperWrapped($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    createdAt
    followers { totalCount }
    following { totalCount }
    
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      
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
      
      commitContributionsByRepository(maxRepositories: 30) {
        repository {
          name
          nameWithOwner
          primaryLanguage { name color }
          stargazerCount
          owner { login }
        }
        contributions { totalCount }
      }
    }
    
    repositories(first: 30, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount
      nodes {
        name
        nameWithOwner
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
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
    const errorMsg = data.errors[0]?.message || "GraphQL query failed";
    // Check for specific error types
    if (errorMsg.includes("Resource") || errorMsg.includes("limit") || errorMsg.includes("timeout")) {
      throw new Error("GitHub API resource limits exceeded. The user may have too many contributions. Please try again later.");
    }
    throw new Error(errorMsg);
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
  
  allDays.forEach((day) => {
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

  // Process languages from repositories
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
  const totalStars = user.repositories.nodes.reduce((sum: number, r: any) => sum + (r.stargazerCount || 0), 0);
  const totalForks = user.repositories.nodes.reduce((sum: number, r: any) => sum + (r.forkCount || 0), 0);
  const topRepo = user.repositories.nodes[0];

  // Calculate activity stats
  const activeDays = allDays.filter(d => d.contributionCount > 0).length;
  
  // Find most contributed repository
  const repoContribMap = new Map<string, { name: string; nameWithOwner: string; commits: number; total: number; isOwn: boolean; stars: number }>();
  
  contrib.commitContributionsByRepository.forEach((item: any) => {
    const key = item.repository.nameWithOwner;
    repoContribMap.set(key, { 
      name: item.repository.name, 
      nameWithOwner: key, 
      commits: item.contributions.totalCount,
      total: item.contributions.totalCount,
      isOwn: item.repository.owner.login === user.login,
      stars: item.repository.stargazerCount || 0
    });
  });
  
  const sortedRepos = Array.from(repoContribMap.values()).sort((a, b) => b.total - a.total);
  const mostContributedRepo = sortedRepos[0];
  const reposContributedTo = contrib.totalRepositoriesWithContributedCommits || sortedRepos.length;
  
  // Count OSS contributions (repos not owned by user)
  const ossContributions = sortedRepos.filter(r => !r.isOwn);
  const ossRepoCount = ossContributions.length;

  // Determine personality
  const personality = classifyPersonality({
    streak: longestStreak,
    commits: contrib.totalCommitContributions,
    prs: contrib.totalPullRequestContributions,
    reviews: contrib.totalPullRequestReviewContributions,
    issues: contrib.totalIssueContributions,
    isPolyglot,
    isSpecialist,
    topLang: topLang?.name,
    stars: totalStars,
    reposContributed: reposContributedTo,
    ossRepoCount,
    activeDays,
    totalContribs: calendar.totalContributions,
  });

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
      reposContributedTo,
    },
    activity: {
      longestStreak,
      currentStreak,
      busiestDay: dayNames[busiestDayIdx],
      busiestDayCount,
      busiestHour: 14, // Default assumption
      peakMonth,
      peakMonthCount,
      totalActiveDays: activeDays,
      totalDays: allDays.length,
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
      mostContributedRepo: mostContributedRepo ? {
        name: mostContributedRepo.name,
        nameWithOwner: mostContributedRepo.nameWithOwner,
        commits: mostContributedRepo.commits,
        prs: 0,
        issues: 0,
        total: mostContributedRepo.total,
        isOwn: mostContributedRepo.isOwn,
      } : undefined,
      ossContributions: {
        repoCount: ossRepoCount,
        totalContributions: ossContributions.reduce((sum, r) => sum + r.total, 0),
        prsToPopularRepos: 0,
      },
    },
    personality,
  };
}

interface PersonalityInput {
  streak: number;
  commits: number;
  prs: number;
  reviews: number;
  issues: number;
  isPolyglot: boolean;
  isSpecialist: boolean;
  topLang: string | undefined;
  stars: number;
  reposContributed: number;
  ossRepoCount: number;
  activeDays: number;
  totalContribs: number;
}

function classifyPersonality(input: PersonalityInput) {
  const { streak, commits, prs, reviews, issues, isPolyglot, isSpecialist, topLang, stars, reposContributed, ossRepoCount, activeDays } = input;
  
  const traits: any[] = [];
  let archetype = "craftsman";
  
  // Scoring system for different archetypes
  const archetypeScores: Record<string, number> = {
    "streak-demon": 0,
    "code-ninja": 0,
    "open-source-warrior": 0,
    "polyglot-wizard": 0,
    "laser-focused": 0,
    "review-sensei": 0,
    "issue-hunter": 0,
    "prolific-machine": 0,
    "rising-star": 0,
    "repo-hopper": 0,
    "silent-guardian": 0,
    "legendary-shipper": 0,
  };
  
  // Streak analysis
  if (streak >= 100) {
    archetypeScores["streak-demon"] += 100;
    traits.push({ name: "Unstoppable", description: `${streak} day streak`, score: 98, icon: "🔥" });
  } else if (streak >= 50) {
    archetypeScores["streak-demon"] += 70;
    traits.push({ name: "Streak Demon", description: `${streak} day streak`, score: 90, icon: "🔥" });
  } else if (streak >= 30) {
    archetypeScores["streak-demon"] += 40;
    traits.push({ name: "Consistent", description: `${streak} day streak`, score: 80, icon: "📅" });
  }
  
  // Polyglot vs Specialist
  if (isPolyglot) {
    archetypeScores["polyglot-wizard"] += 80;
    traits.push({ name: "Language Wizard", description: "4+ languages", score: 88, icon: "🧙" });
  }
  
  if (isSpecialist) {
    archetypeScores["laser-focused"] += 85;
    traits.push({ name: "Laser Focused", description: `${topLang} master`, score: 85, icon: "🎯" });
  }
  
  // Volume analysis
  if (commits >= 2000) {
    archetypeScores["legendary-shipper"] += 100;
    traits.push({ name: "Legendary Shipper", description: `${commits.toLocaleString()} commits`, score: 99, icon: "🚀" });
  } else if (commits >= 1000) {
    archetypeScores["prolific-machine"] += 80;
    traits.push({ name: "Prolific Machine", description: `${commits.toLocaleString()} commits`, score: 92, icon: "⚡" });
  } else if (commits >= 500) {
    archetypeScores["code-ninja"] += 60;
    traits.push({ name: "Code Ninja", description: `${commits} commits`, score: 85, icon: "🥷" });
  }
  
  // Code reviews
  if (reviews >= 200) {
    archetypeScores["review-sensei"] += 90;
    traits.push({ name: "Review Sensei", description: `${reviews} reviews`, score: 95, icon: "👁️" });
  } else if (reviews >= 50) {
    archetypeScores["silent-guardian"] += 60;
    traits.push({ name: "Code Guardian", description: `${reviews} reviews`, score: 82, icon: "🛡️" });
  }
  
  // Issues
  if (issues >= 100) {
    archetypeScores["issue-hunter"] += 70;
    traits.push({ name: "Issue Hunter", description: `${issues} issues`, score: 80, icon: "🎯" });
  }
  
  // OSS contributions
  if (ossRepoCount >= 20) {
    archetypeScores["open-source-warrior"] += 90;
    traits.push({ name: "OSS Warrior", description: `${ossRepoCount} repos`, score: 92, icon: "⚔️" });
  } else if (ossRepoCount >= 5) {
    archetypeScores["open-source-warrior"] += 50;
    traits.push({ name: "OSS Contributor", description: `${ossRepoCount} repos`, score: 75, icon: "🌐" });
  }
  
  // Stars
  if (stars >= 10000) {
    archetypeScores["rising-star"] += 100;
    traits.push({ name: "Superstar", description: `${(stars/1000).toFixed(1)}k stars`, score: 99, icon: "🌟" });
  } else if (stars >= 1000) {
    archetypeScores["rising-star"] += 70;
    traits.push({ name: "Rising Star", description: `${stars.toLocaleString()} stars`, score: 88, icon: "⭐" });
  } else if (stars >= 100) {
    traits.push({ name: "Star Collector", description: `${stars} stars`, score: 70, icon: "✨" });
  }
  
  // Repo diversity
  if (reposContributed >= 30) {
    archetypeScores["repo-hopper"] += 70;
    traits.push({ name: "Repo Hopper", description: `${reposContributed} repos`, score: 78, icon: "🦘" });
  }
  
  // Find winning archetype
  let maxScore = 0;
  Object.entries(archetypeScores).forEach(([arch, score]) => {
    if (score > maxScore) {
      maxScore = score;
      archetype = arch;
    }
  });
  
  // Default if no strong signal
  if (maxScore < 40) {
    archetype = "craftsman";
    if (traits.length === 0) {
      traits.push({ name: "Craftsman", description: "Building with care", score: 70, icon: "🔨" });
    }
  }

  const archetypeDetails: Record<string, any> = {
    "streak-demon": { 
      title: "The Streak Demon", 
      emoji: "👹", 
      tagline: "Consistency is your middle name", 
      description: `${streak} days of unbroken contributions. You don't just code—you're possessed by it.` 
    },
    "polyglot-wizard": { 
      title: "The Polyglot Wizard", 
      emoji: "🧙‍♂️", 
      tagline: "Master of the coding multiverse", 
      description: "You speak fluent code in multiple languages. Barriers? You don't see any." 
    },
    "laser-focused": { 
      title: "The Laser Focused", 
      emoji: "🎯", 
      tagline: `${topLang} runs through your veins`, 
      description: `While others dabble, you've achieved mastery. ${topLang} is your weapon of choice.` 
    },
    "prolific-machine": { 
      title: "The Prolific Machine", 
      emoji: "🤖", 
      tagline: "Output levels: Legendary", 
      description: `${commits.toLocaleString()} commits. You're not just productive—you're a force of nature.` 
    },
    "legendary-shipper": { 
      title: "The Legendary Shipper", 
      emoji: "🚀", 
      tagline: "Ship it. Ship it again. Never stop.", 
      description: `${commits.toLocaleString()} commits this year alone. While others plan, you execute.` 
    },
    "code-ninja": { 
      title: "The Code Ninja", 
      emoji: "🥷", 
      tagline: "Silent but deadly productive", 
      description: "You move through codebases like a shadow—swift, precise, and effective." 
    },
    "review-sensei": { 
      title: "The Review Sensei", 
      emoji: "🧘", 
      tagline: "Guardian of code quality", 
      description: `${reviews} code reviews. You don't just write code—you elevate everyone's code.` 
    },
    "open-source-warrior": { 
      title: "The Open Source Warrior", 
      emoji: "⚔️", 
      tagline: "Fighting for the community", 
      description: `You've contributed to ${ossRepoCount} open source repos. The community thanks you.` 
    },
    "issue-hunter": { 
      title: "The Issue Hunter", 
      emoji: "🏹", 
      tagline: "No bug escapes your sight", 
      description: `${issues} issues filed. You spot problems others miss and make software better.` 
    },
    "rising-star": { 
      title: "The Rising Star", 
      emoji: "🌟", 
      tagline: "The world is watching", 
      description: `${stars.toLocaleString()} stars. Your code inspires developers worldwide.` 
    },
    "repo-hopper": { 
      title: "The Repo Hopper", 
      emoji: "🦘", 
      tagline: "Everywhere at once", 
      description: `${reposContributed} repositories touched. You spread impact far and wide.` 
    },
    "silent-guardian": { 
      title: "The Silent Guardian", 
      emoji: "🦇", 
      tagline: "The hero code deserves", 
      description: "You watch over the codebase, catching bugs and improving quality from the shadows." 
    },
    "craftsman": { 
      title: "The Craftsman", 
      emoji: "🔨", 
      tagline: "Every line, a work of art", 
      description: "You take pride in your work, building software with intention and care." 
    },
  };

  const details = archetypeDetails[archetype] || archetypeDetails["craftsman"];

  return {
    archetype,
    ...details,
    traits: traits.slice(0, 4),
    badges: generateBadges(input),
  };
}

function generateBadges(input: PersonalityInput) {
  const { streak, commits, prs, reviews, stars, ossRepoCount, reposContributed, activeDays } = input;
  const badges: string[] = [];
  
  if (streak >= 100) badges.push("👹 Streak Demon");
  else if (streak >= 50) badges.push("🔥 Streak Master");
  else if (streak >= 30) badges.push("⚡ Month Warrior");
  else if (streak >= 7) badges.push("📅 Week Starter");
  
  if (commits >= 2000) badges.push("🚀 Legendary Shipper");
  else if (commits >= 1000) badges.push("💎 Diamond Committer");
  else if (commits >= 500) badges.push("🏅 Commit Champion");
  else if (commits >= 100) badges.push("💪 Centurion");
  
  if (stars >= 10000) badges.push("🌟 Superstar");
  else if (stars >= 1000) badges.push("⭐ Star Collector");
  else if (stars >= 100) badges.push("✨ Rising Star");
  
  if (reviews >= 100) badges.push("🧘 Review Sensei");
  else if (reviews >= 50) badges.push("👁️ Eagle Eye");
  
  if (ossRepoCount >= 10) badges.push("⚔️ OSS Warrior");
  else if (ossRepoCount >= 5) badges.push("🌐 OSS Champion");
  
  if (prs >= 100) badges.push("🎯 PR Master");
  
  if (activeDays >= 300) badges.push("📆 All-Year Coder");
  
  if (reposContributed >= 30) badges.push("🦘 Repo Explorer");
  
  return badges.slice(0, 6);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

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
