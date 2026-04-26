# Election Process Education Assistant

> **An AI-powered platform to help every Indian citizen understand and participate in the democratic process.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-11-orange?logo=firebase)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5--Flash-purple?logo=google)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal?logo=tailwindcss)](https://tailwindcss.com)

---

## Project Overview

The **Election Process Education Assistant** is a production-ready, AI-powered web application that guides Indian citizens through the complete voting process. It combines Google Gemini's conversational AI with real election data to provide personalized, context-aware assistance in both English and Hindi.

Built for the Google AI Challenge, the platform integrates the full Google ecosystem: Gemini AI, Firebase (Auth, Firestore, Storage, Analytics, Hosting), Google Maps, and Google Cloud Speech APIs.

---

## Features

| Feature | Description | Tech Used |
|---|---|---|
| AI Chat Assistant | Context-aware election Q&A in English/Hindi | Gemini 1.5 Flash |
| Smart Eligibility Checker | AI determines voter eligibility instantly | Gemini AI |
| Election Timeline | Visual timeline of all key dates | Framer Motion |
| Voting Guide | Interactive 4-step voter journey wizard | React State |
| Booth Finder | Map-based polling station locator | Google Maps API |
| Document Checker | AI validates registration documents | Gemini AI |
| Notifications | Election deadline reminders | Firebase FCM |
| FAQ Knowledge Base | Searchable AI-enhanced Q&A database | Gemini AI |
| Analytics Dashboard | User engagement and query tracking | Recharts |
| Voice Support | Voice input + text-to-speech output | Web Speech API |
| Accessibility | Large text, high contrast, screen reader | WCAG 2.1 AA |
| Multi-language | English and Hindi support | Gemini Translation |

---

## Architecture

```
election-assistant/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home / landing page
│   ├── layout.tsx              # Root layout with nav/footer
│   ├── globals.css             # Global styles + accessibility modes
│   ├── chat/                   # Full-page AI chat
│   ├── eligibility/            # Smart eligibility checker
│   ├── timeline/               # Visual election timeline
│   ├── guide/                  # Step-by-step voting guide
│   ├── booth-finder/           # Google Maps polling booth locator
│   ├── documents/              # Document verification helper
│   ├── faq/                    # Searchable FAQ knowledge base
│   └── admin/                  # Analytics dashboard
├── components/                 # Reusable UI components
│   ├── Navbar.tsx              # Sticky navbar with notifications
│   ├── ChatWidget.tsx          # Floating/full AI chat component
│   └── AccessibilityController.tsx
├── lib/                        # Core business logic
│   ├── gemini.ts               # Gemini AI service (chat, eligibility, docs)
│   ├── firebase.ts             # Firebase singleton initialization
│   ├── store.ts                # Zustand global state management
│   └── electionData.ts         # Election knowledge base
├── __tests__/                  # Unit and integration tests
├── .env.example                # Environment variable template
└── next.config.ts              # Security headers + image optimization
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Google Gemini API key (free at https://ai.google.dev)
- Firebase project (optional)
- Google Maps API key (optional)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/election-assistant.git
cd election-assistant
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Get a Gemini API Key

1. Visit https://ai.google.dev
2. Click "Get API Key"
3. Copy the key to NEXT_PUBLIC_GEMINI_API_KEY in .env.local

### 4. Run Development Server

```bash
npm run dev
# Visit http://localhost:3000
```

### 5. Run Tests

```bash
npm test
```

### 6. Build for Production

```bash
npm run build
npm start
```

---

## Firebase Setup (Optional)

1. Create project at https://console.firebase.google.com
2. Enable: Authentication (Google), Firestore, Storage, Analytics
3. Copy config to .env.local
4. Deploy with: firebase deploy

---

## APIs Used

| API | Purpose |
|---|---|
| Google Gemini 1.5 Flash | AI chat, eligibility, document validation |
| Firebase Auth | Google Sign-In authentication |
| Firebase Firestore | Chat session persistence |
| Firebase Storage | Document uploads |
| Firebase Analytics | User behavior tracking |
| Firebase FCM | Push notifications |
| Google Maps Embed | Polling booth locator |
| Web Speech API | Voice input/output |

---

## Security Features

- Content Security Policy (CSP)
- Security Headers (X-Frame-Options, XSS-Protection, Referrer-Policy)
- Input sanitization before AI processing
- Session-scoped rate limiting
- Environment variable protection
- Firebase Security Rules

---

## Accessibility (WCAG 2.1 AA)

- Large Text Mode (CSS body class toggle)
- High Contrast Mode
- Screen Reader ARIA labels
- Full keyboard navigation
- Semantic HTML with proper heading hierarchy
- 4.5:1 minimum color contrast ratio

---

## Design System

- Primary: Blue (#2563eb)
- Font: Inter (Google Fonts)
- Layout: Card-based, responsive grid
- Motion: Framer Motion animations
- Icons: Lucide React

---

## Disclaimer

This is an educational platform. For official election information, visit https://eci.gov.in or call Voter Helpline 1950.
