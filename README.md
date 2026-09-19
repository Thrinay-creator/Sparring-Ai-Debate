# Sparring — AI Debate Practice & Argument Strengthener

> **"Practice the argument before the moment that matters."**

Sparring is a dedicated debate-training web application where users select a topic, take an affirmative or negative stance, and spar in a rigorous 6-round argument exchange against an adversarial AI opponent powered by **Google Gemini** (`gemini-3.6-flash`).

Unlike generic conversational chatbots that offer agreeable or open-ended responses, Sparring acts as an **uncompromising sparring partner**:
- It consistently defends the opposing stance.
- It identifies subtle weaknesses, unproven assumptions, and logical fallacies in your claims.
- It scales its rigor dynamically based on chosen difficulty (`Debate Newbie`, `Sharp Rival`, or `Ruthless Lawyer`).
- Upon conclusion, it adjudicates the complete debate transcript and renders a forensic argument strength report complete with a 0–100 **Recharts Radar Scorecard**, strengths, vulnerabilities, fallacy audit, and actionable enhancements.
- Includes full hands-free **Voice Mode** powered strictly by the browser-native Web Speech API.

---

## Architecture Overview

Sparring enforces a strict separation between client presentation and AI orchestration:

```text
┌─────────────────────────────────────────────────────────────┐
│                       BROWSER CLIENT                        │
│   React 18 + Vite + Tailwind CSS + DaisyUI + Recharts       │
│   Web Speech API (SpeechRecognition + SpeechSynthesis)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP JSON (Strict Schema)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND                        │
│   Node.js + Express + Zod Validation + Rate Limiter         │
│   Reads process.env.GEMINI_API_KEY                          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Native JSON Schema Structured Calls
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      GOOGLE GEMINI API                      │
│   gemini-3.6-flash (@google/genai)                          │
└─────────────────────────────────────────────────────────────┘
```

### Security Guarantee
The Gemini API key **never** reaches the browser. All AI prompts, stance enforcement logic, fallacy classifications, and API credentials reside exclusively on the Express backend.

---

## Key Features

1. **Structured Debate Chamber**:
   - 10 curated debate prompts or custom topic entry.
   - **Automatic Stance Inversion**: When you choose `FOR`, the AI automatically defends `AGAINST` (and vice-versa). Both stances can never accidentally match.
   - **3 Rigor Levels**:
     - `Debate Newbie` (`NEWBIE`): Friendly, single-issue rebuttals with clarifying questions.
     - `Sharp Rival` (`SHARP`): Counterexamples, assumption challenging, and logic gap probing.
     - `Ruthless Lawyer` (`RUTHLESS`): Forensic precision, attacks unsupported claims, and catches previous round contradictions.
2. **Deterministic 6-Round Cap**:
   - 1 round = 1 user argument + 1 AI rebuttal.
   - Automatically transitions to diagnostic analysis after Round 6 without requiring extra clicks.
   - Allows early conclusion after opening rounds with confirmation guard.
3. **Forensic Fallacy Auditing**:
   - Strictly audits arguments against 10 verified logical fallacies: `strawman`, `ad hominem`, `slippery slope`, `false dilemma`, `appeal to authority`, `hasty generalization`, `appeal to emotion`, `red herring`, `circular reasoning`, `bandwagon`.
   - Never fabricates or forces fallacies when reasoning is valid.
4. **Anti-Hallucination Rules**:
   - AI is strictly prohibited from inventing statistics, quotations, legal codes, or studies.
   - If an argument lacks proof, the AI highlights the missing evidence rather than fabricating counter-statistics.
5. **Interactive Summary & Radar Scorecard**:
   - Multi-metric evaluation on a fixed `[0, 100]` domain: **Logic**, **Evidence**, and **Persuasiveness**.
   - Specific strengths and vulnerabilities cited directly from the transcript.
   - Actionable recommendations tailored to the debate topic.
6. **Native Browser Voice Mode**:
   - Dictate arguments via speech-to-text with review before submission.
   - Automatic text-to-speech rebuttal readout.
   - Header Mute toggle and instant **"Stop Speaking"** control.
   - Anti-feedback loop protection: Microphone is disabled while the AI is speaking.
   - Non-blocking fallback for browsers without Web Speech support.
7. **Local Session Persistence**:
   - Preserves completed debate evaluations in `localStorage` under `sparring_sessions` for review across browser reloads.

---

## Project Structure

```text
sparring/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Global UI primitives
│   │   │   ├── setup/        # TopicSelector, StanceSelector, DifficultySelector
│   │   │   ├── debate/       # DebateHeader, ChatWindow, ChatMessage, ArgumentInput
│   │   │   ├── voice/        # VoiceControls, SpeechBanner
│   │   │   └── summary/      # ScoreCard, RadarBreakdown, Strengths, Weaknesses, Fallacies
│   │   ├── pages/            # SetupPage, DebatePage, SummaryPage
│   │   ├── hooks/            # useDebate (state machine), useSpeech (Web Speech API)
│   │   ├── services/         # Centralized api.js
│   │   ├── data/             # Curated topics and difficulty tiers
│   │   ├── utils/            # Argument validation and localStorage handlers
│   │   ├── App.jsx           # Master flow orchestrator
│   │   └── index.css         # Debate chamber custom styling & fonts
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/           # /api/health, /api/debate-turn, /api/feedback
│   │   ├── services/         # gemini.js, debateService.js, feedbackService.js
│   │   ├── prompts/          # debatePrompt.js, feedbackPrompt.js
│   │   ├── schemas/          # Zod schemas & Gemini JSON response schemas
│   │   ├── middleware/       # rateLimiter.js, validateRequest.js, errorHandler.js
│   │   └── server.js         # Express server entry point
│   ├── tests/                # Automated Vitest & Supertest API suite
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── .gitignore
├── package.json              # Root concurrent orchestrator
└── README.md
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher; tested on v24.13.1)
- Google Gemini API Key ([Get a key from Google AI Studio](https://aistudio.google.com/))

### 1. Clone or Open the Repository
```bash
cd sparring
```

### 2. Configure Backend Environment
Create a `.env` file in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
You can install all dependencies from the root directory:
```bash
npm run install:all
```

Or install separately:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
This starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

### Option B: Run Independently
**In Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**In Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running Automated Tests

Sparring includes automated unit and integration tests covering API endpoints, stance inversion enforcement, character limits, round constraints, Zod schema parsers, and client validation.

**Run Backend Tests:**
```bash
npm run test:backend
# or: cd backend && npm test
```

**Run Frontend Tests:**
```bash
cd frontend && npm test
```

---

## API Documentation

### 1. `GET /api/health`
Health readiness check.
- **Response**: `{ "status": "ok" }`

### 2. `POST /api/debate-turn`
Executes a single debate round against the AI opponent.
- **Request Body**:
  ```json
  {
    "sessionId": "uuid-v4-string",
    "topic": "Should remote work be a legal right?",
    "userStance": "FOR",
    "aiStance": "AGAINST",
    "difficulty": "SHARP",
    "round": 1,
    "transcript": [],
    "latestArgument": "Remote work reduces overhead and gives workers schedule autonomy."
  }
  ```
- **Validation Rules**:
  - `userStance` must NOT equal `aiStance` (strictly enforced on backend).
  - `latestArgument`: 10 to 1,500 characters.
  - `round`: integer 1 through 6.
- **Response Body**:
  ```json
  {
    "counter": "While autonomy increases, remote models shift utility costs to employees and dilute institutional knowledge sharing...",
    "argumentScore": 7,
    "scoreReason": "Clear operational points, though fails to account for junior mentorship deficiencies.",
    "fallacy": null
  }
  ```

### 3. `POST /api/feedback`
Generates the comprehensive post-debate argument diagnostic report.
- **Request Body**:
  ```json
  {
    "sessionId": "uuid-v4-string",
    "topic": "Should remote work be a legal right?",
    "userStance": "FOR",
    "transcript": [
      { "role": "user", "content": "..." },
      { "role": "ai", "content": "..." }
    ]
  }
  ```
- **Response Body**:
  ```json
  {
    "overallScore": 81,
    "logicScore": 85,
    "evidenceScore": 74,
    "persuasivenessScore": 82,
    "strengths": [
      "Effectively distinguished between full remote and hybrid models in Round 3.",
      "Conceded corporate real estate advantages while defending talent recruitment reach."
    ],
    "weaknesses": [
      "Relied on assumed productivity gains without citing baseline performance measurements.",
      "Unaddressed counterargument regarding cybersecurity compliance in Round 5."
    ],
    "fallaciesCommitted": [],
    "suggestions": [
      "Introduce specific metrics for knowledge-work output rather than general satisfaction surveys.",
      "Propose tiered statutory exemptions for physical security-sensitive industries."
    ]
  }
  ```

---

## Voice Mode Details

- **Microphone Input (STT)**: Uses browser-native `SpeechRecognition` / `webkitSpeechRecognition`. Speech is transcribed into the textarea for you to review, refine, or expand before sending.
- **Opponent Speech (TTS)**: Uses `window.speechSynthesis` to speak AI rebuttals automatically.
- **Safety**:
  - The microphone is automatically deactivated while the AI is speaking to prevent acoustic feedback loops.
  - You can click **"Stop Speaking"** at any time to immediately silence the AI.
  - You can toggle **Mute** in the header to disable automated speech altogether.
- **No Third-Party Voice Fees**: No ElevenLabs, Azure, or Whisper keys required.

---

## Troubleshooting

1. **"Gemini API key is not configured on the backend"**:
   Make sure you copied `backend/.env.example` to `backend/.env` and supplied a valid `GEMINI_API_KEY`. Restart the backend server.
2. **"Opponent stance (aiStance) must be the exact inverse"**:
   Ensure `userStance` and `aiStance` are opposite values (`FOR` vs `AGAINST`).
3. **Speech recognition does not start**:
   Verify that you granted microphone permissions in your browser. Note that Chrome, Edge, and Safari have native Web Speech support; Firefox requires manual flag activation or will run smoothly in standard text mode.
4. **Rate limit exceeded**:
   The backend includes an IP rate limit of 30 requests per minute to prevent quota exhaustion. Wait 60 seconds before submitting further turns.
