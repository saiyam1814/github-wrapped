import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const CURRENT_YEAR = 2025;

// GraphQL query with commit contributions by repository
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
      totalRepositoriesWithContributedCommits
      
      commitContributionsByRepository(maxRepositories: 30) {
        repository {
          name
          nameWithOwner
          owner { login }
          isPrivate
          primaryLanguage { name color }
        }
        contributions {
          totalCount
        }
      }
      
      pullRequestContributionsByRepository(maxRepositories: 10) {
        repository {
          name
          nameWithOwner
        }
        contributions {
          totalCount
        }
      }
      
      issueContributionsByRepository(maxRepositories: 10) {
        repository {
          name
          nameWithOwner
        }
        contributions {
          totalCount
        }
      }
      
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
    }
    
    repositories(first: 20, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount
      nodes {
        name
        nameWithOwner
        description
        stargazerCount
        forkCount
        primaryLanguage { name color }
      }
    }
  }
}
`;

// Separate query just for languages (lighter)
const LANGUAGES_QUERY = `
query UserLanguages($login: String!) {
  user(login: $login) {
    repositories(first: 20, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
      nodes {
        languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node { name color }
          }
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
    if (errorMsg.includes("Resource") || errorMsg.includes("limit") || errorMsg.includes("timeout")) {
      throw new Error("GitHub API resource limits exceeded. Please try again in a few minutes.");
    }
    throw new Error(errorMsg);
  }
  
  return data.data;
}

function processUserData(user: any, languageData: any, year: number) {
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

  // Current streak: count backwards from most recent day with data
  // Sort days by date to ensure chronological order
  const sortedDays = [...allDays].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().split('T')[0];
  
  // Find the last day with actual data (today or before)
  let startIdx = sortedDays.length - 1;
  while (startIdx >= 0 && sortedDays[startIdx].date > today) {
    startIdx--;
  }
  
  // Count streak backwards, allowing for 1 gap day (API sync delay)
  let gapsAllowed = 1;
  for (let i = startIdx; i >= 0; i--) {
    if (sortedDays[i].contributionCount > 0) {
      currentStreak++;
      gapsAllowed = 1; // Reset gap allowance after finding a contribution
    } else {
      if (gapsAllowed > 0) {
        gapsAllowed--;
        continue; // Allow one gap (today might not be synced)
      }
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

  // Process languages from 2025 CONTRIBUTED repos (not owned repos)
  // This shows what languages you ACTUALLY WORKED WITH this year
  const langMap = new Map<string, { commits: number; color: string; repoCount: number }>();
  
  const commitContribs2025 = contrib.commitContributionsByRepository || [];
  commitContribs2025.forEach((item: any) => {
    const repo = item.repository;
    // Skip private repos
    if (repo.isPrivate) return;
    
    const primaryLang = repo.primaryLanguage;
    if (primaryLang) {
      const lang = primaryLang.name;
      const commits = item.contributions.totalCount;
      const existing = langMap.get(lang) || { commits: 0, color: primaryLang.color || "#6366f1", repoCount: 0 };
      existing.commits += commits;
      existing.repoCount++;
      langMap.set(lang, existing);
    }
  });

  const totalCommitsForLang = Array.from(langMap.values()).reduce((sum, l) => sum + l.commits, 0);
  const languages = Array.from(langMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.commits, // Using commits as weight
      percentage: totalCommitsForLang > 0 ? ((data.commits / totalCommitsForLang) * 100).toFixed(1) : "0",
      repoCount: data.repoCount,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 8);

  const topLang = languages[0] || null;
  const isPolyglot = languages.filter(l => parseFloat(l.percentage) > 10).length >= 4;
  const isSpecialist = topLang && parseFloat(topLang.percentage) > 70;

  // Calculate impact
  const repos = user.repositories.nodes || [];
  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazerCount || 0), 0);
  const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forkCount || 0), 0);
  const topRepo = repos[0];

  const activeDays = allDays.filter(d => d.contributionCount > 0).length;
  const reposContributedTo = contrib.totalRepositoriesWithContributedCommits || 0;

  // Find ACTUAL most contributed repository by combining commits, PRs, and issues
  const repoContribMap = new Map<string, {
    name: string;
    nameWithOwner: string;
    commits: number;
    prs: number;
    issues: number;
    isOwn: boolean;
  }>();

  // Add commit contributions
  const commitContribs = contrib.commitContributionsByRepository || [];
  commitContribs.forEach((item: any) => {
    const key = item.repository.nameWithOwner;
    const isOwn = item.repository.owner?.login === user.login;
    const existing = repoContribMap.get(key) || {
      name: item.repository.name,
      nameWithOwner: key,
      commits: 0,
      prs: 0,
      issues: 0,
      isOwn,
    };
    existing.commits += item.contributions.totalCount;
    repoContribMap.set(key, existing);
  });

  // Add PR contributions
  const prContribs = contrib.pullRequestContributionsByRepository || [];
  prContribs.forEach((item: any) => {
    const key = item.repository.nameWithOwner;
    const existing = repoContribMap.get(key) || {
      name: item.repository.name,
      nameWithOwner: key,
      commits: 0,
      prs: 0,
      issues: 0,
      isOwn: false,
    };
    existing.prs += item.contributions.totalCount;
    repoContribMap.set(key, existing);
  });

  // Add issue contributions
  const issueContribs = contrib.issueContributionsByRepository || [];
  issueContribs.forEach((item: any) => {
    const key = item.repository.nameWithOwner;
    const existing = repoContribMap.get(key) || {
      name: item.repository.name,
      nameWithOwner: key,
      commits: 0,
      prs: 0,
      issues: 0,
      isOwn: false,
    };
    existing.issues += item.contributions.totalCount;
    repoContribMap.set(key, existing);
  });

  // Find the repo with most total contributions
  let mostContributedRepo = null;
  let maxContribs = 0;
  
  repoContribMap.forEach((repo) => {
    const total = repo.commits + repo.prs + repo.issues;
    if (total > maxContribs) {
      maxContribs = total;
      mostContributedRepo = {
        ...repo,
        total,
      };
    }
  });

  // Calculate OSS contributions (contributions to repos NOT owned by user)
  let ossRepoCount = 0;
  let ossTotalContribs = 0;
  repoContribMap.forEach((repo) => {
    if (!repo.isOwn) {
      ossRepoCount++;
      ossTotalContribs += repo.commits + repo.prs + repo.issues;
    }
  });

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
      busiestHour: 14,
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
      mostContributedRepo: mostContributedRepo || undefined,
      ossContributions: {
        repoCount: ossRepoCount,
        totalContributions: ossTotalContribs,
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
  activeDays: number;
  totalContribs: number;
}

function classifyPersonality(input: PersonalityInput) {
  const { streak, commits, prs, reviews, issues, isPolyglot, isSpecialist, topLang, stars, reposContributed, activeDays } = input;
  
  const traits: any[] = [];
  let archetype = "craftsman";
  
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
  
  if (isPolyglot) {
    archetypeScores["polyglot-wizard"] += 80;
    traits.push({ name: "Language Wizard", description: "4+ languages", score: 88, icon: "🧙" });
  }
  
  if (isSpecialist) {
    archetypeScores["laser-focused"] += 85;
    traits.push({ name: "Laser Focused", description: `${topLang} master`, score: 85, icon: "🎯" });
  }
  
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
  
  if (reviews >= 200) {
    archetypeScores["review-sensei"] += 90;
    traits.push({ name: "Review Sensei", description: `${reviews} reviews`, score: 95, icon: "👁️" });
  } else if (reviews >= 50) {
    archetypeScores["silent-guardian"] += 60;
    traits.push({ name: "Code Guardian", description: `${reviews} reviews`, score: 82, icon: "🛡️" });
  }
  
  if (issues >= 100) {
    archetypeScores["issue-hunter"] += 70;
    traits.push({ name: "Issue Hunter", description: `${issues} issues`, score: 80, icon: "🎯" });
  }
  
  if (stars >= 10000) {
    archetypeScores["rising-star"] += 100;
    traits.push({ name: "Superstar", description: `${(stars/1000).toFixed(1)}k stars`, score: 99, icon: "🌟" });
  } else if (stars >= 1000) {
    archetypeScores["rising-star"] += 70;
    traits.push({ name: "Rising Star", description: `${stars.toLocaleString()} stars`, score: 88, icon: "⭐" });
  } else if (stars >= 100) {
    traits.push({ name: "Star Collector", description: `${stars} stars`, score: 70, icon: "✨" });
  }
  
  if (reposContributed >= 30) {
    archetypeScores["repo-hopper"] += 70;
    traits.push({ name: "Repo Hopper", description: `${reposContributed} repos`, score: 78, icon: "🦘" });
  }
  
  if (prs >= 100) {
    archetypeScores["open-source-warrior"] += 70;
    traits.push({ name: "PR Machine", description: `${prs} PRs`, score: 85, icon: "🔄" });
  }
  
  let maxScore = 0;
  Object.entries(archetypeScores).forEach(([arch, score]) => {
    if (score > maxScore) {
      maxScore = score;
      archetype = arch;
    }
  });
  
  if (maxScore < 40) {
    archetype = "craftsman";
    if (traits.length === 0) {
      traits.push({ name: "Craftsman", description: "Building with care", score: 70, icon: "🔨" });
    }
  }

  const archetypeDetails: Record<string, any> = {
    "streak-demon": { title: "The Streak Demon", emoji: "👹", tagline: "Consistency is your middle name", description: `${streak} days of unbroken contributions.` },
    "polyglot-wizard": { title: "The Polyglot Wizard", emoji: "🧙‍♂️", tagline: "Master of the coding multiverse", description: "You speak fluent code in multiple languages." },
    "laser-focused": { title: "The Laser Focused", emoji: "🎯", tagline: `${topLang} runs through your veins`, description: `${topLang} is your weapon of choice.` },
    "prolific-machine": { title: "The Prolific Machine", emoji: "🤖", tagline: "Output levels: Legendary", description: `${commits.toLocaleString()} commits. You're a force of nature.` },
    "legendary-shipper": { title: "The Legendary Shipper", emoji: "🚀", tagline: "Ship it. Ship it again. Never stop.", description: `${commits.toLocaleString()} commits this year alone.` },
    "code-ninja": { title: "The Code Ninja", emoji: "🥷", tagline: "Silent but deadly productive", description: "Swift, precise, and effective." },
    "review-sensei": { title: "The Review Sensei", emoji: "🧘", tagline: "Guardian of code quality", description: `${reviews} code reviews. You elevate everyone's code.` },
    "open-source-warrior": { title: "The Open Source Warrior", emoji: "⚔️", tagline: "Fighting for the community", description: "Your PRs make a difference." },
    "issue-hunter": { title: "The Issue Hunter", emoji: "🏹", tagline: "No bug escapes your sight", description: `${issues} issues filed.` },
    "rising-star": { title: "The Rising Star", emoji: "🌟", tagline: "The world is watching", description: `${stars.toLocaleString()} stars. Your code inspires.` },
    "repo-hopper": { title: "The Repo Hopper", emoji: "🦘", tagline: "Everywhere at once", description: `${reposContributed} repositories touched.` },
    "silent-guardian": { title: "The Silent Guardian", emoji: "🦇", tagline: "The hero code deserves", description: "Watching over the codebase." },
    "craftsman": { title: "The Craftsman", emoji: "🔨", tagline: "Every line, a work of art", description: "Building software with intention and care." },
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
  const { streak, commits, prs, reviews, stars, reposContributed, activeDays } = input;
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

    // Main query
    const data = await graphql(DEVELOPER_QUERY, { login: username, from, to }, token);
    
    if (!data.user) {
      return NextResponse.json({ error: `User "${username}" not found` }, { status: 404 });
    }

    // Separate languages query (lighter)
    let languageData = null;
    try {
      languageData = await graphql(LANGUAGES_QUERY, { login: username }, token);
    } catch {
      // Continue without language data if it fails
    }

    const wrappedData = processUserData(data.user, languageData, year);
    
    return NextResponse.json(wrappedData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch data" 
    }, { status: 500 });
  }
}
