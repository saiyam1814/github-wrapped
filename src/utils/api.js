/**
 * Main API Interface
 * Fetches and processes GitHub data for wrapped experience
 */

import { fetchDeveloperData, fetchRepositoryData } from '../lib/github';
import { analyzeDeveloperData, analyzeRepositoryData } from '../lib/analysis';

/**
 * Fetch and analyze user wrapped data
 */
export async function fetchUserData(username, year, token) {
  if (!token) {
    throw new Error("GitHub token is required for personal stats. Create one at github.com/settings/tokens");
  }

  try {
    // Fetch raw data from GitHub
    const rawData = await fetchDeveloperData(username, year, token);
    
    // Analyze and transform the data
    const wrappedData = analyzeDeveloperData(rawData, year);
    
    return wrappedData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Fetch and analyze project wrapped data
 */
export async function fetchProjectData(repoIdentifier, year, token) {
  // Parse owner/repo from various formats
  const match = repoIdentifier.match(/(?:github\.com\/)?([^/]+)\/([^/]+)/);
  
  if (!match) {
    throw new Error("Invalid repository format. Use 'owner/repo' or a GitHub URL.");
  }

  const owner = match[1];
  const name = match[2].replace(/\.git$/, ''); // Remove .git suffix if present

  try {
    // Fetch raw data from GitHub
    const rawData = await fetchRepositoryData(owner, name, token);
    
    // Analyze and transform the data
    const wrappedData = analyzeRepositoryData(rawData, year);
    
    return wrappedData;
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
}

/**
 * Generate demo data for users without tokens
 */
export function generateDemoData(type = 'developer') {
  if (type === 'developer') {
    return {
      type: 'developer',
      year: 2024,
      user: {
        login: 'octocat',
        name: 'The Octocat',
        avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        bio: 'Building the future, one commit at a time',
        company: '@github',
        location: 'San Francisco',
        followers: 12500,
        following: 42,
        organizations: [
          { login: 'github', name: 'GitHub', avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }
        ],
      },
      contributions: {
        total: 2847,
        commits: 1823,
        pullRequests: 234,
        issues: 89,
        reviews: 156,
        repositoriesContributedTo: 24,
        privateContributions: 421,
      },
      activity: {
        calendar: generateDemoCalendar(),
        longestStreak: 47,
        currentStreak: 12,
        longestStreakStart: '2024-03-15',
        longestStreakEnd: '2024-05-01',
        busiestDay: 'Tuesday',
        busiestDayCount: 623,
        busiestHour: 14,
        peakMonth: '2024-09',
        peakMonthCount: 412,
        firstContribution: '2024-01-02',
        lastContribution: '2024-12-13',
        totalActiveDays: 247,
        totalDays: 348,
        averagePerDay: '11.5',
        averagePerWeek: '54.8',
        weekdayDistribution: { 0: 312, 1: 489, 2: 623, 3: 567, 4: 478, 5: 312, 6: 66 },
        monthlyDistribution: generateMonthlyDistribution(),
        weekendRatio: 0.13,
      },
      languages: {
        all: [
          { name: 'TypeScript', color: '#3178c6', size: 2340000, percentage: '42.1', repoCount: 12, commits: 823 },
          { name: 'Python', color: '#3572a5', size: 1560000, percentage: '28.1', repoCount: 8, commits: 456 },
          { name: 'Go', color: '#00add8', size: 890000, percentage: '16.0', repoCount: 5, commits: 312 },
          { name: 'Rust', color: '#dea584', size: 450000, percentage: '8.1', repoCount: 3, commits: 156 },
          { name: 'JavaScript', color: '#f1e05a', size: 320000, percentage: '5.7', repoCount: 4, commits: 76 },
        ],
        top: { name: 'TypeScript', color: '#3178c6', size: 2340000, percentage: '42.1', repoCount: 12 },
        count: 5,
        isSpecialist: false,
        isPolyglot: true,
        topLanguagePercentage: 42.1,
      },
      impact: {
        totalStars: 8934,
        totalForks: 1247,
        totalWatchers: 892,
        repositoryCount: 32,
        mostStarredRepo: {
          name: 'awesome-project',
          nameWithOwner: 'octocat/awesome-project',
          description: 'An awesome open source project',
          stars: 4521,
          forks: 623,
          language: 'TypeScript',
          languageColor: '#3178c6',
        },
        starsPerRepo: '279.2',
      },
      collaboration: {
        externalContributions: 67,
        externalRepos: 23,
        reviewCount: 156,
        reviewToCommitRatio: 0.09,
        privateContributions: 421,
        publicContributions: 2426,
        organizations: [],
        prsMerged: 198,
        prsClosed: 12,
        mergeRate: 85,
        avgPRAdditions: 234,
        avgPRDeletions: 89,
        issuesOpened: 89,
        issuesClosed: 72,
      },
      personality: {
        archetype: 'polyglot',
        title: 'The Polyglot',
        emoji: '🌍',
        tagline: 'Master of many, limited by none',
        description: '5 languages in your arsenal. You don\'t see technologies as barriers—you see them as tools. Today\'s problem gets today\'s best solution.',
        traits: [
          { name: 'Polyglot', description: 'Fluent in 5+ languages', score: 92, icon: '🌍' },
          { name: 'OSS Champion', description: '67 external contributions', score: 88, icon: '💪' },
          { name: 'Streak Master', description: '47 day streak', score: 85, icon: '🔥' },
          { name: 'Maintainer', description: '8934 stars earned', score: 90, icon: '⭐' },
        ],
        badges: ['🌟 Legendary Streak', '👑 Commit King', '🌐 Open Source Hero', '✨ Star Collector', '🗣️ Multilingual', '👀 Eagle Eye'],
      },
      highlights: [
        { type: 'stat', title: 'Total Contributions', value: 2847, icon: '📊', color: '#6366f1' },
        { type: 'achievement', title: 'Longest Streak', value: '47 days', icon: '🔥', color: '#f97316' },
        { type: 'language', title: 'Primary Language', value: 'TypeScript', icon: '💻', color: '#3178c6' },
        { type: 'impact', title: 'Stars Earned', value: 8934, icon: '⭐', color: '#fbbf24' },
      ],
      topRepositories: [
        { name: 'awesome-project', stars: 4521, forks: 623, language: 'TypeScript', languageColor: '#3178c6', commits: 312 },
        { name: 'cli-toolkit', stars: 2134, forks: 234, language: 'Go', languageColor: '#00add8', commits: 189 },
        { name: 'ml-pipeline', stars: 1289, forks: 178, language: 'Python', languageColor: '#3572a5', commits: 267 },
        { name: 'web-components', stars: 623, forks: 89, language: 'TypeScript', languageColor: '#3178c6', commits: 145 },
        { name: 'rust-utils', stars: 234, forks: 45, language: 'Rust', languageColor: '#dea584', commits: 98 },
        { name: 'api-framework', stars: 133, forks: 78, language: 'Python', languageColor: '#3572a5', commits: 76 },
      ],
    };
  }

  // Demo project data
  return {
    type: 'repository',
    year: 2024,
    repo: {
      name: 'awesome-framework',
      nameWithOwner: 'example/awesome-framework',
      description: 'A modern, fast, and developer-friendly framework',
      stars: 15234,
      forks: 2341,
      watchers: 892,
      language: 'TypeScript',
      languageColor: '#3178c6',
      license: 'MIT',
      topics: ['typescript', 'framework', 'developer-tools', 'open-source'],
    },
    languages: [
      { name: 'TypeScript', color: '#3178c6', percentage: '78.3' },
      { name: 'JavaScript', color: '#f1e05a', percentage: '15.2' },
      { name: 'CSS', color: '#563d7c', percentage: '6.5' },
    ],
    community: {
      totalContributors: 234,
      topContributors: [
        { login: 'contributor1', avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
        { login: 'contributor2', avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
      ],
    },
    pullRequests: {
      opened: 456,
      merged: 389,
      closed: 42,
      open: 25,
      avgMergeTimeHours: 18,
      medianMergeTimeHours: 12,
      avgSize: 156,
      mergeRate: 85,
    },
    issues: {
      opened: 234,
      closed: 198,
      open: 36,
      avgCloseTimeHours: 72,
      closeRate: 85,
    },
    releases: {
      count: 24,
      totalDownloads: 1247000,
    },
    health: {
      busFactor: 4,
      communityScore: 87,
      hasReadme: true,
      hasContributing: true,
      hasCodeOfConduct: true,
      hasLicense: true,
    },
    personality: {
      archetype: 'rocket-ship',
      title: 'The Rocket Ship 🚀',
      emoji: '🚀',
      tagline: 'Unstoppable momentum',
      description: '15,234 stars and counting. PRs merge at 85% rate. This project is on fire.',
    },
    highlights: [
      { type: 'stars', title: 'Total Stars', value: 15234, icon: '⭐', color: '#fbbf24' },
      { type: 'community', title: 'Contributors', value: 234, icon: '👥', color: '#6366f1' },
      { type: 'velocity', title: 'PRs Merged', value: 389, icon: '🔄', color: '#10b981' },
      { type: 'releases', title: 'Releases', value: 24, icon: '📦', color: '#f97316' },
    ],
  };
}

// Helper to generate demo calendar data
function generateDemoCalendar() {
  const calendar = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const weekday = d.getDay();
    // More contributions on weekdays
    const baseChance = weekday === 0 || weekday === 6 ? 0.4 : 0.8;
    const hasContribution = Math.random() < baseChance;
    
    calendar.push({
      date: d.toISOString().split('T')[0],
      contributionCount: hasContribution ? Math.floor(Math.random() * 15) + 1 : 0,
      weekday,
      color: hasContribution ? '#6366f1' : '#1a1a1a',
    });
  }
  
  return calendar;
}

function generateMonthlyDistribution() {
  return {
    '2024-01': 187, '2024-02': 234, '2024-03': 312,
    '2024-04': 278, '2024-05': 356, '2024-06': 198,
    '2024-07': 145, '2024-08': 234, '2024-09': 412,
    '2024-10': 289, '2024-11': 167, '2024-12': 35,
  };
}


