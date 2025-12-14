/**
 * GitHub API Client with comprehensive GraphQL queries
 * for Developer, Repository, and Organization Wrapped
 */

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GITHUB_REST_API = "https://api.github.com";

/**
 * Execute a GraphQL query against GitHub API
 */
async function graphql(query, variables, token) {
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
    console.error("GraphQL Errors:", data.errors);
    throw new Error(data.errors[0]?.message || "GraphQL query failed");
  }
  
  return data.data;
}

/**
 * Execute a REST API call
 */
async function rest(endpoint, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  const response = await fetch(`${GITHUB_REST_API}${endpoint}`, { headers });
  
  if (!response.ok) {
    throw new Error(`REST API error: ${response.status}`);
  }
  
  return response.json();
}

// ============================================================================
// DEVELOPER WRAPPED - COMPREHENSIVE QUERY
// ============================================================================

const DEVELOPER_QUERY = `
query DeveloperWrapped($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    company
    location
    websiteUrl
    twitterUsername
    createdAt
    followers { totalCount }
    following { totalCount }
    
    # Contribution Statistics
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
      restrictedContributionsCount
      
      # Full contribution calendar for heatmap
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
            color
          }
        }
      }
      
      # Commits by repository
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          nameWithOwner
          owner { login }
          isPrivate
          isFork
          stargazerCount
          forkCount
          primaryLanguage { name color }
          description
          createdAt
          pushedAt
        }
        contributions {
          totalCount
        }
      }
      
      # PRs by repository
      pullRequestContributionsByRepository(maxRepositories: 50) {
        repository {
          name
          nameWithOwner
          owner { login }
          isPrivate
        }
        contributions {
          totalCount
        }
      }
      
      # Issues by repository  
      issueContributionsByRepository(maxRepositories: 50) {
        repository {
          name
          nameWithOwner
          owner { login }
        }
        contributions {
          totalCount
        }
      }
      
      # Reviews by repository
      pullRequestReviewContributionsByRepository(maxRepositories: 50) {
        repository {
          name
          nameWithOwner
          owner { login }
        }
        contributions {
          totalCount
        }
      }
    }
    
    # User's repositories for impact analysis
    repositories(
      first: 100
      ownerAffiliations: OWNER
      orderBy: { field: STARGAZERS, direction: DESC }
      isFork: false
    ) {
      totalCount
      nodes {
        name
        nameWithOwner
        description
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
        createdAt
        pushedAt
        isPrivate
        isFork
        isArchived
        
        # Recent activity
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
      }
    }
    
    # Pull requests for collaboration analysis
    pullRequests(
      first: 100
      orderBy: { field: CREATED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        createdAt
        mergedAt
        closedAt
        state
        additions
        deletions
        changedFiles
        repository {
          nameWithOwner
          owner { login }
          isPrivate
        }
        reviews(first: 5) {
          totalCount
        }
        comments {
          totalCount
        }
      }
    }
    
    # Issues authored
    issues(
      first: 100
      orderBy: { field: CREATED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        createdAt
        closedAt
        state
        repository {
          nameWithOwner
          owner { login }
        }
        comments {
          totalCount
        }
      }
    }
    
    # Organizations
    organizations(first: 20) {
      nodes {
        login
        name
        avatarUrl
      }
    }
    
    # Starred repos (for interest analysis)
    starredRepositories(first: 20, orderBy: { field: STARRED_AT, direction: DESC }) {
      totalCount
      nodes {
        nameWithOwner
        primaryLanguage { name }
        stargazerCount
      }
    }
  }
  
  # Rate limit info
  rateLimit {
    remaining
    resetAt
  }
}
`;

// ============================================================================
// REPOSITORY WRAPPED - COMPREHENSIVE QUERY
// ============================================================================

const REPOSITORY_QUERY = `
query RepositoryWrapped($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    nameWithOwner
    description
    url
    homepageUrl
    createdAt
    pushedAt
    isPrivate
    isFork
    isArchived
    
    # Stars & Forks
    stargazerCount
    forkCount
    watchers { totalCount }
    
    # Primary Language
    primaryLanguage { name color }
    
    # All Languages
    languages(first: 15, orderBy: { field: SIZE, direction: DESC }) {
      edges {
        size
        node { name color }
      }
      totalSize
    }
    
    # License
    licenseInfo { name spdxId }
    
    # Topics
    repositoryTopics(first: 20) {
      nodes {
        topic { name }
      }
    }
    
    # Contributors (mentionable users)
    mentionableUsers(first: 100) {
      totalCount
      nodes {
        login
        avatarUrl
        name
      }
    }
    
    # Pull Requests
    pullRequests(first: 100, states: [OPEN, MERGED, CLOSED], orderBy: { field: CREATED_AT, direction: DESC }) {
      totalCount
      nodes {
        number
        title
        state
        createdAt
        mergedAt
        closedAt
        additions
        deletions
        changedFiles
        author { login avatarUrl }
        reviews { totalCount }
        comments { totalCount }
        labels(first: 5) {
          nodes { name color }
        }
      }
    }
    
    # Open PRs
    openPRs: pullRequests(states: [OPEN]) {
      totalCount
    }
    
    # Merged PRs
    mergedPRs: pullRequests(states: [MERGED]) {
      totalCount
    }
    
    # Issues
    issues(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
      totalCount
      nodes {
        number
        title
        state
        createdAt
        closedAt
        author { login avatarUrl }
        comments { totalCount }
        labels(first: 5) {
          nodes { name color }
        }
        reactions { totalCount }
      }
    }
    
    # Open Issues
    openIssues: issues(states: [OPEN]) {
      totalCount
    }
    
    # Closed Issues
    closedIssues: issues(states: [CLOSED]) {
      totalCount
    }
    
    # Releases
    releases(first: 50, orderBy: { field: CREATED_AT, direction: DESC }) {
      totalCount
      nodes {
        name
        tagName
        publishedAt
        description
        isPrerelease
        isDraft
        releaseAssets(first: 10) {
          nodes {
            name
            downloadCount
          }
        }
        author { login }
      }
    }
    
    # Recent Commits
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(first: 100) {
            totalCount
            nodes {
              oid
              message
              committedDate
              additions
              deletions
              author {
                user { login avatarUrl }
                name
                email
              }
            }
          }
        }
      }
    }
    
    # Community Profile
    hasIssuesEnabled
    hasWikiEnabled
    hasDiscussionsEnabled
    
    # README
    readme: object(expression: "HEAD:README.md") {
      ... on Blob { text }
    }
    
    # Contributing Guide
    contributing: object(expression: "HEAD:CONTRIBUTING.md") {
      ... on Blob { text }
    }
    
    # Code of Conduct
    codeOfConduct { name }
  }
  
  rateLimit {
    remaining
    resetAt
  }
}
`;

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

export async function fetchDeveloperData(username, year, token) {
  if (!token) {
    throw new Error("GitHub token is required for developer stats");
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const data = await graphql(DEVELOPER_QUERY, { login: username, from, to }, token);
  
  if (!data.user) {
    throw new Error(`User "${username}" not found`);
  }

  return data;
}

export async function fetchRepositoryData(owner, name, token) {
  const data = await graphql(REPOSITORY_QUERY, { owner, name }, token);
  
  if (!data.repository) {
    throw new Error(`Repository "${owner}/${name}" not found`);
  }

  return data;
}

/**
 * Fetch additional REST API data for stars history (if needed)
 */
export async function fetchStarHistory(owner, name, token) {
  try {
    // Note: This requires iterating through stargazers with accept header
    // For MVP, we'll skip detailed star history
    return [];
  } catch (e) {
    console.warn("Could not fetch star history:", e);
    return [];
  }
}

/**
 * Fetch contributor stats via REST API
 */
export async function fetchContributorStats(owner, name, token) {
  try {
    const stats = await rest(`/repos/${owner}/${name}/stats/contributors`, token);
    return stats || [];
  } catch (e) {
    console.warn("Could not fetch contributor stats:", e);
    return [];
  }
}

/**
 * Fetch commit activity via REST API  
 */
export async function fetchCommitActivity(owner, name, token) {
  try {
    const activity = await rest(`/repos/${owner}/${name}/stats/commit_activity`, token);
    return activity || [];
  } catch (e) {
    console.warn("Could not fetch commit activity:", e);
    return [];
  }
}

/**
 * Fetch punch card (hourly activity) via REST API
 */
export async function fetchPunchCard(owner, name, token) {
  try {
    const punchCard = await rest(`/repos/${owner}/${name}/stats/punch_card`, token);
    return punchCard || [];
  } catch (e) {
    console.warn("Could not fetch punch card:", e);
    return [];
  }
}

export { graphql, rest };


