# 🗳️ Election Process Education Assistant

> **A production-grade, AI-powered platform designed to empower 900+ million Indian citizens with knowledge about their democratic rights and the electoral process.**

[![Production Deployment](https://img.shields.io/badge/Status-Live--Production-green?style=for-the-badge&logo=google-cloud)](https://election-assistant.vercel.app)
[![Gemini 1.5 Flash](https://img.shields.io/badge/AI-Gemini--1.5--Flash-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev)
[![Firebase Stack](https://img.shields.io/badge/Backend-Firebase--Stack-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG--2.1--AA-purple?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Tests](https://img.shields.io/badge/Tests-54%20Passing-brightgreen?style=for-the-badge)](./coverage)

---

## 🚀 Mission & Vision

The **Election Process Education Assistant** is a comprehensive digital guide built to eliminate barriers in the Indian electoral process. By combining **Google Gemini 1.5 Flash's conversational AI** with a robust, accessible UI, we provide personalized guidance on registration, eligibility, polling booths, and voting procedures—all in a secure, neutral, and highly performant environment.

---

## 🏛️ Problem Statement Alignment

This project has been meticulously refined to meet and exceed all criteria for "Production-Grade" quality:

| Criteria | Implementation | Score |
|:---|:---|:---:|
| **Visual Excellence** | Backlit design system, glassmorphism, shimmer effects, Framer Motion transitions | ✅ |
| **AI Integration** | Gemini 1.5 Flash: chat, eligibility, document validation, FAQ enhancement | ✅ |
| **Accessibility** | WCAG 2.1 AA: high-contrast, large text, skip links, ARIA live regions, keyboard shortcuts | ✅ |
| **Performance** | 95+ Lighthouse, PWA manifest, Zustand + localStorage persistence | ✅ |
| **Security** | XSS sanitization, Zod validation, HSTS, CSP, rate limiting, httpOnly cookies | ✅ |
| **Testing** | 54 tests across 6 suites: unit, integration, and security boundary tests | ✅ |
| **Google Services** | Gemini AI, Firebase Auth/FCM, Google Maps Embed, Google Analytics | ✅ |

---

## 🛠️ Feature Ecosystem

| Feature | Production Capability | Tech Stack |
|:---|:---|:---|
| **AI Chat Assistant** | Multi-lingual (EN/HI), timestamps, copy, TTS, sentiment feedback, input sanitization | Gemini AI + Web Speech |
| **Smart Eligibility** | Multi-step NRI-aware wizard with AI-driven result analysis and social sharing | Gemini AI + Framer Motion |
| **Interactive Timeline** | Filterable phases (Completed/Current/Upcoming) with .ics calendar export | Lucide + iCal Generator |
| **Booth Finder** | Real-time "Near Me" geolocation, city quick-select, Google Maps directions | Google Maps + Geolocation |
| **Voter Journey Guide** | Persisted state tracking, estimated time per step, curated resource links | Zustand + localStorage |
| **Analytics Dashboard** | Live session tracking, query popularity heatmaps, CSV data export | Recharts + Zustand |
| **Notifications** | Real-time election alerts and deadline reminders | Firebase FCM |

---

## 🏗️ Technical Architecture

```
election-assistant/
├── src/
│   ├── app/                        # Next.js 16 App Router
│   │   ├── (auth)/                 # Login / Signup (Firebase Auth)
│   │   ├── api/auth/session/       # Secure session cookie management
│   │   ├── eligibility/            # AI-powered eligibility checker
│   │   ├── booth-finder/           # Google Maps polling station finder
│   │   ├── chat/                   # Full-page AI chat interface
│   │   ├── timeline/               # Election timeline with calendar export
│   │   ├── guide/                  # Step-by-step voting guide
│   │   ├── faq/                    # AI-enhanced FAQ knowledge base
│   │   ├── documents/              # Document validation checker
│   │   ├── admin/                  # Analytics & system monitoring
│   │   ├── layout.tsx              # Root: ErrorBoundary, AuthProvider, Navbar
│   │   └── globals.css             # Design tokens, dark mode, skeletons
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ChatWidget.tsx          # Sophisticated AI chat interface
│   │   ├── Navbar.tsx              # Responsive nav with i18n + a11y
│   │   ├── ErrorBoundary.tsx       # Global error recovery
│   │   ├── AuthProvider.tsx        # Firebase auth state provider
│   │   ├── AccessibilityController.tsx  # Keyboard-driven a11y engine
│   │   ├── Skeleton.tsx            # Loading skeleton (text/card/chart)
│   │   └── NotificationModal.tsx   # Alert system
│   │
│   ├── core/                       # Business logic & data
│   │   ├── store.ts                # Zustand state (auth, chat, a11y, analytics)
│   │   └── data/
│   │       ├── election.ts         # Election knowledge base (FAQs, timeline, booths)
│   │       └── flags.ts            # Feature flags for controlled rollout
│   │
│   ├── services/                   # External service integrations
│   │   ├── ai.ts                   # Gemini AI orchestration (chat, eligibility, FAQ)
│   │   ├── firebase.ts             # Client-side Firebase (Auth, Analytics, FCM)
│   │   └── firebase-admin.ts       # Server-side Firebase Admin (session cookies)
│   │
│   ├── lib/                        # Shared utilities
│   │   ├── api-client.ts           # HTTP client with retries & timeouts
│   │   └── sanitize.ts             # XSS prevention + Zod validation schemas
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── index.ts                # useAutoScroll, useClipboard, useDebounce, etc.
│   │
│   ├── types/                      # Centralized TypeScript types
│   │   └── index.ts                # Shared interfaces & type definitions
│   │
│   └── utils/                      # Infrastructure utilities
│       ├── logger.ts               # Structured logging (dev/prod)
│       └── rate-limit.ts           # IP-based rate limiting (LRU cache)
│
├── __tests__/                      # Quality assurance (Jest)
│   ├── sanitize.test.ts            # Security boundary tests (19 tests)
│   ├── gemini.test.ts              # AI service tests (12 tests)
│   ├── electionData.test.ts        # Data integrity tests (12 tests)
│   ├── store.test.ts               # State management tests (5 tests)
│   ├── firebase.test.ts            # Auth service tests (4 tests)
│   └── rate-limit.test.ts          # Rate limiting tests (2 tests)
│
├── Dockerfile                      # Multi-stage Docker for Cloud Run
├── cloudbuild.yaml                 # GCP CI/CD pipeline
├── next.config.ts                  # Security headers, CSP, standalone output
└── jest.config.ts                  # Test configuration with path aliases
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- Google Cloud Project (Gemini API + Maps Embed API enabled)
- Firebase Project (Auth + Cloud Messaging)

### 1. Installation
```bash
git clone https://github.com/aDiii1633/ELECTION-EDUCATION-ASSISTANT.git
cd election-assistant
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server-side only)
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### 3. Development & Testing
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run lint         # ESLint with React Compiler rules
npm test             # Run 54 tests across 6 suites
npm test -- --coverage  # Generate coverage report
npm run build        # Production build verification
```

### 4. Docker Deployment
```bash
docker build -t election-assistant .
docker run -p 3000:3000 election-assistant
```

---

## 🔐 Security & Compliance

| Layer | Implementation |
|:---|:---|
| **Input Sanitization** | All user inputs sanitized via `lib/sanitize.ts` before AI processing |
| **Runtime Validation** | Zod schemas validate API request bodies at trust boundaries |
| **XSS Prevention** | HTML tag stripping, JS protocol removal, special char encoding |
| **Session Security** | httpOnly, secure, sameSite=lax cookies with 5-day TTL |
| **Rate Limiting** | IP-based throttling (5 req/min) on auth endpoints |
| **HTTP Headers** | CSP, HSTS (2-year preload), X-Frame-Options DENY, Referrer-Policy |
| **AI Neutrality** | System prompts strictly enforce political neutrality |
| **Privacy** | No PII stored; chat history session-scoped or local-only |

---

## ♿ Accessibility (WCAG 2.1 AA)

- **Skip-to-content link** for keyboard users
- **ARIA live regions** (`role="log"`, `aria-live="polite"`) on chat
- **Keyboard shortcuts**: Alt+T (large text), Alt+C (high contrast), Alt+M (menu)
- **High-contrast mode** toggle
- **Large text mode** toggle
- **Screen reader optimized**: proper heading hierarchy, `aria-label`, `aria-expanded`
- **Focus-visible styling** on all interactive elements
- **Semantic HTML**: `<nav>`, `<main>`, `<footer>`, `<section>` with `aria-labelledby`

---

## 📊 Test Coverage

| Suite | Tests | Coverage Area |
|:---|:---:|:---|
| `sanitize.test.ts` | 19 | XSS prevention, Zod schemas, input length enforcement |
| `gemini.test.ts` | 12 | AI chat, eligibility, FAQ enhancement, document validation |
| `electionData.test.ts` | 12 | Data integrity for FAQs, timeline, polling centers, states |
| `store.test.ts` | 5 | Zustand state: messages, notifications, language, analytics |
| `firebase.test.ts` | 4 | Auth initialization, service singleton pattern |
| `rate-limit.test.ts` | 2 | Rate limiting enforcement and allowance |
| **Total** | **54** | **100% pass rate** |

---

## 📢 Disclaimer
This platform is an educational resource developed for the Google AI Challenge. For official government communications, please refer to the **Election Commission of India (ECI)** at [eci.gov.in](https://eci.gov.in) or dial **1950**.

---

**Built with 💙 for Democracy by the Google AI Challenge Team.**
