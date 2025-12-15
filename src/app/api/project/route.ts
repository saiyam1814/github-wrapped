import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_REST_API = "https://api.github.com";
const CURRENT_YEAR = 2025;

// GraphQL query for repository data
const REPOSITORY_QUERY = `
query RepoWrapped($owner: String!, $name: String!, $since: GitTimestamp!) {
  repository(owner: $owner, name: $name) {
    name
    nameWithOwner
    description
    url
    homepageUrl
    createdAt
    pushedAt
    isArchived
    isFork
    
    stargazerCount
    forkCount
    watchers { totalCount }
    
    primaryLanguage { name color }
    
    languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
      edges {
        size
        node { name color }
      }
      totalSize
    }
    
    licenseInfo { name spdxId }
    
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(since: $since) {
            totalCount
          }
        }
      }
    }
    
    releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
      totalCount
      nodes {
        name
        tagName
        publishedAt
        isPrerelease
        isDraft
        releaseAssets(first: 50) {
          nodes {
            name
            downloadCount
          }
        }
      }
    }
    
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
    
    mentionableUsers(first: 1) {
      totalCount
    }
    
    repositoryTopics(first: 10) {
      nodes {
        topic { name }
      }
    }
    
    owner {
      login
      avatarUrl
      ... on Organization {
        name
        description
      }
      ... on User {
        name
        bio
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

async function fetchREST(endpoint: string, token: string) {
  const response = await fetch(`${GITHUB_REST_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`REST API error: ${response.status}`);
  }
  
  return response.json();
}

async function fetchAllPages(endpoint: string, token: string, maxPages = 10) {
  const results: any[] = [];
  let page = 1;
  
  while (page <= maxPages) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(`${GITHUB_REST_API}${endpoint}${separator}per_page=100&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) break;
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;
    
    results.push(...data);
    
    if (data.length < 100) break;
    page++;
  }
  
  return results;
}

async function getYearlyStats(owner: string, name: string, token: string, year: number) {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year}-12-31T23:59:59Z`;
  
  // Fetch issues created this year
  const issuesThisYear = await fetchAllPages(
    `/repos/${owner}/${name}/issues?state=all&since=${startDate}&sort=created&direction=desc`,
    token,
    5
  );
  const issuesCreated2025 = issuesThisYear.filter((issue: any) => {
    const created = new Date(issue.created_at);
    return created.getFullYear() === year && !issue.pull_request;
  });
  
  // Fetch PRs - need to filter by created date
  const prsThisYear = await fetchAllPages(
    `/repos/${owner}/${name}/pulls?state=all&sort=created&direction=desc`,
    token,
    5
  );
  const prsCreated2025 = prsThisYear.filter((pr: any) => {
    const created = new Date(pr.created_at);
    return created.getFullYear() === year;
  });
  const prsMerged2025 = prsCreated2025.filter((pr: any) => pr.merged_at);
  
  // Fetch contributors
  let contributors: any[] = [];
  try {
    contributors = await fetchAllPages(`/repos/${owner}/${name}/contributors`, token, 3);
  } catch (e) {
    // Some repos don't allow contributor listing
  }
  
  // Fetch forks created this year
  const forksThisYear = await fetchAllPages(
    `/repos/${owner}/${name}/forks?sort=newest`,
    token,
    3
  );
  const forksCreated2025 = forksThisYear.filter((fork: any) => {
    const created = new Date(fork.created_at);
    return created.getFullYear() === year;
  });
  
  // Fetch commit activity for the year (weekly data)
  let commitActivity: any[] = [];
  try {
    commitActivity = await fetchREST(`/repos/${owner}/${name}/stats/commit_activity`, token);
    if (!Array.isArray(commitActivity)) commitActivity = [];
  } catch (e) {
    // Stats might not be available
  }
  
  // Fetch stargazers with timestamps (to calculate stars gained this year)
  // Note: This is limited, we'll estimate based on available data
  let starsGained2025 = 0;
  try {
    const starHistory = await fetch(
      `${GITHUB_REST_API}/repos/${owner}/${name}/stargazers?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.star+json", // Get timestamps
        },
      }
    );
    if (starHistory.ok) {
      const stars = await starHistory.json();
      if (Array.isArray(stars)) {
        starsGained2025 = stars.filter((s: any) => {
          const starred = new Date(s.starred_at);
          return starred.getFullYear() === year;
        }).length;
      }
    }
  } catch (e) {
    // Fallback
  }
  
  // Process commit activity into monthly data
  const monthlyCommits: Record<string, number> = {};
  const weeklyCommitsData: { week: string; count: number }[] = [];
  
  if (Array.isArray(commitActivity)) {
    commitActivity.forEach((week: any) => {
      const date = new Date(week.week * 1000);
      if (date.getFullYear() === year) {
        const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCommits[monthKey] = (monthlyCommits[monthKey] || 0) + week.total;
        weeklyCommitsData.push({
          week: date.toISOString().split('T')[0],
          count: week.total,
        });
      }
    });
  }
  
  return {
    issues: {
      created: issuesCreated2025.length,
      all: issuesCreated2025,
    },
    pullRequests: {
      created: prsCreated2025.length,
      merged: prsMerged2025.length,
      all: prsCreated2025,
    },
    contributors: {
      total: contributors.length,
      top: contributors.slice(0, 10).map((c: any) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
      })),
    },
    forks: {
      created2025: forksCreated2025.length,
    },
    starsGained2025,
    commits: {
      monthly: monthlyCommits,
      weekly: weeklyCommitsData,
      totalThisYear: Object.values(monthlyCommits).reduce((a, b) => a + b, 0),
    },
  };
}

function processReleases(releases: any[], year: number) {
  // Filter releases for this year, excluding prereleases/drafts/alpha/beta
  const validReleases = releases.filter((release: any) => {
    if (!release.publishedAt) return false;
    const publishedYear = new Date(release.publishedAt).getFullYear();
    if (publishedYear !== year) return false;
    if (release.isPrerelease || release.isDraft) return false;
    
    // Skip alpha/beta releases
    const tagLower = (release.tagName || "").toLowerCase();
    const nameLower = (release.name || "").toLowerCase();
    if (tagLower.includes("alpha") || tagLower.includes("beta") || 
        tagLower.includes("-rc") || tagLower.includes("preview") ||
        nameLower.includes("alpha") || nameLower.includes("beta") ||
        nameLower.includes("preview")) {
      return false;
    }
    
    return true;
  });
  
  // Calculate total downloads
  let totalDownloads = 0;
  const releaseDetails = validReleases.map((release: any) => {
    const downloads = release.releaseAssets.nodes.reduce(
      (sum: number, asset: any) => sum + (asset.downloadCount || 0),
      0
    );
    totalDownloads += downloads;
    
    return {
      name: release.name || release.tagName,
      tagName: release.tagName,
      publishedAt: release.publishedAt,
      downloads,
      assets: release.releaseAssets.nodes.map((a: any) => ({
        name: a.name,
        downloads: a.downloadCount,
      })),
    };
  });
  
  return {
    count: validReleases.length,
    totalDownloads,
    releases: releaseDetails.slice(0, 10), // Top 10 releases
  };
}

function classifyProjectPersonality(data: any) {
  const { stars, forks, issues, prs, contributors, releases, commits } = data;
  
  let archetype = "growing-project";
  const traits: any[] = [];
  
  // Determine archetype based on metrics
  if (stars >= 10000) {
    archetype = "community-powerhouse";
    traits.push({ name: "Massively Popular", description: `${(stars/1000).toFixed(1)}k stars`, icon: "🌟" });
  } else if (stars >= 1000) {
    archetype = "rising-project";
    traits.push({ name: "Rising Star", description: `${stars.toLocaleString()} stars`, icon: "⭐" });
  }
  
  if (contributors >= 100) {
    archetype = archetype === "community-powerhouse" ? archetype : "community-driven";
    traits.push({ name: "Community Driven", description: `${contributors} contributors`, icon: "👥" });
  }
  
  if (releases >= 10) {
    traits.push({ name: "Active Releaser", description: `${releases} releases`, icon: "📦" });
  }
  
  if (commits >= 1000) {
    traits.push({ name: "Highly Active", description: `${commits.toLocaleString()} commits`, icon: "⚡" });
  }
  
  if (prs >= 500) {
    traits.push({ name: "PR Machine", description: `${prs} PRs`, icon: "🔄" });
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
      description: "Massive adoption, active community, continuous improvements. This is what open source success looks like.",
    },
    "rising-project": {
      title: "Rising Star Project",
      emoji: "🚀",
      tagline: "On the path to greatness",
      description: "Strong growth, engaged contributors, and momentum that can't be ignored.",
    },
    "community-driven": {
      title: "Community Driven",
      emoji: "🤝",
      tagline: "Built by the community, for the community",
      description: "A diverse group of contributors working together to build something amazing.",
    },
    "growing-project": {
      title: "Growing Project",
      emoji: "🌱",
      tagline: "Every great project started somewhere",
      description: "Building momentum, attracting attention, and laying the foundation for future success.",
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
    const since = `${year}-01-01T00:00:00Z`;

    // Fetch main repo data via GraphQL
    const graphqlData = await graphql(REPOSITORY_QUERY, { owner, name, since }, token);
    
    if (!graphqlData.repository) {
      return NextResponse.json({ error: `Repository "${owner}/${name}" not found` }, { status: 404 });
    }
    
    const repo = graphqlData.repository;
    
    // Fetch additional yearly stats via REST API
    const yearlyStats = await getYearlyStats(owner, name, token, year);
    
    // Process releases
    const releaseData = processReleases(repo.releases.nodes, year);
    
    // Process languages
    const languages = repo.languages.edges.map((edge: any) => ({
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
      issues: yearlyStats.issues.created,
      prs: yearlyStats.pullRequests.created,
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
          name: repo.owner.name,
        },
        primaryLanguage: repo.primaryLanguage,
        languages,
        topics: repo.repositoryTopics.nodes.map((t: any) => t.topic.name),
        license: repo.licenseInfo?.name,
      },
      stats: {
        stars: {
          total: repo.stargazerCount,
          gained2025: yearlyStats.starsGained2025,
        },
        forks: {
          total: repo.forkCount,
          gained2025: yearlyStats.forks.created2025,
        },
        watchers: repo.watchers.totalCount,
        issues: {
          total: repo.issues.totalCount,
          open: repo.openIssues.totalCount,
          closed: repo.closedIssues.totalCount,
          created2025: yearlyStats.issues.created,
        },
        pullRequests: {
          total: repo.pullRequests.totalCount,
          open: repo.openPRs.totalCount,
          merged: repo.mergedPRs.totalCount,
          created2025: yearlyStats.pullRequests.created,
          merged2025: yearlyStats.pullRequests.merged,
        },
        commits: {
          total2025: yearlyStats.commits.totalThisYear,
          monthly: yearlyStats.commits.monthly,
          weekly: yearlyStats.commits.weekly,
        },
        contributors: {
          total: yearlyStats.contributors.total,
          top: yearlyStats.contributors.top,
        },
      },
      releases: {
        count2025: releaseData.count,
        totalDownloads2025: releaseData.totalDownloads,
        releases: releaseData.releases,
      },
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
