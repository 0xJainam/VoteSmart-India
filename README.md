# 🗳️ VoteSmart India — Interactive Voter Education Platform

> **PromptWars Hackathon Entry** | Next.js 15 Static Export · Gemini 2.0 Flash · Google Maps · Firebase Hosting

🌐 **Live Demo:** [https://votesmart-india-78563.web.app](https://votesmart-india-78563.web.app)

---

## 🎯 Problem Statement

First-time voters in India face a critical knowledge gap. With 900+ million eligible voters, many don't understand the registration process, how EVMs work, or what VVPAT verification means. Traditional voter education is passive — pamphlets and PDFs that nobody reads.

**VoteSmart solves this through active, gamified learning.**

## 🚀 What Makes This Different

### 1. Voter Training RPG — Not a Wikipedia Clone
Users **earn EXP and badges** by completing election steps, taking quizzes, and practicing on the EVM simulator. Progress persists via `localStorage` — no database needed.

### 2. Interactive EVM Simulator
A **pure CSS replica** of India's Electronic Voting Machine with:
- Blue tactile vote buttons with red light + beep simulation
- VVPAT paper slip animation (7-second countdown, just like real life)
- Digital ink mark on your avatar after voting — a visual badge of honor

### 3. Contextual AI Assistant (Gemini 2.0 Flash)
The AI assistant **changes its expertise** based on your current timeline step. On Registration, it's a registration expert. On Polling Day, it knows EVM procedures. This isn't a generic chatbot — it's a **contextual tutor** powered by the `@google/generative-ai` SDK.

### 4. Active Recall via Step-Specific Quizzes
Each timeline step has a rapid-fire quiz (+25 EXP per correct answer). Questions are based on real ECI procedures. Explanations cite official sources.

### 5. Five-Language Support
English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Telugu (తెలుగు) — ensuring accessibility across India's linguistic diversity.

## 🏗️ Architecture — High-Performance Static Export

This app is a **fully static Next.js export** — no server required. It deploys to Firebase Hosting (Spark/Free plan) as pure HTML/CSS/JS.

```
┌─────────────────────────────────────────────────┐
│                  Client Browser                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │ Timeline │ │ EVM Sim  │ │   Chat Panel    │  │
│  │ + Quiz   │ │ (CSS)    │ │ (Gemini SDK)    │  │
│  └──────────┘ └──────────┘ └─────────────────┘  │
│                                                   │
│  @google/generative-ai SDK ──► Gemini 2.0 Flash  │
│  Google Maps Embed API     ──► iframe (free)     │
│  localStorage              ──► User RPG state    │
│                                                   │
│  sanitizeInput() runs client-side before AI call │
│  API keys: NEXT_PUBLIC_ env vars (build-time)    │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────┐
│  Firebase Hosting  │
│  (Spark Free Plan) │
│  Serves /out as    │
│  static files      │
└───────────────────┘
```

### Why Static Export?
- **Zero server costs** — Firebase Spark (free) plan
- **Global CDN** — Firebase Hosting serves from edge locations
- **Instant deploys** — `firebase deploy` pushes pre-built HTML
- **No cold starts** — Everything is pre-rendered

## 🔐 Security & Reliability

- **Input sanitization** — 6-stage pipeline (HTML strip, entity decode, control chars, injection patterns, whitespace collapse, length limit) runs client-side before every AI call.
- **Prompt injection defense** — Known LLM attack patterns stripped before reaching Gemini.
- **API key restriction** — Restrict `NEXT_PUBLIC_` keys to your domain in Google Cloud Console.
- **Resilient AI Calling** — Built-in exponential backoff for 429 rate limits, UI button throttling, and history array safety nets ensure robust performance even on the free Gemini tier.

## ♿ Accessibility

- `aria-live="polite"` on chat — screen readers announce AI responses
- Full keyboard navigation (Tab, Arrow, Enter, Escape)
- Skip-to-content link
- WCAG AA contrast ratios (Navy/Ivory 15.8:1)
- `prefers-reduced-motion` respected
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `role="region"`)

## 🧪 Testing

```bash
npm test
```

The application features a robust testing strategy using **Vitest** and **React Testing Library**:
- **EVMSimulator Tests**: Simulates mounting, voting, and verifying the VVPAT timeout animations and gamification rewards.
- **ChatPanel Tests**: Verifies API resilience by mocking the Gemini SDK and asserting that rate limit errors (429s) are handled gracefully without application crashes.
- **Sanitization Tests**: Unit tests cover input sanitization (XSS, injection, length limits).
- **Automated CI**: A GitHub Actions workflow runs the test suite on every push to `main`.

## 🧹 Code Quality
- **Strict TypeScript**: Zero implicit `any` types. All configurations and states are backed by strict interfaces (e.g. `UserState`, `Candidate`).
- **JSDoc Documentation**: Comprehensive JSDoc block comments on all key components and utility functions for superior maintainability.
- **Custom Hooks**: Complex state management for the EVM (`useEVM`) and Gemini Chat (`useChat`) is isolated into headless hooks to minimize cyclomatic complexity.
- **Modular Components**: Large views like the `Dashboard` and `EVMSimulator` are split into atomic, single-responsibility child components.

## 📦 Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure API keys
cp .env.example .env.local
# Edit .env.local with your keys:
#   NEXT_PUBLIC_GEMINI_API_KEY=...
#   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# 3. Build static export
npm run build

# 4. Deploy to Firebase
firebase deploy
```

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (Static Export) | Zero server, pre-rendered HTML |
| Language | TypeScript (Strict) | Zero `any` types |
| Styling | Tailwind CSS | Utility-first, zero runtime |
| AI | Gemini 2.0 Flash (`@google/generative-ai`) | Client-side SDK, structured JSON |
| Maps | Google Maps Embed API | Free, zero-JS iframe |
| Auth | Firebase Auth (Google Sign-In) | Free tier |
| Hosting | Firebase Hosting (Spark) | Free, global CDN |
| Testing | Vitest | Fast, lightweight |

**Repository size: < 10MB** — no local assets, no heavy SDKs.

---

*Built with ❤️ for Indian democracy*
