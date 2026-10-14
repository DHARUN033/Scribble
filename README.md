# ✏️ Scribble Arena - Multiplayer Drawing & Guessing Game

**Scribble Arena** is a real-time, high-performance multiplayer drawing and guessing game inspired by Skribbl.io, powered by Node.js, Express, Socket.IO, and Supabase.

---

## 🚀 Key Features

* **Real-Time Multiplayer Canvas**:
  * Smooth stroke interpolation and high-fps rendering.
  * Brush size selector, rich palette with custom colors, and fill bucket tool.
  * Canvas undo, redo, and automatic canvas reset between turns.

* **Turn Progression & Stealth Word Selection**:
  * 2-word choice picker with countdown timer.
  * Secret word stealth protection for drawers & admins to prevent side-view screen peeking.
  * Turn scoreboards and dynamic round counters (`ROUND 1/3`, `ROUND 2/3`, `FINAL ROUND 3/3 COMPLETE`).

* **Modern Fair Play Scoring System (2.0)**:
  * **Drawer Clarity Rewards**: Drawers get maximum points (up to 425+ pts) when all players find the word; proportional moderate rewards (135 - 310 pts) when fewer players guess; 0 pts if nobody guesses.
  * **Balanced Guesser Ladder**: Guaranteed base solve reward (+120 pts), speed bonus (up to +180 pts), lightning first-solver bonus (+35 pts), streak multipliers, and a smooth placement curve (+120 to +24 pts) ensuring 4th-7th guessers take home healthy scores (160 - 250+ pts) without steep drops.
  * **Strict Unique Scores**: Every scoring player is guaranteed a distinct point value—no duplicate ties.
  * **Comprehensive In-App References**: Scoring guide available directly on the landing page, in-game HUD & leaderboard, round-end scoreboard, and match reports.

* **Smart Close-Guess Engine & Anti-Spoil Chat Privacy**:
  * **Typo & Spelling Detection**: Detects minor spelling mistakes (e.g. `fotprint` vs `footprint`, `zabra` / `zeebra` / `zbera` vs `zebra`) and alerts the player with `'... is very close! Check spelling'`.
  * **Morphological Stem Matching**: Matches root stems and grammatical variations (e.g. `computing` vs `computer`, `footprints` vs `footprint`).
  * **Multi-Word & Compound Part Detection**: Identifies when a player guesses a component word of a multi-word phrase (e.g. `mouse` for `wireless mouse`, `dog` for `hot dog`, `foot` for `footprint`).
  * **100% Anti-Spoil Privacy**: Close-guess messages are **NEVER broadcast to other players** or spectator displays! Only the player who typed it receives private visual badges, chat feedback, and audio cues, keeping the game fair.
  * **Automatic Chat Lock**: Players who find the word have their chat locked from writing (they can see chats but cannot spoil the answer).

* **Championship Victory Podium & Full Reports**:
  * 3D Championship stage: 1st place (center gold pillar), 2nd place (silver pillar), 3rd place (bronze pillar).
  * Runners-up row bases for 4th and 5th place players.
  * "View Full Report" breakdown with all player rankings and earned points.

* **All Lobby Results Dashboard**:
  * Real-time match archive of completed game lobbies.
  * Expandable player standings and points breakdown.
  * Global all-time leaderboard persistence.

* **Host & Admin Controls**:
  * Dedicated Host tab to configure rounds, draw times (45s to 120s), and game modes (Free-For-All or Red vs Blue Team).
  * Live player management (kick, pause turn, skip drawer).
  * Activity logs tracking player entries and exits.
  * Custom word pack creator and preset loader.

* **Arena Spectator Mode**:
  * Broadcast / projector view designed for livestreams and event stages.
  * Integrated screen recording tool to capture gameplay sessions.

* **Supabase Cloud Integration**:
  * Schema support for persistent rooms, game sessions, global leaderboards, and custom word libraries.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism design system), Vanilla JavaScript (ES modules)
* **Audio**: Web Audio API Sound Synthesizer & BGM engine
* **Backend**: Node.js, Express.js
* **Real-Time Engine**: Socket.IO
* **Database**: Supabase (PostgreSQL)

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/DHARUN033/Scribble.git
cd Scribble
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3000
```

### 3. Database Setup (Optional)
Run the SQL script found in `supabase_setup.sql` in your Supabase SQL editor to initialize the schema for game sessions and leaderboards.

### 4. Run the Game Server
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying Online (Render, Cloud VPS, or Docker)

Real-time multiplayer drawing games require persistent, bidirectional TCP/WebSocket connections, continuous countdown timers, and active in-memory game state (`RoomManager`).

### 🌟 Recommended: Deploy on Render.com (100% Free & 1-Click)
1. Push your repository to GitHub (`https://github.com/DHARUN033/Scribble.git`).
2. Go to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Select your GitHub repository **Scribble**.
4. Configure:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**.
6. Render gives you a live URL (e.g., `https://scribble-arena.onrender.com`). Both frontend and WebSockets will work seamlessly out of the box!

---

## 📄 License
MIT License. Created with ❤️ for multiplayer gaming events and workshops.

