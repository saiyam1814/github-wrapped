/**
 * @typedef {Object} UserProfile
 * @property {string} login
 * @property {string} name
 * @property {string} avatarUrl
 * @property {string} bio
 * @property {string} company
 * @property {string} location
 * @property {string} websiteUrl
 * @property {string} twitterUsername
 * @property {number} followers
 * @property {number} following
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ContributionDay
 * @property {string} date
 * @property {number} contributionCount
 * @property {number} weekday
 * @property {string} color
 */

/**
 * @typedef {Object} HourlyActivity
 * @property {number} hour - 0-23
 * @property {number} day - 0-6 (Sun-Sat)
 * @property {number} count
 */

/**
 * @typedef {Object} LanguageStat
 * @property {string} name
 * @property {string} color
 * @property {number} size
 * @property {number} percentage
 * @property {number} repoCount
 */

/**
 * @typedef {Object} Repository
 * @property {string} name
 * @property {string} owner
 * @property {string} description
 * @property {number} stars
 * @property {number} forks
 * @property {string} language
 * @property {string} languageColor
 * @property {boolean} isPrivate
 * @property {string} createdAt
 * @property {string} pushedAt
 */

/**
 * @typedef {Object} Collaborator
 * @property {string} login
 * @property {string} avatarUrl
 * @property {number} contributions
 */

/**
 * @typedef {Object} ContributionStats
 * @property {number} total
 * @property {number} commits
 * @property {number} pullRequests
 * @property {number} issues
 * @property {number} reviews
 * @property {number} repositoriesContributedTo
 * @property {number} privateContributions
 */

/**
 * @typedef {Object} ActivityStats
 * @property {ContributionDay[]} calendar
 * @property {HourlyActivity[]} hourlyHeatmap
 * @property {number} longestStreak
 * @property {number} currentStreak
 * @property {string} longestStreakStart
 * @property {string} longestStreakEnd
 * @property {string} busiestDay
 * @property {number} busiestDayCount
 * @property {number} busiestHour
 * @property {string} peakMonth
 * @property {number} peakMonthCount
 * @property {string} firstContribution
 * @property {string} lastContribution
 * @property {number} totalActiveDays
 * @property {number} averagePerDay
 * @property {number} averagePerWeek
 * @property {Object} weekdayDistribution
 * @property {Object} monthlyDistribution
 */

/**
 * @typedef {Object} ImpactStats
 * @property {number} totalStars
 * @property {number} starsGained
 * @property {number} totalForks
 * @property {number} forksGained
 * @property {Repository} mostStarredRepo
 * @property {Repository} mostForkedRepo
 * @property {Repository} mostActiveRepo
 * @property {number} totalWatchers
 */

/**
 * @typedef {Object} CollaborationStats
 * @property {number} reviewCount
 * @property {number} reviewToCommitRatio
 * @property {Collaborator[]} topCollaborators
 * @property {string[]} organizationsContributedTo
 * @property {number} externalContributions
 * @property {number} privateVsPublicRatio
 * @property {number} issueComments
 * @property {number} prComments
 */

/**
 * @typedef {Object} PersonalityTrait
 * @property {string} name
 * @property {string} description
 * @property {number} score
 * @property {string} icon
 */

/**
 * @typedef {Object} DeveloperPersonality
 * @property {string} archetype
 * @property {string} title
 * @property {string} emoji
 * @property {string} tagline
 * @property {string} description
 * @property {PersonalityTrait[]} traits
 * @property {string[]} badges
 */

/**
 * @typedef {Object} StoryHighlight
 * @property {string} type
 * @property {string} title
 * @property {string} description
 * @property {*} value
 * @property {string} icon
 * @property {string} color
 */

/**
 * @typedef {Object} DeveloperWrapped
 * @property {string} type
 * @property {number} year
 * @property {UserProfile} user
 * @property {ContributionStats} contributions
 * @property {ActivityStats} activity
 * @property {LanguageStat[]} languages
 * @property {ImpactStats} impact
 * @property {CollaborationStats} collaboration
 * @property {DeveloperPersonality} personality
 * @property {StoryHighlight[]} highlights
 * @property {Repository[]} topRepositories
 */

// Project Types

/**
 * @typedef {Object} ProjectContributor
 * @property {string} login
 * @property {string} avatarUrl
 * @property {number} contributions
 * @property {boolean} isNew
 * @property {string} firstContribution
 */

/**
 * @typedef {Object} PRStats
 * @property {number} opened
 * @property {number} merged
 * @property {number} closed
 * @property {number} avgMergeTimeHours
 * @property {number} medianMergeTimeHours
 * @property {number} avgSize
 * @property {number} largestPR
 */

/**
 * @typedef {Object} IssueStats
 * @property {number} opened
 * @property {number} closed
 * @property {number} avgResponseTimeHours
 * @property {number} medianResponseTimeHours
 * @property {number} withoutResponse
 * @property {number} avgTimeToClose
 */

/**
 * @typedef {Object} ReleaseInfo
 * @property {string} name
 * @property {string} tagName
 * @property {string} publishedAt
 * @property {number} downloads
 */

/**
 * @typedef {Object} HealthMetrics
 * @property {number} busFactor
 * @property {number} maintainerLoadScore
 * @property {number} stalePRs
 * @property {number} staleIssues
 * @property {number} communityScore
 * @property {boolean} hasReadme
 * @property {boolean} hasContributing
 * @property {boolean} hasCodeOfConduct
 * @property {boolean} hasLicense
 */

/**
 * @typedef {Object} ProjectPersonality
 * @property {string} archetype
 * @property {string} title
 * @property {string} emoji
 * @property {string} tagline
 * @property {string} description
 */

/**
 * @typedef {Object} ProjectWrapped
 * @property {string} type
 * @property {number} year
 * @property {Object} repo
 * @property {Object} growth
 * @property {Object} community
 * @property {PRStats} pullRequests
 * @property {IssueStats} issues
 * @property {Object} releases
 * @property {HealthMetrics} health
 * @property {ProjectPersonality} personality
 * @property {StoryHighlight[]} highlights
 */

export const PERSONALITY_ARCHETYPES = {
  NIGHT_OWL: 'night-owl',
  EARLY_BIRD: 'early-bird',
  WEEKEND_WARRIOR: 'weekend-warrior',
  MARATHON_RUNNER: 'marathon-runner',
  POLYGLOT: 'polyglot',
  SPECIALIST: 'specialist',
  OSS_CHAMPION: 'oss-champion',
  CODE_REVIEWER: 'code-reviewer',
  ISSUE_HUNTER: 'issue-hunter',
  PROLIFIC_SHIPPER: 'prolific-shipper',
  ARCHITECT: 'architect',
  MAINTAINER: 'maintainer',
  NIGHT_CODER: 'night-coder',
  CONSISTENT_CONTRIBUTOR: 'consistent-contributor',
};

export const PROJECT_ARCHETYPES = {
  ROCKET_SHIP: 'rocket-ship',
  COMMUNITY_HUB: 'community-hub',
  WORKHORSE: 'workhorse',
  RISING_STAR: 'rising-star',
  HIDDEN_GEM: 'hidden-gem',
  MAINTAINER_HEAVY: 'maintainer-heavy',
  WELL_OILED_MACHINE: 'well-oiled-machine',
};

// Language colors from GitHub
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198ce7',
  Julia: '#a270ba',
  Clojure: '#db5855',
  Erlang: '#B83998',
  OCaml: '#3be133',
  Zig: '#ec915c',
  Nim: '#ffc200',
  Crystal: '#000100',
  default: '#6366f1'
};


