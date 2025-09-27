# Investment Goal Tracker + Learning Suite

A modern, beginner-friendly web app to set and track investment goals, explore compound growth, practice with a virtual portfolio, and learn with daily quizzes, myth-busting facts, and inspiring success stories with audio narration.

Built with Next.js 15, TypeScript, Tailwind, Firebase, and Google Genkit.

## Highlights

- Goals: Create, edit, and track investment goals with clear progress
- Growth Chart: Interactive compound growth simulator (SIP, CAGR, horizon)
- Virtual Investment Simulation: Paper-trading experience with live-ish prices, holdings, and transactions
- Quizzes & Myths: AI-generated financial literacy quizzes and myth-busting cards with progress tracking and rewards
- Success Stories: Curated stories of legendary investors with “Listen” audio narration
- i18n: Language toggle (English, Hindi, Marathi) across key screens
- Polished UI: shadcn/ui + Radix UI + Tailwind; responsive and accessible

## Tech Stack

- Framework: Next.js 15 (App Router, Turbopack)
- Language: TypeScript, React 18
- Styling: Tailwind CSS, shadcn/ui, Radix UI, Lucide icons
- Charts: Recharts
- Forms: React Hook Form + Zod
- Dates: date-fns, React Day Picker
- Data & Auth: Firebase (Auth, Realtime Database)
- AI: Google Genkit (Gemini) for quizzes, myths, chat, TTS

## App Structure and Pages

- Dashboard: `/` (authenticated)
  - Your goals list with add/edit; localized labels via `src/lib/i18n.tsx`
- Growth Chart: `/growth-chart`
  - Simulate compound growth with Initial Investment, Monthly SIP, Expected Annual Return, and Time Horizon; shows Total Invested vs Projected Value and a summary
- Virtual Investment Simulation: `/simulation`
  - Per-user virtual portfolio with live-updating prices (every 10s), trade dialog, holdings, and transaction history
- Quizzes & Myths: `/quizzes-myths`
  - Financial Quiz: generates a multiple-choice question via AI; tracks completed quizzes and gives periodic coupon rewards
  - Myth Buster: generates a common myth and reveals an explanation on demand; tracks busted myths
- Success Stories: `/success-stories`
  - Cards for five renowned investors with key highlights, plus famous investing books; each story includes a “Listen” button using client-side TTS with caching

## Learning Features (AI-powered)

- Quizzes: `src/ai/flows/quiz-flow.ts` → `generateQuiz()`
- Myths: `src/ai/flows/myth-flow.ts` → `generateMyth()`
- Chat Bot: Global helper for guidance and myth debunking → `src/ai/flows/chat-bot.ts`
- TTS: Text-to-speech for Success Stories → `src/ai/flows/tts-flow.ts`

Server actions hub: `src/app/actions.ts` exposes safe server-side wrappers for UI components:

- `generateQuizFlow()`, `incrementQuizCounter()`
- `generateMythFlow()`, `incrementMythCounter()`
- `getSpeechAudio(text)` → returns a data URI (WAV) for the given text
- `getAIGoalSuggestion(input)`, `handleAiChatMessage`, `handleGlobalChatMessage`

Genkit setup:

- Config: `src/ai/genkit.ts` (Gemini model) and `src/ai/dev.ts` for local flow dev server
- Scripts: `npm run genkit:dev` or `npm run genkit:watch`

## Internationalization (i18n)

- Provider: `src/lib/i18n.tsx` with dictionaries for English (en), Hindi (hi), and Marathi (mr)
- Toggle: `src/components/ui/language-toggle.tsx` embedded in the authenticated header
- Usage: Components import `useI18n()` and call `t('key')` for labels

## Getting Started (Local)

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file with Google Genkit and Firebase settings. Example keys you may need:

```bash
# Google Genkit / Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_api_key

# Firebase Web SDK
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

3) Run the app

```bash
npm run dev
```

Open http://localhost:9002

4) Optional: Run Genkit flow dev server

```bash
npm run genkit:dev
```

## Development Scripts

- `npm run dev` — Next.js dev server (port 9002)
- `npm run build` — Production build
- `npm start` — Start production server
- `npm run typecheck` — TypeScript typecheck
- `npm run genkit:dev` — Start Genkit dev server for flows
- `npm run genkit:watch` — Watch mode for Genkit

## Key Files and Folders

- `src/app/(authenticated)/dashboard/page.tsx` — Goals list and actions
- `src/components/dashboard/*` — Add/Edit goal forms and Growth Chart UI
- `src/components/dashboard/growth-chart.tsx` — Recharts-based compound growth chart
- `src/app/(authenticated)/simulation/page.tsx` — Virtual investment simulation
- `src/components/simulation/*` — Portfolio, market, holdings, transactions
- `src/app/(authenticated)/quizzes-myths/page.tsx` — Quizzes & Myth Buster
- `src/components/quizzes-myths/*` — QuizCard and MythCard components
- `src/app/(authenticated)/success-stories/page.tsx` — Success Stories page
- `src/components/success-stories/audio-play.tsx` — Client TTS “Listen” button with caching
- `src/app/actions.ts` — Server actions for AI flows and RTDB updates
- `src/ai/flows/*` — AI flows (quiz, myth, chat, goal suggestion, TTS)
- `src/lib/i18n.tsx` — Language provider and dictionaries
- `src/components/ui/language-toggle.tsx` — Language dropdown in header
- `src/lib/firebase.ts` — Firebase initialization

## Notes on Audio (TTS)

- The “Listen” button uses a server action `getSpeechAudio(text)` backed by Genkit TTS and returns a data URI (WAV) that is cached in `localStorage` per story.
- No extra system dependencies are required for the default Genkit TTS flow.

## Data Persistence

- Firebase Realtime Database stores user goals, simulation state, and per-user quiz/myth progress under:
  - `users/{uid}`
  - `goals/{autoId}`
  - `virtual_investment_simulation/{uid}`
  - `user_dynamic_progress/{uid}` (completedQuizzes, bustedMyths)

## Security & Privacy

- Firebase security rules should protect per-user data. Ensure you configure appropriate rules for production.
- AI outputs are for educational purposes only. Do not treat them as professional advice.

## Disclaimer

This app is for educational purposes only. The growth simulations, quizzes, myths, and success stories are not financial advice. Please do your own research and consult a qualified professional for personalized guidance.
