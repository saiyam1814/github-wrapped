/**
 * Data Analysis Engine
 * Transforms raw GitHub data into meaningful insights and classifications
 */

import { LANGUAGE_COLORS, PERSONALITY_ARCHETYPES, PROJECT_ARCHETYPES } from '../types';

// ============================================================================
// DEVELOPER ANALYSIS
// ============================================================================

/**
 * Analyze developer data and generate comprehensive wrapped insights
 */
export function analyzeDeveloperData(rawData, year) {
  const user = rawData.user;
  const contrib = user.contributionsCollection;
  const calendar = contrib.contributionCalendar;
  
  // Process contribution calendar
  const activityAnalysis = analyzeActivity(calendar, contrib);
  
  // Process languages
  const languageAnalysis = analyzeLanguages(user.repositories.nodes, contrib.commitContributionsByRepository);
  
  // Process impact
  const impactAnalysis = analyzeImpact(user.repositories.nodes);
  
  // Process collaboration
  const collaborationAnalysis = analyzeCollaboration(user, contrib);
  
  // Determine personality
  const personality = classifyDeveloperPersonality(
    activityAnalysis,
    languageAnalysis,
    impactAnalysis,
    collaborationAnalysis,
    contrib
  );
  
  // Generate highlights
  const highlights = generateDeveloperHighlights(
    activityAnalysis,
    languageAnalysis,
    impactAnalysis,
    collaborationAnalysis,
    personality
  );
  
  return {
    type: 'developer',
    year,
    user: {
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      company: user.company,
      location: user.location,
      websiteUrl: user.websiteUrl,
      twitterUsername: user.twitterUsername,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      createdAt: user.createdAt,
      organizations: user.organizations?.nodes || [],
    },
    contributions: {
      total: calendar.totalContributions,
      commits: contrib.totalCommitContributions,
      pullRequests: contrib.totalPullRequestContributions,
      issues: contrib.totalIssueContributions,
      reviews: contrib.totalPullRequestReviewContributions,
      repositoriesContributedTo: contrib.totalRepositoryContributions,
      privateContributions: contrib.restrictedContributionsCount,
    },
    activity: activityAnalysis,
    languages: languageAnalysis,
    impact: impactAnalysis,
    collaboration: collaborationAnalysis,
    personality,
    highlights,
    topRepositories: getTopRepositories(user.repositories.nodes, contrib.commitContributionsByRepository),
  };
}

/**
 * Analyze contribution activity patterns
 */
function analyzeActivity(calendar, contrib) {
  const allDays = [];
  const weekdayDistribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const monthlyDistribution = {};
  const hourlyHeatmap = [];
  
  // Initialize hourly heatmap (24 hours x 7 days)
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      hourlyHeatmap.push({ day, hour, count: 0 });
    }
  }
  
  // Process calendar weeks
  calendar.weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      allDays.push(day);
      weekdayDistribution[day.weekday] += day.contributionCount;
      
      const month = day.date.substring(0, 7); // YYYY-MM
      monthlyDistribution[month] = (monthlyDistribution[month] || 0) + day.contributionCount;
    });
  });
  
  // Calculate streaks
  const streakData = calculateStreaks(allDays);
  
  // Find busiest day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let busiestDayIndex = 0;
  let busiestDayCount = 0;
  Object.entries(weekdayDistribution).forEach(([day, count]) => {
    if (count > busiestDayCount) {
      busiestDayCount = count;
      busiestDayIndex = parseInt(day);
    }
  });
  
  // Find peak month
  let peakMonth = '';
  let peakMonthCount = 0;
  Object.entries(monthlyDistribution).forEach(([month, count]) => {
    if (count > peakMonthCount) {
      peakMonthCount = count;
      peakMonth = month;
    }
  });
  
  // Calculate averages
  const activeDays = allDays.filter(d => d.contributionCount > 0).length;
  const totalDays = allDays.length;
  const totalContributions = calendar.totalContributions;
  
  // Find first and last contribution
  const contributionDays = allDays.filter(d => d.contributionCount > 0);
  const firstContribution = contributionDays[0]?.date || null;
  const lastContribution = contributionDays[contributionDays.length - 1]?.date || null;
  
  // Estimate busiest hour based on commit patterns
  // Note: Real hour data requires commit-level analysis
  const busiestHour = estimateBusiestHour(contrib.commitContributionsByRepository);
  
  // Weekend vs Weekday ratio
  const weekendContribs = weekdayDistribution[0] + weekdayDistribution[6];
  const weekdayContribs = totalContributions - weekendContribs;
  const weekendRatio = weekendContribs / (totalContributions || 1);
  
  return {
    calendar: allDays,
    hourlyHeatmap,
    longestStreak: streakData.longest,
    currentStreak: streakData.current,
    longestStreakStart: streakData.longestStart,
    longestStreakEnd: streakData.longestEnd,
    busiestDay: dayNames[busiestDayIndex],
    busiestDayCount,
    busiestHour,
    peakMonth,
    peakMonthCount,
    firstContribution,
    lastContribution,
    totalActiveDays: activeDays,
    totalDays,
    averagePerDay: activeDays > 0 ? (totalContributions / activeDays).toFixed(1) : 0,
    averagePerWeek: (totalContributions / 52).toFixed(1),
    weekdayDistribution,
    monthlyDistribution,
    weekendRatio,
  };
}

/**
 * Calculate contribution streaks
 */
function calculateStreaks(days) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let longestStart = null;
  let longestEnd = null;
  let tempStart = null;
  
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    
    if (day.contributionCount > 0) {
      if (tempStreak === 0) {
        tempStart = day.date;
      }
      tempStreak++;
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStart = tempStart;
        longestEnd = day.date;
      }
      
      // Check if this is current streak (recent days)
      if (day.date === today || isYesterday(day.date, today)) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
      tempStart = null;
    }
  }
  
  return {
    longest: longestStreak,
    current: currentStreak,
    longestStart,
    longestEnd,
  };
}

function isYesterday(dateStr, todayStr) {
  const date = new Date(dateStr);
  const today = new Date(todayStr);
  const diff = today - date;
  return diff >= 0 && diff <= 86400000 * 2; // Within 2 days
}

function estimateBusiestHour(commitsByRepo) {
  // Without actual commit timestamps, estimate based on typical patterns
  // Most developers are active in afternoon/evening
  return 15; // 3 PM as default estimate
}

/**
 * Analyze language usage
 */
function analyzeLanguages(repositories, commitsByRepo) {
  const languageMap = new Map();
  const languageByCommits = new Map();
  
  // Aggregate language data from repositories
  repositories.forEach(repo => {
    if (repo.languages?.edges) {
      repo.languages.edges.forEach(edge => {
        const lang = edge.node.name;
        const size = edge.size;
        const color = edge.node.color || LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default;
        
        if (languageMap.has(lang)) {
          const existing = languageMap.get(lang);
          existing.size += size;
          existing.repoCount++;
        } else {
          languageMap.set(lang, { name: lang, color, size, repoCount: 1 });
        }
      });
    }
  });
  
  // Count commits by language (using primary language of repos)
  commitsByRepo.forEach(item => {
    if (item.repository.primaryLanguage) {
      const lang = item.repository.primaryLanguage.name;
      const commits = item.contributions.totalCount;
      languageByCommits.set(lang, (languageByCommits.get(lang) || 0) + commits);
    }
  });
  
  // Convert to sorted array
  const totalSize = Array.from(languageMap.values()).reduce((sum, l) => sum + l.size, 0);
  
  const languages = Array.from(languageMap.values())
    .map(lang => ({
      ...lang,
      percentage: ((lang.size / totalSize) * 100).toFixed(1),
      commits: languageByCommits.get(lang.name) || 0,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  // Calculate specialization
  const topLanguagePercentage = languages.length > 0 ? parseFloat(languages[0].percentage) : 0;
  const isSpecialist = topLanguagePercentage > 70;
  const isPolyglot = languages.filter(l => parseFloat(l.percentage) > 10).length >= 4;
  
  return {
    all: languages,
    top: languages[0] || null,
    count: languages.length,
    isSpecialist,
    isPolyglot,
    topLanguagePercentage,
  };
}

/**
 * Analyze impact (stars, forks, etc.)
 */
function analyzeImpact(repositories) {
  const totalStars = repositories.reduce((sum, r) => sum + r.stargazerCount, 0);
  const totalForks = repositories.reduce((sum, r) => sum + r.forkCount, 0);
  const totalWatchers = repositories.reduce((sum, r) => sum + (r.watchers?.totalCount || 0), 0);
  
  // Sort repos by different metrics
  const byStars = [...repositories].sort((a, b) => b.stargazerCount - a.stargazerCount);
  const byForks = [...repositories].sort((a, b) => b.forkCount - a.forkCount);
  
  // Find most active repo (most recently pushed)
  const byActivity = [...repositories].sort((a, b) => 
    new Date(b.pushedAt) - new Date(a.pushedAt)
  );
  
  return {
    totalStars,
    totalForks,
    totalWatchers,
    repositoryCount: repositories.length,
    mostStarredRepo: byStars[0] ? formatRepo(byStars[0]) : null,
    mostForkedRepo: byForks[0] ? formatRepo(byForks[0]) : null,
    mostActiveRepo: byActivity[0] ? formatRepo(byActivity[0]) : null,
    starsPerRepo: repositories.length > 0 ? (totalStars / repositories.length).toFixed(1) : 0,
  };
}

function formatRepo(repo) {
  return {
    name: repo.name,
    nameWithOwner: repo.nameWithOwner,
    description: repo.description,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name,
    languageColor: repo.primaryLanguage?.color,
    isPrivate: repo.isPrivate,
    createdAt: repo.createdAt,
    pushedAt: repo.pushedAt,
  };
}

/**
 * Analyze collaboration patterns
 */
function analyzeCollaboration(user, contrib) {
  const pullRequests = user.pullRequests?.nodes || [];
  const issues = user.issues?.nodes || [];
  
  // External contributions (to repos not owned by user)
  const externalPRs = pullRequests.filter(pr => 
    pr.repository?.owner?.login !== user.login && !pr.repository?.isPrivate
  );
  
  const externalContributions = externalPRs.length;
  
  // Unique external repos
  const externalRepos = new Set(externalPRs.map(pr => pr.repository?.nameWithOwner)).size;
  
  // Review ratio
  const commits = contrib.totalCommitContributions;
  const reviews = contrib.totalPullRequestReviewContributions;
  const reviewToCommitRatio = commits > 0 ? (reviews / commits).toFixed(2) : 0;
  
  // Private vs Public
  const privateContribs = contrib.restrictedContributionsCount;
  const publicContribs = contrib.contributionCalendar.totalContributions - privateContribs;
  
  // PR merge rate
  const mergedPRs = pullRequests.filter(pr => pr.mergedAt).length;
  const closedPRs = pullRequests.filter(pr => pr.closedAt && !pr.mergedAt).length;
  const mergeRate = pullRequests.length > 0 ? ((mergedPRs / pullRequests.length) * 100).toFixed(0) : 0;
  
  // Average PR size
  const avgAdditions = pullRequests.reduce((sum, pr) => sum + (pr.additions || 0), 0) / (pullRequests.length || 1);
  const avgDeletions = pullRequests.reduce((sum, pr) => sum + (pr.deletions || 0), 0) / (pullRequests.length || 1);
  
  return {
    externalContributions,
    externalRepos,
    reviewCount: reviews,
    reviewToCommitRatio: parseFloat(reviewToCommitRatio),
    privateContributions: privateContribs,
    publicContributions: publicContribs,
    privateVsPublicRatio: publicContribs > 0 ? (privateContribs / publicContribs).toFixed(2) : 0,
    organizations: user.organizations?.nodes || [],
    prsMerged: mergedPRs,
    prsClosed: closedPRs,
    mergeRate: parseInt(mergeRate),
    avgPRAdditions: Math.round(avgAdditions),
    avgPRDeletions: Math.round(avgDeletions),
    issuesOpened: issues.length,
    issuesClosed: issues.filter(i => i.closedAt).length,
  };
}

/**
 * Classify developer personality
 */
function classifyDeveloperPersonality(activity, languages, impact, collaboration, contrib) {
  const traits = [];
  let archetype = 'builder';
  let score = 0;
  
  // Night Owl / Early Bird (would need commit time data)
  // For now, use weekend ratio as proxy
  if (activity.weekendRatio > 0.35) {
    traits.push({
      name: 'Weekend Warrior',
      description: 'Codes heavily on weekends',
      score: 85,
      icon: '🌙'
    });
    if (score < 90) {
      archetype = 'weekend-warrior';
      score = 85;
    }
  }
  
  // Marathon Runner (long streaks)
  if (activity.longestStreak >= 30) {
    traits.push({
      name: 'Streak Master',
      description: `${activity.longestStreak} day streak`,
      score: Math.min(100, 70 + activity.longestStreak),
      icon: '🔥'
    });
    if (score < 95) {
      archetype = 'marathon-runner';
      score = 90;
    }
  }
  
  // Polyglot
  if (languages.isPolyglot) {
    traits.push({
      name: 'Polyglot',
      description: `Fluent in ${languages.count}+ languages`,
      score: 88,
      icon: '🌍'
    });
    if (score < 88) {
      archetype = 'polyglot';
      score = 88;
    }
  }
  
  // Specialist
  if (languages.isSpecialist && languages.top) {
    traits.push({
      name: 'Specialist',
      description: `${languages.topLanguagePercentage}% ${languages.top.name}`,
      score: 85,
      icon: '🎯'
    });
    if (score < 85) {
      archetype = 'specialist';
      score = 85;
    }
  }
  
  // OSS Champion
  if (collaboration.externalContributions >= 10) {
    traits.push({
      name: 'OSS Champion',
      description: `${collaboration.externalContributions} external contributions`,
      score: 92,
      icon: '💪'
    });
    if (score < 92) {
      archetype = 'oss-champion';
      score = 92;
    }
  }
  
  // Code Reviewer
  if (collaboration.reviewToCommitRatio >= 0.5) {
    traits.push({
      name: 'Guardian',
      description: 'High review-to-commit ratio',
      score: 87,
      icon: '🛡️'
    });
    if (score < 87) {
      archetype = 'code-reviewer';
      score = 87;
    }
  }
  
  // Prolific Shipper (high commit count)
  if (contrib.totalCommitContributions >= 1000) {
    traits.push({
      name: 'Prolific Shipper',
      description: `${contrib.totalCommitContributions}+ commits`,
      score: 95,
      icon: '🚀'
    });
    if (score < 95) {
      archetype = 'prolific-shipper';
      score = 95;
    }
  }
  
  // Architect (creates many repos)
  if (contrib.totalRepositoryContributions >= 10) {
    traits.push({
      name: 'Architect',
      description: `Created ${contrib.totalRepositoryContributions} repos`,
      score: 82,
      icon: '🏛️'
    });
    if (score < 82) {
      archetype = 'architect';
      score = 82;
    }
  }
  
  // Maintainer (high stars)
  if (impact.totalStars >= 100) {
    traits.push({
      name: 'Maintainer',
      description: `${impact.totalStars} stars earned`,
      score: 90,
      icon: '⭐'
    });
    if (score < 90) {
      archetype = 'maintainer';
      score = 90;
    }
  }
  
  // Default trait if none found
  if (traits.length === 0) {
    traits.push({
      name: 'Builder',
      description: 'Building great things',
      score: 75,
      icon: '🔨'
    });
  }
  
  // Sort traits by score
  traits.sort((a, b) => b.score - a.score);
  
  // Get personality details
  const personalityDetails = getPersonalityDetails(archetype, traits, activity, languages, impact, collaboration, contrib);
  
  return {
    archetype,
    ...personalityDetails,
    traits: traits.slice(0, 5),
    badges: generateBadges(activity, languages, impact, collaboration, contrib),
  };
}

function getPersonalityDetails(archetype, traits, activity, languages, impact, collab, contrib) {
  const details = {
    'weekend-warrior': {
      title: 'The Weekend Warrior',
      emoji: '🌙',
      tagline: 'Weekends are for shipping',
      description: `While others rest, you code. ${(activity.weekendRatio * 100).toFixed(0)}% of your contributions came on weekends. Your side projects are your main event.`
    },
    'marathon-runner': {
      title: 'The Marathon Runner',
      emoji: '🏃',
      tagline: 'Consistency is your superpower',
      description: `${activity.longestStreak} days of continuous contributions. That's not discipline—that's dedication. You understand that small daily efforts compound into something extraordinary.`
    },
    'polyglot': {
      title: 'The Polyglot',
      emoji: '🌍',
      tagline: 'Master of many, limited by none',
      description: `${languages.count} languages in your arsenal. You don't see technologies as barriers—you see them as tools. Today's problem gets today's best solution.`
    },
    'specialist': {
      title: 'The Specialist',
      emoji: '🎯',
      tagline: 'Depth over breadth',
      description: `${languages.topLanguagePercentage}% of your code in ${languages.top?.name || 'your language'}. You've chosen your weapon, and you've mastered it. Focus is your edge.`
    },
    'oss-champion': {
      title: 'The OSS Champion',
      emoji: '💪',
      tagline: 'Building for everyone',
      description: `${collab.externalContributions} contributions to other people's projects. You're not just building your own empire—you're improving the entire ecosystem.`
    },
    'code-reviewer': {
      title: 'The Guardian',
      emoji: '🛡️',
      tagline: 'Quality is non-negotiable',
      description: `${collab.reviewCount} code reviews. You're the last line of defense before code hits production. Your feedback makes everyone better.`
    },
    'prolific-shipper': {
      title: 'The Prolific Shipper',
      emoji: '🚀',
      tagline: 'Move fast, ship faster',
      description: `${contrib.totalCommitContributions} commits. While others plan, you execute. The best code is shipped code, and you've shipped more than most.`
    },
    'architect': {
      title: 'The Architect',
      emoji: '🏛️',
      tagline: 'Building the foundations',
      description: `You created ${contrib.totalRepositoryContributions} new repositories. You see systems where others see problems. Building from scratch doesn't scare you.`
    },
    'maintainer': {
      title: 'The Maintainer',
      emoji: '⭐',
      tagline: 'Trusted by thousands',
      description: `${impact.totalStars} stars across your projects. Developers around the world rely on your code. That's responsibility you've earned.`
    },
    'builder': {
      title: 'The Builder',
      emoji: '🔨',
      tagline: 'Brick by brick, commit by commit',
      description: `You're building something. Every contribution is progress. Every line of code is a step forward. Keep going.`
    },
  };
  
  return details[archetype] || details['builder'];
}

function generateBadges(activity, languages, impact, collab, contrib) {
  const badges = [];
  
  if (activity.longestStreak >= 7) badges.push('🔥 Streak Starter');
  if (activity.longestStreak >= 30) badges.push('⚡ Streak Master');
  if (activity.longestStreak >= 100) badges.push('🌟 Legendary Streak');
  if (contrib.totalCommitContributions >= 100) badges.push('💻 Centurion');
  if (contrib.totalCommitContributions >= 500) badges.push('🎖️ Commit Commander');
  if (contrib.totalCommitContributions >= 1000) badges.push('👑 Commit King');
  if (collab.externalContributions >= 5) badges.push('🤝 Collaborator');
  if (collab.externalContributions >= 20) badges.push('🌐 Open Source Hero');
  if (impact.totalStars >= 10) badges.push('⭐ Rising Star');
  if (impact.totalStars >= 100) badges.push('✨ Star Collector');
  if (impact.totalStars >= 1000) badges.push('🌟 Superstar');
  if (languages.count >= 5) badges.push('🗣️ Multilingual');
  if (collab.reviewCount >= 50) badges.push('👀 Eagle Eye');
  if (contrib.totalIssueContributions >= 20) badges.push('🐛 Bug Hunter');
  
  return badges.slice(0, 6);
}

/**
 * Generate story highlights
 */
function generateDeveloperHighlights(activity, languages, impact, collab, personality) {
  const highlights = [];
  
  // Top contribution highlight
  highlights.push({
    type: 'stat',
    title: 'Total Contributions',
    description: 'Your year in commits, PRs, issues, and reviews',
    value: activity.totalDays,
    icon: '📊',
    color: '#6366f1',
  });
  
  // Streak highlight
  if (activity.longestStreak >= 7) {
    highlights.push({
      type: 'achievement',
      title: 'Longest Streak',
      description: `From ${formatDate(activity.longestStreakStart)} to ${formatDate(activity.longestStreakEnd)}`,
      value: `${activity.longestStreak} days`,
      icon: '🔥',
      color: '#f97316',
    });
  }
  
  // Top language highlight
  if (languages.top) {
    highlights.push({
      type: 'language',
      title: 'Primary Language',
      description: `${languages.top.percentage}% of your codebase`,
      value: languages.top.name,
      icon: '💻',
      color: languages.top.color,
    });
  }
  
  // Star highlight
  if (impact.totalStars > 0) {
    highlights.push({
      type: 'impact',
      title: 'Stars Earned',
      description: 'Your code is being noticed',
      value: impact.totalStars,
      icon: '⭐',
      color: '#fbbf24',
    });
  }
  
  // OSS highlight
  if (collab.externalContributions > 0) {
    highlights.push({
      type: 'collaboration',
      title: 'Open Source Impact',
      description: `Contributed to ${collab.externalRepos} external projects`,
      value: collab.externalContributions,
      icon: '🌍',
      color: '#10b981',
    });
  }
  
  return highlights;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================================================
// REPOSITORY ANALYSIS
// ============================================================================

export function analyzeRepositoryData(rawData, year) {
  const repo = rawData.repository;
  
  // Community analysis
  const communityAnalysis = analyzeCommunity(repo);
  
  // PR analysis
  const prAnalysis = analyzePullRequests(repo.pullRequests?.nodes || [], year);
  
  // Issue analysis
  const issueAnalysis = analyzeIssues(repo.issues?.nodes || [], year);
  
  // Release analysis
  const releaseAnalysis = analyzeReleases(repo.releases?.nodes || [], year);
  
  // Health analysis
  const healthAnalysis = analyzeHealth(repo, prAnalysis, issueAnalysis);
  
  // Determine personality
  const personality = classifyProjectPersonality(repo, communityAnalysis, prAnalysis, issueAnalysis, healthAnalysis);
  
  // Generate highlights
  const highlights = generateProjectHighlights(repo, communityAnalysis, prAnalysis, releaseAnalysis, personality);
  
  return {
    type: 'repository',
    year,
    repo: {
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      description: repo.description,
      url: repo.url,
      homepage: repo.homepageUrl,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      watchers: repo.watchers?.totalCount || 0,
      language: repo.primaryLanguage?.name,
      languageColor: repo.primaryLanguage?.color,
      license: repo.licenseInfo?.name,
      topics: repo.repositoryTopics?.nodes?.map(n => n.topic.name) || [],
      createdAt: repo.createdAt,
      isPrivate: repo.isPrivate,
      isArchived: repo.isArchived,
    },
    languages: processRepoLanguages(repo.languages),
    community: communityAnalysis,
    pullRequests: prAnalysis,
    issues: issueAnalysis,
    releases: releaseAnalysis,
    health: healthAnalysis,
    personality,
    highlights,
    commits: analyzeCommits(repo.defaultBranchRef?.target?.history?.nodes || []),
  };
}

function processRepoLanguages(languages) {
  if (!languages?.edges) return [];
  
  const totalSize = languages.totalSize || 1;
  
  return languages.edges.map(edge => ({
    name: edge.node.name,
    color: edge.node.color || LANGUAGE_COLORS[edge.node.name] || LANGUAGE_COLORS.default,
    size: edge.size,
    percentage: ((edge.size / totalSize) * 100).toFixed(1),
  }));
}

function analyzeCommunity(repo) {
  const contributors = repo.mentionableUsers?.nodes || [];
  const totalContributors = repo.mentionableUsers?.totalCount || 0;
  
  return {
    totalContributors,
    topContributors: contributors.slice(0, 10).map(c => ({
      login: c.login,
      avatarUrl: c.avatarUrl,
      name: c.name,
    })),
  };
}

function analyzePullRequests(prs, year) {
  const yearPRs = prs.filter(pr => pr.createdAt?.startsWith(year.toString()));
  
  const opened = yearPRs.length;
  const merged = yearPRs.filter(pr => pr.state === 'MERGED').length;
  const closed = yearPRs.filter(pr => pr.state === 'CLOSED' && !pr.mergedAt).length;
  
  // Calculate merge times
  const mergeTimes = yearPRs
    .filter(pr => pr.mergedAt)
    .map(pr => {
      const created = new Date(pr.createdAt);
      const merged = new Date(pr.mergedAt);
      return (merged - created) / (1000 * 60 * 60); // hours
    })
    .filter(t => t >= 0);
  
  const avgMergeTime = mergeTimes.length > 0
    ? mergeTimes.reduce((a, b) => a + b, 0) / mergeTimes.length
    : 0;
  
  const sortedMergeTimes = [...mergeTimes].sort((a, b) => a - b);
  const medianMergeTime = sortedMergeTimes.length > 0
    ? sortedMergeTimes[Math.floor(sortedMergeTimes.length / 2)]
    : 0;
  
  // Calculate average size
  const sizes = yearPRs.map(pr => (pr.additions || 0) + (pr.deletions || 0));
  const avgSize = sizes.length > 0 ? sizes.reduce((a, b) => a + b, 0) / sizes.length : 0;
  
  return {
    opened,
    merged,
    closed,
    open: yearPRs.filter(pr => pr.state === 'OPEN').length,
    avgMergeTimeHours: Math.round(avgMergeTime),
    medianMergeTimeHours: Math.round(medianMergeTime),
    avgSize: Math.round(avgSize),
    mergeRate: opened > 0 ? Math.round((merged / opened) * 100) : 0,
    topPRs: yearPRs.slice(0, 5),
  };
}

function analyzeIssues(issues, year) {
  const yearIssues = issues.filter(i => i.createdAt?.startsWith(year.toString()));
  
  const opened = yearIssues.length;
  const closed = yearIssues.filter(i => i.state === 'CLOSED').length;
  
  // Calculate response times (approximated by first comment or close)
  const closeTimes = yearIssues
    .filter(i => i.closedAt)
    .map(i => {
      const created = new Date(i.createdAt);
      const closedAt = new Date(i.closedAt);
      return (closedAt - created) / (1000 * 60 * 60); // hours
    })
    .filter(t => t >= 0);
  
  const avgCloseTime = closeTimes.length > 0
    ? closeTimes.reduce((a, b) => a + b, 0) / closeTimes.length
    : 0;
  
  return {
    opened,
    closed,
    open: yearIssues.filter(i => i.state === 'OPEN').length,
    avgCloseTimeHours: Math.round(avgCloseTime),
    closeRate: opened > 0 ? Math.round((closed / opened) * 100) : 0,
    withoutComments: yearIssues.filter(i => (i.comments?.totalCount || 0) === 0).length,
    topIssues: yearIssues.slice(0, 5),
  };
}

function analyzeReleases(releases, year) {
  const yearReleases = releases.filter(r => r.publishedAt?.startsWith(year.toString()));
  
  const totalDownloads = yearReleases.reduce((sum, r) => {
    const assetDownloads = r.releaseAssets?.nodes?.reduce((s, a) => s + (a.downloadCount || 0), 0) || 0;
    return sum + assetDownloads;
  }, 0);
  
  return {
    count: yearReleases.length,
    totalDownloads,
    releases: yearReleases.slice(0, 10).map(r => ({
      name: r.name || r.tagName,
      tagName: r.tagName,
      publishedAt: r.publishedAt,
      isPrerelease: r.isPrerelease,
      downloads: r.releaseAssets?.nodes?.reduce((s, a) => s + (a.downloadCount || 0), 0) || 0,
    })),
  };
}

function analyzeCommits(commits) {
  if (!commits || commits.length === 0) {
    return { total: 0, authors: [], avgSize: 0 };
  }
  
  const authorCounts = {};
  let totalAdditions = 0;
  let totalDeletions = 0;
  
  commits.forEach(commit => {
    const author = commit.author?.user?.login || commit.author?.name || 'Unknown';
    authorCounts[author] = (authorCounts[author] || 0) + 1;
    totalAdditions += commit.additions || 0;
    totalDeletions += commit.deletions || 0;
  });
  
  const topAuthors = Object.entries(authorCounts)
    .map(([login, count]) => ({ login, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    total: commits.length,
    authors: topAuthors,
    avgAdditions: Math.round(totalAdditions / commits.length),
    avgDeletions: Math.round(totalDeletions / commits.length),
  };
}

function analyzeHealth(repo, prAnalysis, issueAnalysis) {
  // Calculate bus factor (simplified: how many authors account for 80% of commits)
  const busFactor = calculateBusFactor(repo.defaultBranchRef?.target?.history?.nodes || []);
  
  // Check for important files
  const hasReadme = !!repo.readme;
  const hasContributing = !!repo.contributing;
  const hasCodeOfConduct = !!repo.codeOfConduct;
  const hasLicense = !!repo.licenseInfo;
  
  // Calculate overall score
  let score = 0;
  if (hasReadme) score += 20;
  if (hasContributing) score += 15;
  if (hasCodeOfConduct) score += 10;
  if (hasLicense) score += 15;
  if (busFactor > 1) score += 10;
  if (busFactor > 3) score += 10;
  if (prAnalysis.mergeRate > 50) score += 10;
  if (issueAnalysis.closeRate > 50) score += 10;
  
  return {
    busFactor,
    hasReadme,
    hasContributing,
    hasCodeOfConduct,
    hasLicense,
    hasIssuesEnabled: repo.hasIssuesEnabled,
    hasWikiEnabled: repo.hasWikiEnabled,
    hasDiscussionsEnabled: repo.hasDiscussionsEnabled,
    communityScore: Math.min(100, score),
    stalePRs: prAnalysis.open,
    staleIssues: issueAnalysis.open,
  };
}

function calculateBusFactor(commits) {
  if (!commits || commits.length === 0) return 1;
  
  const authorCounts = {};
  commits.forEach(commit => {
    const author = commit.author?.user?.login || commit.author?.name || 'Unknown';
    authorCounts[author] = (authorCounts[author] || 0) + 1;
  });
  
  const sorted = Object.values(authorCounts).sort((a, b) => b - a);
  const total = commits.length;
  
  let cumulative = 0;
  let busFactor = 0;
  for (const count of sorted) {
    cumulative += count;
    busFactor++;
    if (cumulative >= total * 0.8) break;
  }
  
  return busFactor;
}

function classifyProjectPersonality(repo, community, prs, issues, health) {
  // Rocket Ship: Fast growth, high velocity
  if (repo.stargazerCount > 1000 && prs.mergeRate > 70) {
    return {
      archetype: 'rocket-ship',
      title: 'The Rocket Ship 🚀',
      emoji: '🚀',
      tagline: 'Unstoppable momentum',
      description: `${repo.stargazerCount.toLocaleString()} stars and counting. PRs merge at ${prs.mergeRate}% rate. This project is on fire.`
    };
  }
  
  // Community Hub: Many contributors
  if (community.totalContributors > 50) {
    return {
      archetype: 'community-hub',
      title: 'The Community Hub 🏘️',
      emoji: '🏘️',
      tagline: 'Built by the community',
      description: `${community.totalContributors} contributors and growing. This isn't just a project—it's a movement.`
    };
  }
  
  // Well-Oiled Machine: High health score
  if (health.communityScore >= 80) {
    return {
      archetype: 'well-oiled-machine',
      title: 'The Well-Oiled Machine ⚙️',
      emoji: '⚙️',
      tagline: 'Everything in its place',
      description: `Community score of ${health.communityScore}/100. Documentation, processes, and quality—you've got it all.`
    };
  }
  
  // Workhorse: High activity
  if (prs.opened > 100 || issues.opened > 100) {
    return {
      archetype: 'workhorse',
      title: 'The Workhorse 🐴',
      emoji: '🐴',
      tagline: 'Steady and reliable',
      description: `${prs.opened} PRs and ${issues.opened} issues this year. This project never stops.`
    };
  }
  
  // Rising Star: Growing
  if (repo.stargazerCount >= 10 && repo.stargazerCount < 1000) {
    return {
      archetype: 'rising-star',
      title: 'The Rising Star ⭐',
      emoji: '⭐',
      tagline: 'On the way up',
      description: `${repo.stargazerCount} stars and gaining momentum. The best is yet to come.`
    };
  }
  
  // Hidden Gem
  return {
    archetype: 'hidden-gem',
    title: 'The Hidden Gem 💎',
    emoji: '💎',
    tagline: 'Waiting to be discovered',
    description: `Great code doesn't always get noticed right away. Your time will come.`
  };
}

function generateProjectHighlights(repo, community, prs, releases, personality) {
  const highlights = [];
  
  highlights.push({
    type: 'stars',
    title: 'Total Stars',
    description: 'Community recognition',
    value: repo.stargazerCount,
    icon: '⭐',
    color: '#fbbf24',
  });
  
  highlights.push({
    type: 'community',
    title: 'Contributors',
    description: 'Building together',
    value: community.totalContributors,
    icon: '👥',
    color: '#6366f1',
  });
  
  if (prs.opened > 0) {
    highlights.push({
      type: 'velocity',
      title: 'Pull Requests',
      description: `${prs.mergeRate}% merge rate`,
      value: prs.merged,
      icon: '🔄',
      color: '#10b981',
    });
  }
  
  if (releases.count > 0) {
    highlights.push({
      type: 'releases',
      title: 'Releases',
      description: `${releases.totalDownloads.toLocaleString()} downloads`,
      value: releases.count,
      icon: '📦',
      color: '#f97316',
    });
  }
  
  return highlights;
}

// ============================================================================
// TOP REPOSITORIES HELPER
// ============================================================================

function getTopRepositories(repos, commitsByRepo) {
  // Merge commit data with repo data
  const commitCounts = {};
  commitsByRepo.forEach(item => {
    commitCounts[item.repository.nameWithOwner] = item.contributions.totalCount;
  });
  
  return repos
    .filter(r => !r.isArchived && !r.isFork)
    .map(r => ({
      name: r.name,
      nameWithOwner: r.nameWithOwner,
      description: r.description,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name,
      languageColor: r.primaryLanguage?.color,
      commits: commitCounts[r.nameWithOwner] || 0,
      pushedAt: r.pushedAt,
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6);
}


