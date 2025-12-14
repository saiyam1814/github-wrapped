import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// We use a dedicated client to ensure we only read what we need.
// For the "Wrapped" generator, we need a token.
export const octokit = new Octokit({ auth: GITHUB_TOKEN });

const WRAPPED_QUERY = `
query ($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    name
    login
    avatarUrl
    createdAt
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
            weekday
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        name
        stargazers {
          totalCount
        }
        primaryLanguage {
          name
          color
        }
        languages(first: 5) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

export async function fetchGitHubData(username: string, year: number, token?: string) {
    const auth = token || GITHUB_TOKEN;
    if (!auth) {
        console.warn("No GITHUB_TOKEN found. Rate limits will be strict.");
    }

    // Re-instantiate octokit for this request if token is provided
    const client = token ? new Octokit({ auth: token }) : octokit;

    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    try {
        const response: any = await client.graphql(WRAPPED_QUERY, {
            username,
            from,
            to,
        });
        return response.user;
    } catch (error) {
        console.error("GitHub API Error", error);
        throw new Error(`Failed to fetch data for ${username}`);
    }
}
