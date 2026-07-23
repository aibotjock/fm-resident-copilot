# FM Resident Copilot

An evidence-based clinical decision support tool for family medicine residents. Features guideline-grounded answers, voice chat, board prep vignettes, and flashcards — organized around the ABFM Content Blueprint.

## Features

- **Point of Care** — Guideline-based clinical Q&A with RAG (Retrieval-Augmented Generation)
- **Board Prep** — ABFM-style clinical vignette MCQs across 16 domains
- **Voice Chat** — Record a question, get a spoken + text response
- **Flashcards** — Study-mode Q&A grounded in guidelines
- **Documentation** — Help writing guideline-concordant clinical notes

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 19, Vite, Tailwind CSS, Lucide Icons |
| Backend   | Express 5, TypeScript, Node.js |
| Database  | PostgreSQL + Drizzle ORM |
| AI        | OpenAI GPT-4o, Whisper, TTS |
| RAG       | PostgreSQL Full-Text Search (no external embedding API) |

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **OpenAI API key** with access to GPT-4o, Whisper, and TTS

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> fm-resident-copilot
cd fm-resident-copilot

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY

# 3. Install dependencies
cd server && npm install && cd ../client && npm install && cd ..

# 4. Push database schema
cd server && npm run db:push && cd ..

# 5. Run development servers
npm run dev
# Server: http://localhost:3001
# Client: http://localhost:5173 (proxies /api to server)
```

## Production Build

```bash
cd client && npm run build && cd ..
cd server && npm start
# Serves both API and static frontend on port 3001
```

## Project Structure

```
fm-resident-copilot/
├── server/                     # Express API server
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── app.ts             # Express app setup
│   │   ├── db/
│   │   │   ├── index.ts       # Drizzle + PostgreSQL pool
│   │   │   └── schema.ts      # Table definitions
│   │   ├── rag/
│   │   │   ├── seed-data.ts   # 20 curated guideline chunks
│   │   │   ├── store.ts       # FTS search + CRUD
│   │   │   ├── retrieval.ts   # Context retrieval for prompts
│   │   │   └── ingest.ts      # Version-gated ingestion
│   │   └── routes/
│   │       ├── health.ts      # GET /api/healthz
│   │       ├── clinical.ts    # POST /api/clinical/query (SSE)
│   │       └── voice.ts       # POST /api/voice/chat (SSE)
│   ├── drizzle.config.ts
│   └── package.json
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx            # Main app with tabs
│   │   ├── api/client.ts      # API client functions
│   │   ├── components/        # UI components
│   │   └── hooks/             # Voice recording/playback hooks
│   ├── public/
│   │   └── audio-playback-worklet.js
│   └── package.json
├── .env.example
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| GET | `/api/admin/rag/status` | RAG chunk count & version |
| POST | `/api/clinical/query` | Streaming clinical Q&A (SSE) |
| POST | `/api/clinical/vignette` | Generate board-style MCQ |
| POST | `/api/voice/chat` | Voice-in → text + audio out (SSE) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `PORT` | ❌ | Server port (default: 3001) |

#### Client build-time variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | ❌ | Full backend origin (e.g. `https://api.example.com`). Leave unset for web builds served by the Express server or the Vite dev proxy. **Required for the Android app** so it knows where the backend lives. |

## Android App (APK)

The frontend can be wrapped as a native Android app using [Capacitor](https://capacitorjs.com/).

```bash
cd client

# 1. Build the web assets, pointing the app at your backend URL
VITE_API_BASE_URL="https://your-backend.example.com" npm run build

# 2. Sync web assets into the Android project
npx cap sync android

# 3. Build a debug APK (requires Android SDK + JDK 17)
cd android && ./gradlew assembleDebug
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

> **Note:** The APK is a client-only app — the Express backend must be running
> and reachable at the URL baked in via `VITE_API_BASE_URL`. If you use a plain
> `http://` URL (e.g. a LAN IP like `http://192.168.1.10:3001`), cleartext
> traffic is already enabled in the Android manifest for the debug build.

## Removed Replit-Specific Code

This project was originally built on Replit. The following have been removed:
- `@replit/connectors-sdk` dependency
- `@replit/vite-plugin-*` plugins
- `AI_INTEGRATIONS_OPENAI_BASE_URL` / `AI_INTEGRATIONS_OPENAI_API_KEY`
- `pnpm-workspace.yaml` monorepo structure (flattened to client/server)
- `post-merge.sh` git hook
- `replit.md` documentation
- Replit-managed database provisioning (use `DATABASE_URL` env var)

## License

MIT
