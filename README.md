# 🎁 GitHub Wrapped 2025

> Your year in code, beautifully wrapped. A Spotify Wrapped-style experience for your GitHub activity.

Users just enter their GitHub username—no token required!

## ✨ Features

### 🎯 Simple Experience
- **No token required** - Just enter a GitHub username
- **Server-side data fetching** - Secure token management
- **Works for any public profile** - Any GitHub user can get their wrapped

### 📊 Deep Insights

- 📈 Total contributions breakdown (commits, PRs, issues, reviews)
- 🔥 Streak analysis with longest and current streaks
- 💻 Language distribution and usage
- ⏰ Activity patterns (busiest day, peak hours, peak month)
- ⭐ Impact metrics (stars, forks, top repos)
- 🎭 Developer personality classification

### 🎬 Storytelling Experience
- Scroll-based narrative slides
- Smooth animations with Framer Motion
- Auto-advancing with manual controls
- Keyboard navigation (← → arrows)

### 📤 Shareable Cards
- Download beautiful summary cards as PNG
- Share directly to Twitter
- Custom stats visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A GitHub Personal Access Token (server-side only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/github-wrapped.git
cd github-wrapped

# Install dependencies
npm install

# Set up environment variable
# Create a .env.local file with:
# GITHUB_TOKEN=your_github_token_here

# Start development server
npm run dev
```

### Setting Up the GitHub Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Create a new token with these scopes:
   - `read:user` - Read user profile data
   - `repo` - Access public repository data
3. Create a `.env.local` file in the project root:

```env
GITHUB_TOKEN=ghp_your_token_here
```

**Important:** This token is used server-side only. Users never need to provide their own token.

## 🏗️ Project Structure

```
src/app/
├── page.tsx                    # Landing page (username input)
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout
├── api/
│   └── wrapped/
│       └── route.ts            # Server-side GitHub API
└── wrapped/[username]/
    ├── page.tsx                # Wrapped experience
    ├── utils.ts                # Types & demo data
    └── slides/
        ├── IntroSlide.tsx
        ├── ContributionsSlide.tsx
        ├── StreakSlide.tsx
        ├── LanguagesSlide.tsx
        ├── ActivitySlide.tsx
        ├── ImpactSlide.tsx
        ├── PersonalitySlide.tsx
        └── SummarySlide.tsx
```

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| API | GitHub GraphQL |
| Icons | Lucide React |
| Image Export | html2canvas |
| Effects | canvas-confetti |

## 🎭 Developer Personalities

Based on coding patterns, users are classified as:

| Archetype | Criteria |
|-----------|----------|
| 🏃 Marathon Runner | Long contribution streaks (30+ days) |
| 🌍 Polyglot | Fluent in 4+ languages |
| 🎯 Specialist | 70%+ in one language |
| 🚀 Prolific Shipper | 1000+ commits |
| 🛡️ Guardian | High code review activity |
| ⭐ Maintainer | 100+ stars across repos |
| 🔨 Builder | Default - Building great things |

## 🔐 Privacy & Security

- **Server-side token** - Your GitHub token is never exposed to users
- **Read-only access** - Only public profile data is accessed
- **No storage** - User data is fetched on-demand, never stored
- **Open source** - Full code transparency

## 📦 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a Pull Request

## 📄 License

MIT © 2025

---

<p align="center">
  Built with 💜 for the developer community
</p>
