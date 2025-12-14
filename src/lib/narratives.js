/**
 * Narrative Copy Generator
 * Creates compelling storytelling text for each slide
 */

// ============================================================================
// DEVELOPER NARRATIVES
// ============================================================================

export const developerNarratives = {
  intro: {
    greeting: (name) => `Hey, ${name}! 👋`,
    subtitle: "It's time to unwrap your year in code",
    cta: "Let's see what you built →",
    year: (year) => `Your ${year} GitHub Wrapped`,
  },

  contributions: {
    headline: (count) => {
      if (count >= 5000) return "You're a force of nature";
      if (count >= 2000) return "You've been absolutely crushing it";
      if (count >= 1000) return "Now that's commitment";
      if (count >= 500) return "Solid year of shipping";
      if (count >= 100) return "Every contribution counts";
      return "You showed up";
    },
    
    body: (count, avgPerDay) => {
      if (count >= 5000) {
        return `${count.toLocaleString()} contributions. That's ${avgPerDay} every single day you coded. Your keyboard probably needs therapy.`;
      }
      if (count >= 2000) {
        return `${count.toLocaleString()} contributions. That's more than most developers make in years. You didn't just write code—you built the future.`;
      }
      if (count >= 1000) {
        return `${count.toLocaleString()} contributions. That's real, consistent output. Each commit brought you closer to your goals.`;
      }
      if (count >= 500) {
        return `${count.toLocaleString()} contributions. Week after week, you showed up and shipped. That's what separates builders from dreamers.`;
      }
      return `${count.toLocaleString()} contributions. Quality over quantity—every line of code tells your story.`;
    },
    
    breakdown: (commits, prs, issues, reviews) => 
      `${commits.toLocaleString()} commits · ${prs} PRs · ${issues} issues · ${reviews} reviews`,
  },

  streak: {
    headline: (days) => {
      if (days >= 100) return "Legendary dedication";
      if (days >= 60) return "Unbreakable focus";
      if (days >= 30) return "Marathon mode activated";
      if (days >= 14) return "Building momentum";
      if (days >= 7) return "Streak started";
      return "Consistency loading...";
    },
    
    body: (days, startDate, endDate) => {
      if (days >= 100) {
        return `${days} consecutive days of contributions. That's over 3 months of pure dedication. From ${startDate} to ${endDate}, you never missed a beat.`;
      }
      if (days >= 60) {
        return `${days} days straight. Two months of relentless coding. You've proven that you can sustain excellence.`;
      }
      if (days >= 30) {
        return `${days} consecutive days. A full month of daily contributions. Most people can't stick with anything for a week.`;
      }
      if (days >= 14) {
        return `${days} days in a row. Two weeks of consistent output. This is where habits are forged.`;
      }
      return `Your longest streak was ${days} days. Every streak starts somewhere. Keep building.`;
    },
    
    encouragement: (currentStreak) => 
      currentStreak > 0 
        ? `🔥 Current streak: ${currentStreak} days. Keep it alive!`
        : "Ready to start your next streak?",
  },

  activity: {
    busiestDay: (day, count) => 
      `${day}s are your power day—${count.toLocaleString()} contributions on that day alone.`,
    
    peakMonth: (month, count) => 
      `${month} was your peak month with ${count.toLocaleString()} contributions.`,
    
    weekendWarrior: (ratio) => 
      `${(ratio * 100).toFixed(0)}% of your work happened on weekends. Some call it obsession. We call it passion.`,
    
    schedule: (busiestHour) => {
      const hour = busiestHour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      
      if (hour >= 22 || hour < 4) {
        return `Peak coding hours: ${displayHour}${period}. The night is your canvas. 🌙`;
      }
      if (hour >= 5 && hour < 9) {
        return `Peak coding hours: ${displayHour}${period}. Early bird catches the merge. ☀️`;
      }
      if (hour >= 9 && hour < 17) {
        return `Peak coding hours: ${displayHour}${period}. Business hours, business results. 💼`;
      }
      return `Peak coding hours: ${displayHour}${period}. Evening vibes, killer code. 🌆`;
    },
  },

  languages: {
    headline: (topLang) => `${topLang} is your language`,
    
    polyglot: (count) => 
      `You wrote meaningful code in ${count} different languages. A true polyglot—solving problems with the right tool, every time.`,
    
    specialist: (lang, percentage) => 
      `${percentage}% ${lang}. You've chosen your weapon and mastered it. Depth over breadth.`,
    
    topLanguage: (lang, percentage, repoCount) => 
      `${lang} appears in ${repoCount} of your repositories (${percentage}% of total code)`,
  },

  collaboration: {
    headline: (external, reviews) => {
      if (external >= 20) return "Open source legend";
      if (reviews >= 50) return "Guardian of quality";
      if (external >= 5) return "Community contributor";
      return "Building together";
    },
    
    ossContrib: (count, repos) => 
      `You contributed ${count} times to ${repos} repositories you don't own. That's the open source spirit in action.`,
    
    reviews: (count, ratio) => 
      `${count} code reviews with a ${ratio}:1 review-to-commit ratio. Your team's quality guardian.`,
    
    prStats: (merged, rate) => 
      `${merged} PRs merged with a ${rate}% success rate. You know how to ship code that gets approved.`,
  },

  impact: {
    headline: (stars) => {
      if (stars >= 1000) return "Stargazer magnet";
      if (stars >= 100) return "Rising star";
      if (stars >= 10) return "Getting noticed";
      return "Building your legacy";
    },
    
    stars: (total) => 
      `${total.toLocaleString()} stars across your repositories. Developers around the world are watching your work.`,
    
    topRepo: (name, stars) => 
      `${name} leads with ${stars.toLocaleString()} stars. Your flagship project.`,
    
    forks: (total) => 
      `${total.toLocaleString()} forks. Your code is being built upon.`,
  },

  personality: {
    intro: "Based on your coding patterns, you are...",
    reveal: (title, emoji) => `${title} ${emoji}`,
  },

  summary: {
    headline: "That's a wrap! 🎬",
    body: (year) => `${year} was your year. Every commit, every review, every line of code—it all added up to something meaningful.`,
    cta: "Share your journey",
  },
};

// ============================================================================
// PROJECT NARRATIVES
// ============================================================================

export const projectNarratives = {
  intro: {
    greeting: (name) => `${name}`,
    subtitle: "Your project's year in review",
    year: (year) => `${year} Wrapped`,
  },

  growth: {
    headline: (stars) => {
      if (stars >= 10000) return "Absolute phenomenon";
      if (stars >= 1000) return "Community favorite";
      if (stars >= 100) return "Growing steadily";
      return "Building momentum";
    },
    
    stars: (current, gained) => 
      gained > 0 
        ? `${current.toLocaleString()} total stars, with ${gained.toLocaleString()} earned this year.`
        : `${current.toLocaleString()} stars and counting.`,
  },

  community: {
    headline: (contributors) => {
      if (contributors >= 100) return "Thriving community";
      if (contributors >= 20) return "Growing together";
      return "Building the foundation";
    },
    
    contributors: (count) => 
      `${count} developers have contributed to this project. Each one making it better.`,
  },

  velocity: {
    headline: (prs) => {
      if (prs >= 100) return "High velocity";
      if (prs >= 20) return "Steady progress";
      return "Focused development";
    },
    
    prs: (opened, merged, rate) => 
      `${opened} PRs opened, ${merged} merged. ${rate}% merge rate.`,
    
    mergeTime: (hours) => {
      if (hours < 24) return `Average merge time: ${hours} hours. Fast-moving team.`;
      if (hours < 168) return `Average merge time: ${Math.round(hours / 24)} days. Thorough reviews.`;
      return `Average merge time: ${Math.round(hours / 168)} weeks. Careful consideration.`;
    },
  },

  health: {
    headline: (score) => {
      if (score >= 80) return "Excellent health";
      if (score >= 60) return "Healthy project";
      if (score >= 40) return "Room to grow";
      return "Needs attention";
    },
    
    busFactor: (factor) => {
      if (factor >= 5) return "Well-distributed knowledge. No single point of failure.";
      if (factor >= 3) return "Good distribution across core maintainers.";
      if (factor >= 2) return "Knowledge shared between key contributors.";
      return "Consider spreading knowledge to more contributors.";
    },
  },

  releases: {
    headline: (count) => {
      if (count >= 20) return "Shipping machine";
      if (count >= 5) return "Consistent releases";
      if (count >= 1) return "Delivering value";
      return "Ready to release";
    },
    
    summary: (count, downloads) => 
      `${count} releases with ${downloads.toLocaleString()} total downloads.`,
  },

  summary: {
    headline: "Wrapped! 🎉",
    body: "This project had an incredible year. Every contributor, every issue, every PR made it what it is today.",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatMonth(monthStr) {
  const months = {
    '01': 'January', '02': 'February', '03': 'March',
    '04': 'April', '05': 'May', '06': 'June',
    '07': 'July', '08': 'August', '09': 'September',
    '10': 'October', '11': 'November', '12': 'December',
  };
  const [year, month] = monthStr.split('-');
  return months[month] || monthStr;
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
}

export function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}


