import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_REST_API = "https://api.github.com";
const CURRENT_YEAR = 2025;

// Minimal GraphQL query - NO releases (we'll use REST for that)
const REPOSITORY_QUERY = `
query RepoWrapped($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    nameWithOwner
    description
    url
    createdAt
    
    stargazerCount
    forkCount
    watchers { totalCount }
    
    primaryLanguage { name color }
    
    languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
      edges {
        size
        node { name color }
      }
      totalSize
    }
    
    licenseInfo { name }
    
    issues(states: [OPEN, CLOSED]) {
      totalCount
    }
    
    pullRequests(states: [OPEN, CLOSED, MERGED]) {
      totalCount
    }
    
    openIssues: issues(states: [OPEN]) {
      totalCount
    }
    
    closedIssues: issues(states: [CLOSED]) {
      totalCount
    }
    
    openPRs: pullRequests(states: [OPEN]) {
      totalCount
    }
    
    mergedPRs: pullRequests(states: [MERGED]) {
      totalCount
    }
    
    repositoryTopics(first: 5) {
      nodes {
        topic { name }
      }
    }
    
    owner {
      login
      avatarUrl
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
      throw new Error("GitHub API resource limits exceeded. Please try again later.");
    }
    throw new Error(errorMsg);
  }
  
  return data.data;
}

async function fetchREST(endpoint: string, token: string) {
  try {
    const response = await fetch(`${GITHUB_REST_API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch {
    return null;
  }
}

// Fetch releases via REST API - only 2025, skip alpha/beta
async function fetchReleases2025(owner: string, name: string, token: string) {
  const releases: any[] = [];
  let totalDownloads = 0;
  
  try {
    // Fetch only first 30 releases (most recent)
    const data = await fetchREST(`/repos/${owner}/${name}/releases?per_page=30`, token);
    
    if (!Array.isArray(data)) {
      return { count: 0, totalDownloads: 0, releases: [] };
    }
    
    for (const release of data) {
      // Skip if not published in 2025
      if (!release.published_at) continue;
      const publishedYear = new Date(release.published_at).getFullYear();
      if (publishedYear !== CURRENT_YEAR) continue;
      
      // Skip prereleases and drafts
      if (release.prerelease || release.draft) continue;
      
      // Skip alpha/beta/rc/preview
      const tagLower = (release.tag_name || "").toLowerCase();
      const nameLower = (release.name || "").toLowerCase();
      if (
        tagLower.includes("alpha") || 
        tagLower.includes("beta") || 
        tagLower.includes("-rc") || 
        tagLower.includes("preview") ||
        nameLower.includes("alpha") || 
        nameLower.includes("beta") ||
        nameLower.includes("preview")
      ) {
        continue;
      }
      
      // Sum downloads from assets
      let releaseDownloads = 0;
      if (release.assets && Array.isArray(release.assets)) {
        for (const asset of release.assets) {
          releaseDownloads += asset.download_count || 0;
        }
      }
      
      totalDownloads += releaseDownloads;
      
      releases.push({
        name: release.name || release.tag_name,
        tagName: release.tag_name,
        publishedAt: release.published_at,
        downloads: releaseDownloads,
      });
    }
  } catch (e) {
    console.error("Error fetching releases:", e);
  }
  
  return {
    count: releases.length,
    totalDownloads,
    releases: releases.slice(0, 10), // Top 10
  };
}

async function getYearlyStats(owner: string, name: string, token: string, year: number) {
  // Fetch contributors (limited)
  let contributors: any[] = [];
  try {
    const contribData = await fetchREST(`/repos/${owner}/${name}/contributors?per_page=30`, token);
    if (Array.isArray(contribData)) {
      contributors = contribData;
    }
  } catch {
    // Ignore errors
  }
  
  // Fetch commit activity
  let commitActivity: any[] = [];
  try {
    const activityData = await fetchREST(`/repos/${owner}/${name}/stats/commit_activity`, token);
    if (Array.isArray(activityData)) {
      commitActivity = activityData;
    }
  } catch {
    // Ignore errors
  }
  
  // Process commit activity into monthly data
  const monthlyCommits: Record<string, number> = {};
  const weeklyCommitsData: { week: string; count: number }[] = [];
  
  if (Array.isArray(commitActivity)) {
    commitActivity.forEach((week: any) => {
      if (week && week.week) {
        const date = new Date(week.week * 1000);
        if (date.getFullYear() === year) {
          const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyCommits[monthKey] = (monthlyCommits[monthKey] || 0) + (week.total || 0);
          weeklyCommitsData.push({
            week: date.toISOString().split('T')[0],
            count: week.total || 0,
          });
        }
      }
    });
  }
  
  const totalCommits2025 = Object.values(monthlyCommits).reduce((a, b) => a + b, 0);
  
  return {
    contributors: {
      total: contributors.length,
      top: contributors.slice(0, 10).map((c: any) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
      })),
    },
    commits: {
      monthly: monthlyCommits,
      weekly: weeklyCommitsData,
      totalThisYear: totalCommits2025,
    },
  };
}

function classifyProjectPersonality(data: any) {
  const { stars, forks, contributors, releases, commits } = data;
  
  let archetype = "growing-project";
  const traits: any[] = [];
  
  if (stars >= 10000) {
    archetype = "community-powerhouse";
    traits.push({ name: "Massively Popular", description: `${(stars/1000).toFixed(1)}k stars`, icon: "🌟" });
  } else if (stars >= 1000) {
    archetype = "rising-project";
    traits.push({ name: "Rising Star", description: `${stars.toLocaleString()} stars`, icon: "⭐" });
  }
  
  if (contributors >= 100) {
    archetype = archetype === "community-powerhouse" ? archetype : "community-driven";
    traits.push({ name: "Community Driven", description: `${contributors}+ contributors`, icon: "👥" });
  }
  
  if (releases >= 10) {
    traits.push({ name: "Active Releaser", description: `${releases} releases`, icon: "📦" });
  }
  
  if (commits >= 1000) {
    traits.push({ name: "Highly Active", description: `${commits.toLocaleString()} commits`, icon: "⚡" });
  }
  
  if (forks >= 1000) {
    traits.push({ name: "Fork Magnet", description: `${forks.toLocaleString()} forks`, icon: "🍴" });
  }
  
  if (traits.length === 0) {
    traits.push({ name: "Growing Project", description: "Building momentum", icon: "🌱" });
  }
  
  const archetypeDetails: Record<string, any> = {
    "community-powerhouse": {
      title: "Community Powerhouse",
      emoji: "🏛️",
      tagline: "A pillar of the open source community",
      description: "Massive adoption, active community, continuous improvements.",
    },
    "rising-project": {
      title: "Rising Star Project",
      emoji: "🚀",
      tagline: "On the path to greatness",
      description: "Strong growth and momentum that can't be ignored.",
    },
    "community-driven": {
      title: "Community Driven",
      emoji: "🤝",
      tagline: "Built by the community, for the community",
      description: "A diverse group of contributors working together.",
    },
    "growing-project": {
      title: "Growing Project",
      emoji: "🌱",
      tagline: "Every great project started somewhere",
      description: "Building momentum and laying the foundation.",
    },
  };
  
  const details = archetypeDetails[archetype] || archetypeDetails["growing-project"];
  
  return {
    archetype,
    ...details,
    traits: traits.slice(0, 4),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");
  
  if (!owner || !name) {
    return NextResponse.json({ error: "Owner and name are required" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return NextResponse.json({ 
      error: "Server configuration error: GitHub token not configured" 
    }, { status: 500 });
  }

  try {
    const year = CURRENT_YEAR;

    // Fetch main repo data via GraphQL (no releases!)
    const graphqlData = await graphql(REPOSITORY_QUERY, { owner, name }, token);
    
    if (!graphqlData.repository) {
      return NextResponse.json({ error: `Repository "${owner}/${name}" not found` }, { status: 404 });
    }
    
    const repo = graphqlData.repository;
    
    // Fetch releases via REST API (more reliable)
    const releaseData = await fetchReleases2025(owner, name, token);
    
    // Fetch additional yearly stats via REST API
    const yearlyStats = await getYearlyStats(owner, name, token, year);
    
    // Process languages
    const languages = (repo.languages?.edges || []).map((edge: any) => ({
      name: edge.node.name,
      color: edge.node.color,
      percentage: repo.languages.totalSize > 0 
        ? ((edge.size / repo.languages.totalSize) * 100).toFixed(1) 
        : "0",
    }));
    
    // Calculate project personality
    const personality = classifyProjectPersonality({
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      contributors: yearlyStats.contributors.total,
      releases: releaseData.count,
      commits: yearlyStats.commits.totalThisYear,
    });
    
    // Build response
    const wrappedData = {
      type: "project",
      year,
      repository: {
        name: repo.name,
        nameWithOwner: repo.nameWithOwner,
        description: repo.description,
        url: repo.url,
        createdAt: repo.createdAt,
        owner: {
          login: repo.owner.login,
          avatarUrl: repo.owner.avatarUrl,
        },
        primaryLanguage: repo.primaryLanguage,
        languages,
        topics: (repo.repositoryTopics?.nodes || []).map((t: any) => t.topic.name),
        license: repo.licenseInfo?.name,
      },
      stats: {
        stars: {
          total: repo.stargazerCount,
          gained2025: 0,
        },
        forks: {
          total: repo.forkCount,
          gained2025: 0,
        },
        watchers: repo.watchers?.totalCount || 0,
        issues: {
          total: repo.issues?.totalCount || 0,
          open: repo.openIssues?.totalCount || 0,
          closed: repo.closedIssues?.totalCount || 0,
          created2025: 0,
        },
        pullRequests: {
          total: repo.pullRequests?.totalCount || 0,
          open: repo.openPRs?.totalCount || 0,
          merged: repo.mergedPRs?.totalCount || 0,
          created2025: 0,
          merged2025: 0,
        },
        commits: {
          total2025: yearlyStats.commits.totalThisYear,
          monthly: yearlyStats.commits.monthly,
          weekly: yearlyStats.commits.weekly,
        },
        contributors: yearlyStats.contributors,
      },
      releases: releaseData,
      activity: {
        monthlyCommits: yearlyStats.commits.monthly,
        weeklyCommits: yearlyStats.commits.weekly,
      },
      personality,
    };
    
    return NextResponse.json(wrappedData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch data" 
    }, { status: 500 });
  }
}
