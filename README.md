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

* **Live Chat & Guessing Engine**:
  * Instant word evaluation with fuzzy / close-guess hints ("You're close!").
  * Automatic chat lock for players who successfully guessed the word (they can see chats but cannot spoil the answer).

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

## 📄 License
MIT License. Created with ❤️ for multiplayer gaming events and workshops.
