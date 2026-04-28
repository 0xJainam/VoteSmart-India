# 🗳️ VoteSmart India — Interactive Voter Education Platform

> **PromptWars Hackathon Entry** | Built with Next.js 15, Gemini 2.0 Flash, Google Maps & Cloud Translation

## 🎯 Problem Statement

First-time voters in India face a critical knowledge gap. With 900+ million eligible voters, many don't understand the registration process, how EVMs work, or what VVPAT verification means. Traditional voter education is passive — pamphlets and PDFs that nobody reads.

**VoteSmart solves this through active, gamified learning.**

## 🚀 What Makes This Different

### 1. Voter Training RPG — Not a Wikipedia Clone
Instead of passive reading, users **earn EXP and badges** by completing election steps, taking quizzes, and practicing on the EVM simulator. This transforms civic education from a chore into an engaging experience.

### 2. Interactive EVM Simulator
A **pure CSS replica** of India's Electronic Voting Machine with:
- Blue tactile vote buttons with red light + beep simulation
- VVPAT paper slip animation (7-second countdown, just like real life)
- Digital ink mark on your avatar after voting — a visual badge of honor

### 3. Contextual AI Assistant (Gemini 2.0 Flash)
The AI assistant **changes its expertise** based on your current step. On the Registration step, it's a registration expert. On Polling Day, it knows EVM procedures. This isn't a generic chatbot — it's a contextual tutor.

### 4. Active Recall via Step-Specific Quizzes
Each timeline step has a rapid-fire quiz (+25 EXP per correct answer). Questions are based on real ECI procedures, not trivia. Explanations cite official sources.

### 5. Five-Language Support
English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Telugu (తెలుగు) — via Google Cloud Translation API, ensuring accessibility across India's linguistic diversity.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client Browser                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────┐  │
│  │ Timeline │ │ EVM Sim  │ │   Chat Panel    │  │
│  │ + Quiz   │ │ (CSS)    │ │ (aria-live)     │  │
│  └────┬─────┘ └──────────┘ └────────┬────────┘  │
│       │                              │           │
│       └──────────┐   ┌───────────────┘           │
│                  │   │                           │
├──────────────────┼───┼───────────────────────────┤
│            Next.js Server (API Routes)           │
│  ┌───────────────┼───┼────────────────────────┐  │
│  │ sanitizeInput()   │   Input Sanitization   │  │
│  │               │   │                        │  │
│  │  /api/chat ───┘   └── /api/translate       │  │
│  │  (Gemini 2.0)         (Cloud Translation)  │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  API Keys: process.env only (never in bundle)     │
└───────────────────────────────────────────────────┘
```

## 🔐 Security

- **Zero client-side API keys** — All Google API calls via server-side routes
- **Input sanitization** — 6-stage pipeline (HTML strip, entity decode, control chars, injection patterns, whitespace collapse, length limit)
- **Prompt injection defense** — Known LLM attack patterns stripped before reaching Gemini
- **Step ID whitelist** — Prevents arbitrary system prompt manipulation

## ♿ Accessibility

- `aria-live="polite"` on chat — screen readers announce AI responses
- Full keyboard navigation (Tab, Arrow, Enter, Escape)
- Skip-to-content link
- WCAG AA contrast ratios verified (Navy/Ivory 15.8:1, Saffron/Navy 8.7:1)
- `prefers-reduced-motion` respected
- Semantic HTML throughout (`<nav>`, `<main>`, `<aside>`, `<article>`)

## 🧪 Testing

```bash
npm test
```

Unit tests cover:
- Input sanitization (XSS, injection, length limits)
- Quiz data integrity
- Prompt generation per step

## 📦 Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure API keys
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Server Components, API Routes |
| Language | TypeScript (Strict) | Zero `any` types |
| Styling | Tailwind CSS | Utility-first, zero runtime |
| AI | Gemini 2.0 Flash (REST) | Structured JSON responses |
| Maps | Google Maps Embed API | Free, zero-JS iframe |
| i18n | Google Cloud Translation v2 | 5 Indian languages |
| Testing | Vitest + RTL | Fast, lightweight |

**Repository size: < 10MB** (no local assets, no heavy SDKs)

---

*Built with ❤️ for Indian democracy*
