import { NextRequest, NextResponse } from "next/server";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_REST_API = "https://api.github.com";
const CURRENT_YEAR = 2025;

// Minimal GraphQL query for basic repo info only
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
    throw new Error(errorMsg);
  }
  
  return data.data;
}

async function fetchREST(endpoint: string, token: string): Promise<any> {
  try {
    const response = await fetch(`${GITHUB_REST_API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (response.status === 202) {
      // GitHub is computing stats, wait and retry
      await new Promise(r => setTimeout(r, 2000));
      return fetchREST(endpoint, token);
    }
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch {
    return null;
  }
}

// Fetch ALL releases and filter for 2025, calculate total downloads
async function fetchAllReleases2025(owner: string, name: string, token: string) {
  const releases2025: any[] = [];
  let totalDownloads = 0;
  let page = 1;
  const maxPages = 10; // Up to 1000 releases
  
  try {
    while (page <= maxPages) {
      const data = await fetchREST(
        `/repos/${owner}/${name}/releases?per_page=100&page=${page}`,
        token
      );
      
      if (!Array.isArray(data) || data.length === 0) break;
      
      for (const release of data) {
        // Calculate downloads for ALL releases (for total count)
        let releaseDownloads = 0;
        if (release.assets && Array.isArray(release.assets)) {
          for (const asset of release.assets) {
            releaseDownloads += asset.download_count || 0;
          }
        }
        
        // Check if it's a 2025 release
        if (release.published_at) {
          const publishedYear = new Date(release.published_at).getFullYear();
          
          if (publishedYear === CURRENT_YEAR) {
            // Skip prereleases/drafts for the count
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
            
            totalDownloads += releaseDownloads;
            
            releases2025.push({
              name: release.name || release.tag_name,
              tagName: release.tag_name,
              publishedAt: release.published_at,
              downloads: releaseDownloads,
            });
          }
        }
      }
      
      if (data.length < 100) break;
      page++;
    }
  } catch (e) {
    console.error("Error fetching releases:", e);
  }
  
  // Sort by downloads descending
  releases2025.sort((a, b) => b.downloads - a.downloads);
  
  return {
    count: releases2025.length,
    totalDownloads,
    releases: releases2025.slice(0, 10), // Top 10 by downloads
  };
}

// Get PRs created in 2025 using search API
async function getPRsCreated2025(owner: string, name: string, token: string) {
  try {
    const query = `repo:${owner}/${name} is:pr created:2025-01-01..2025-12-31`;
    const data = await fetchREST(
      `/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
      token
    );
    return data?.total_count || 0;
  } catch {
    return 0;
  }
}

// Get PRs merged in 2025
async function getPRsMerged2025(owner: string, name: string, token: string) {
  try {
    const query = `repo:${owner}/${name} is:pr is:merged merged:2025-01-01..2025-12-31`;
    const data = await fetchREST(
      `/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
      token
    );
    return data?.total_count || 0;
  } catch {
    return 0;
  }
}

// Get issues created in 2025
async function getIssuesCreated2025(owner: string, name: string, token: string) {
  try {
    const query = `repo:${owner}/${name} is:issue created:2025-01-01..2025-12-31`;
    const data = await fetchREST(
      `/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
      token
    );
    return data?.total_count || 0;
  } catch {
    return 0;
  }
}

// Get commit count for 2025 using commits API
async function getCommits2025(owner: string, name: string, token: string) {
  try {
    // Use the commits API with since/until parameters
    const response = await fetch(
      `${GITHUB_REST_API}/repos/${owner}/${name}/commits?since=2025-01-01T00:00:00Z&until=2025-12-31T23:59:59Z&per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    if (!response.ok) return 0;
    
    // Get total from Link header
    const linkHeader = response.headers.get("Link");
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    
    // Fallback: count the response
    const data = await response.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

// Get monthly commit data
async function getMonthlyCommits(owner: string, name: string, token: string) {
  const monthlyCommits: Record<string, number> = {};
  
  try {
    // Try stats API first
    const statsData = await fetchREST(`/repos/${owner}/${name}/stats/commit_activity`, token);
    
    if (Array.isArray(statsData)) {
      statsData.forEach((week: any) => {
        if (week && week.week) {
          const date = new Date(week.week * 1000);
          if (date.getFullYear() === CURRENT_YEAR) {
            const monthKey = `${CURRENT_YEAR}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCommits[monthKey] = (monthlyCommits[monthKey] || 0) + (week.total || 0);
          }
        }
      });
    }
  } catch {
    // Ignore
  }
  
  return monthlyCommits;
}

async function getContributors(owner: string, name: string, token: string) {
  try {
    // Get contributor count from header
    const response = await fetch(
      `${GITHUB_REST_API}/repos/${owner}/${name}/contributors?per_page=1&anon=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    let totalCount = 0;
    const linkHeader = response.headers.get("Link");
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) {
        totalCount = parseInt(match[1], 10);
      }
    }
    
    // Fetch top contributors
    const topData = await fetchREST(`/repos/${owner}/${name}/contributors?per_page=10`, token);
    const top = Array.isArray(topData) ? topData.map((c: any) => ({
      login: c.login,
      avatarUrl: c.avatar_url,
      contributions: c.contributions,
    })) : [];
    
    return {
      total: totalCount || top.length,
      top,
    };
  } catch {
    return { total: 0, top: [] };
  }
}

function classifyProjectPersonality(data: any) {
  const { stars, forks, contributors, releases, commits, prs } = data;
  
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
    traits.push({ name: "Community Driven", description: `${contributors}+ contributors`, icon: "👥" });
  }
  
  if (releases >= 10) {
    traits.push({ name: "Active Releaser", description: `${releases} releases`, icon: "📦" });
  }
  
  if (commits >= 500) {
    traits.push({ name: "Highly Active", description: `${commits}+ commits`, icon: "⚡" });
  }
  
  if (prs >= 200) {
    traits.push({ name: "PR Magnet", description: `${prs}+ PRs`, icon: "🔄" });
  }
  
  if (forks >= 500) {
    traits.push({ name: "Fork Magnet", description: `${forks}+ forks`, icon: "🍴" });
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
    "growing-project": {
      title: "Growing Project",
      emoji: "🌱",
      tagline: "Every great project started somewhere",
      description: "Building momentum and laying the foundation.",
    },
  };
  
  return {
    archetype,
    ...(archetypeDetails[archetype] || archetypeDetails["growing-project"]),
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
    // Fetch basic repo data via GraphQL
    const graphqlData = await graphql(REPOSITORY_QUERY, { owner, name }, token);
    
    if (!graphqlData.repository) {
      return NextResponse.json({ error: `Repository "${owner}/${name}" not found` }, { status: 404 });
    }
    
    const repo = graphqlData.repository;
    
    // Fetch all 2025 stats in parallel via REST API
    const [
      releaseData,
      prsCreated,
      prsMerged,
      issuesCreated,
      commits2025,
      monthlyCommits,
      contributors,
    ] = await Promise.all([
      fetchAllReleases2025(owner, name, token),
      getPRsCreated2025(owner, name, token),
      getPRsMerged2025(owner, name, token),
      getIssuesCreated2025(owner, name, token),
      getCommits2025(owner, name, token),
      getMonthlyCommits(owner, name, token),
      getContributors(owner, name, token),
    ]);
    
    // Process languages
    const languages = (repo.languages?.edges || []).map((edge: any) => ({
      name: edge.node.name,
      color: edge.node.color,
      percentage: repo.languages.totalSize > 0 
        ? ((edge.size / repo.languages.totalSize) * 100).toFixed(1) 
        : "0",
    }));
    
    // Calculate total commits from monthly if direct count failed
    const monthlyTotal = Object.values(monthlyCommits).reduce((a: number, b: any) => a + (b || 0), 0);
    const finalCommits = commits2025 > 0 ? commits2025 : monthlyTotal;
    
    // Calculate project personality
    const personality = classifyProjectPersonality({
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      contributors: contributors.total,
      releases: releaseData.count,
      commits: finalCommits,
      prs: prsCreated,
    });
    
    // Build response with all numbers as actual numbers (not NaN)
    const wrappedData = {
      type: "project",
      year: CURRENT_YEAR,
      repository: {
        name: repo.name,
        nameWithOwner: repo.nameWithOwner,
        description: repo.description || "",
        url: repo.url,
        createdAt: repo.createdAt,
        owner: {
          login: repo.owner.login,
          avatarUrl: repo.owner.avatarUrl,
          name: repo.owner.login,
        },
        primaryLanguage: repo.primaryLanguage,
        languages,
        topics: (repo.repositoryTopics?.nodes || []).map((t: any) => t.topic.name),
        license: repo.licenseInfo?.name || null,
      },
      stats: {
        stars: {
          total: repo.stargazerCount || 0,
          gained2025: 0,
        },
        forks: {
          total: repo.forkCount || 0,
          gained2025: 0,
        },
        watchers: repo.watchers?.totalCount || 0,
        issues: {
          total: 0,
          open: 0,
          closed: 0,
          created2025: issuesCreated || 0,
        },
        pullRequests: {
          total: 0,
          open: 0,
          merged: 0,
          created2025: prsCreated || 0,
          merged2025: prsMerged || 0,
        },
        commits: {
          total2025: finalCommits || 0,
          monthly: monthlyCommits,
          weekly: [],
        },
        contributors: {
          total: contributors.total || 0,
          top: contributors.top || [],
        },
      },
      releases: {
        count2025: releaseData.count || 0,
        totalDownloads2025: releaseData.totalDownloads || 0,
        releases: releaseData.releases || [],
      },
      activity: {
        monthlyCommits,
        weeklyCommits: [],
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
