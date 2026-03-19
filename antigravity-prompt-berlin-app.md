# Müller-Miller Berlin Companion — AI Travel App

## Build Prompt for Google Antigravity

> **One-liner**: Build a voice-first, AI-powered iPhone travel companion app for two people — Fiya and Chris — traveling together in Berlin, May 19–27, 2026. The app talks, listens, knows where they are, knows what's coming next, and serves as the single source of truth for everything about their trip. It should feel like having the world's most thoughtful personal concierge in your pocket.

---

## 1. WHO THIS IS FOR — FULL CONTEXT

**Lutfiya "Fiya" Miller** — PhD toxicologist (DABT) from Birmingham, Alabama. Co-founder of ScienceExperts.ai. Member of the Early AI-dopters Skool community. Her hackathon team (with Chris and Ty) won the last community hackathon with Brazil Nut AI.

**Chris Müller** — German developer/entrepreneur. Co-founder of ScienceExperts.ai. Lives in/near Berlin. Fiya's romantic partner. They have been building together remotely for months and this is their **first time meeting in person** — a deeply meaningful moment for both of them.

**The trip has two purposes:**

1. **Personal**: Their first in-person union. Chris is arranging accommodations (booking the room the night before Fiya arrives so they can check in immediately at 8:55 AM). They plan to spend significant alone time together exploring the city, exploring each other, and being present.

2. **Professional**: The Early AI-dopters Skool Community meetup at **Impact Hub Berlin** (Rollbergstraße 28A, 12053 Berlin) on **May 22–23** (core days), with **May 24 as "Vibes Day"** (casual community hangout, per Mark Kashef). Community members attending include Mark Kashef, Taha El-Harti, Ty (Brazil Nut AI developer), and European members.

**This app is Fiya's gift to Chris** — a demonstration of everything they've learned building AI together, applied to making their trip extraordinary. It should feel thoughtful, personal, and technically impressive.

---

## 2. TECH STACK

```
Platform:         React Native + Expo SDK 52+ (iOS-first, Add to TestFlight or Expo Go)
                  ALTERNATIVE: Next.js 14 PWA if native not feasible — must feel native on iPhone
AI Backend:       Supabase Edge Functions (or Vercel Serverless) calling:
                  - Anthropic Claude API (claude-sonnet-4-20250514) for the AI brain
                  - OpenAI Whisper API for speech-to-text
                  - ElevenLabs API for text-to-speech (warm, natural voice)
Real-time Sync:   Supabase Realtime (Postgres + websockets) — shared state between Fiya & Chris
Auth:             Simple invite-code entry (no account creation — just "FIYA" or "CHRIS" on first launch)
Location:         Expo Location / browser Geolocation API
Maps:             React Native Maps / Mapbox GL for venue pins
State:            Zustand persisted to AsyncStorage (React Native) or localStorage (PWA)
Styling:          NativeWind (Tailwind for RN) or Tailwind CSS (PWA)
Fonts:            DM Serif Display (headings), Source Sans 3 (body), JetBrains Mono (data)
Push:             Expo Notifications for flight reminders, event alerts, Chris check-ins
```

**API Keys needed (user provides via .env):**
- `ANTHROPIC_API_KEY` — for Claude AI brain
- `OPENAI_API_KEY` — for Whisper STT
- `ELEVENLABS_API_KEY` — for TTS
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` — for real-time sync
- `MAPBOX_TOKEN` (optional) — for maps

---

## 3. DESIGN SYSTEM

### Palette — ScienceExperts.ai Branding (Light Mode, Red/Black/White)
```
Red Primary:      #C8102E    (accent, active states, brand bar, CTAs)
Red Light:        #E8354A    (hover/press states)
Red Soft BG:      rgba(200,16,46,0.06)
Red Soft Border:  rgba(200,16,46,0.14)
Black:            #1A1A1A    (primary text)
Dark Gray:        #3A3A3A    (secondary text)
Medium Gray:      #6B6B6B    (body text)
Light Gray:       #9E9E9E    (captions, labels)
Border:           #E5E5E5
Border Light:     #F0F0F0
Background:       #FAFAFA
White:            #FFFFFF
Green:            #16A34A    (success, completed)
Blue:             #2563EB    (community/event items)
Amber:            #D97706    (warnings, layovers)
Pink:             #DB2777    (personal/romantic)
```

### Visual Identity
- 3px solid `#C8102E` bar across the top of every screen (brand signature)
- Animated red sweep lines as section dividers
- Pulsing red dot next to live Berlin clock
- Cards: white bg, subtle border, 10-12px radius, colored left-border by category
- Red underline animation on titles
- Voice button: large floating red circle with animated pulse ring when listening
- Touch targets: 48px minimum (iPhone safe area)
- Safe area insets respected on all screens

---

## 4. THE AI BRAIN — "Berlin" (the assistant)

The core differentiator. The app has a built-in AI assistant named **"Berlin"** (or users can rename it). It powers everything.

### System Prompt for the AI Brain

```
You are Berlin, a personal AI travel companion for Fiya (Lutfiya Miller) and Chris (Chris Müller) during their trip to Berlin, Germany from May 19–27, 2026.

CONTEXT YOU ALWAYS KNOW:
- This is Fiya and Chris's first time meeting in person. They are romantic partners and co-founders of ScienceExperts.ai. This trip is deeply meaningful to both of them.
- Fiya is flying from Birmingham, AL (BHM) via Atlanta and Paris, arriving Berlin BER at 8:55 AM on May 20. Confirmation: JLY3BV. Seat 21C on first leg.
- Chris is arranging accommodations in Berlin. Room booked from night of May 19 so Fiya can check in immediately on arrival.
- May 22-23: Early AI-dopters Skool Community meetup at Impact Hub Berlin (Rollbergstr. 28A, 12053). Core days. Their team won the last hackathon with Brazil Nut AI (team: Fiya, Chris, Ty). Other attendees: Mark Kashef, Taha El-Harti, European community members.
- May 24: "Vibes Day" — casual community hangout (per Mark Kashef).
- May 27: Return flight BER → AMS → DTW → BHM, departing 12:10 PM.
- Fiya is a PhD toxicologist (DABT). Chris is a German developer/entrepreneur.
- Birmingham is CDT (UTC-5). Berlin is CEST (UTC+2). The difference is +7 hours.
- Berlin is very cash-heavy. Many places don't accept cards. Euros required.

YOUR PERSONALITY:
- Warm, witty, slightly cheeky. Like a best friend who also happens to know everything about Berlin.
- Celebrate their connection — be happy for them, supportive, encouraging.
- Be practical and specific. Give actual addresses, actual transit directions, actual prices.
- When they ask for restaurant or activity recommendations, give REAL Berlin places with real details.
- Proactively offer helpful context: "By the way, your body clock thinks it's 3 AM right now — take it easy" or "Impact Hub is a 15 min U-Bahn ride from here."
- When spoken to in German (Chris may), respond naturally in German.
- Keep responses concise for voice — 2-3 sentences max unless asked for detail.

TOOLS YOU HAVE ACCESS TO (function calling):
- get_current_location() → returns lat/lon
- get_current_time() → returns time in both Birmingham and Berlin
- get_trip_day() → returns which day of the trip it is and what's scheduled
- get_next_event() → returns the next upcoming calendar event
- get_nearby_places(category) → returns curated Berlin spots near current location
- get_flight_status(flight_number) → returns current flight info
- add_note(day, text) → saves a note to that day
- toggle_checklist_item(item) → checks/unchecks a packing item
- get_checklist_status() → returns packing progress
- send_message_to_partner(text) → sends a message to the other user via Supabase realtime
- get_weather() → returns current Berlin weather
- translate(text, from, to) → translates between English and German
```

### Voice Interaction Flow

```
[User taps floating red mic button or says "Hey Berlin"]
  → App begins recording (animated pulse ring around button)
  → Audio sent to Whisper API → text transcription returned
  → Transcription + conversation history + context sent to Claude API
  → Claude response returned
  → Response displayed as text chat bubble
  → Response simultaneously sent to ElevenLabs → audio stream played back
  → If Claude called a tool (e.g., get_nearby_places), results rendered as rich cards below the text
[User can interrupt at any time by tapping again]
```

### Example Interactions

**Fiya (in transit, Day 19):**
> "Hey Berlin, how much longer until I land in Paris?"

**Berlin responds (voice + text):**
> "You've got about 3 hours left on the ATL→CDG leg. You'll land around 6:10 AM Paris time — that's midnight back in Birmingham, so your body's going to be tired. Try to sleep! When you land, Terminal E to F is a short walk. You've got a 1-hour layover, then the quick hop to Berlin. Chris is waiting."

**Chris (Day 22, at Impact Hub):**
> "Berlin, was ist ein gutes Restaurant für heute Abend? Etwas Besonderes."

**Berlin responds (in German + English):**
> "Für heute Abend empfehle ich Ora in Kreuzberg — eine alte Apotheke, jetzt ein wunderschönes Restaurant mit Kerzenlicht. Perfekt für euch zwei nach einem langen Tag. Die Adresse ist Oranienplatz 14. Reservierung empfohlen! Shall I add it to your notes for today?"

**Fiya (Day 21, walking near Kreuzberg):**
> "What's good to eat around here? We're starving."

**Berlin responds (uses location):**
> "You're right near Kreuzberg — perfect. Mustafa's Gemüse Kebap is a 5-minute walk south, and the line moves fast. If you want to sit down, Five Elephant is 3 minutes east — incredible coffee and the best cheesecake in Berlin. Want me to navigate you to either one?"

---

## 5. APP SCREENS

### Screen 1: 🏠 Home (default)

The command center. Shows at a glance:

**Top section:**
- "Good morning, Fiya" (or Chris) — time-of-day greeting in their timezone
- Live dual clock: Birmingham time + Berlin time (pulsing red dot)
- Countdown: "3 days until Berlin" → or "Day 2 in Berlin" → or trip day context
- Current weather in Berlin (icon + temp + description)

**"Right now" card:**
- Context-aware card that changes based on trip phase:
  - Pre-trip: "Start packing! You're {X}% packed." with progress bar
  - Travel day: Current flight status with live countdown to next event
  - In Berlin: "Day {X} — {label}" with today's events summary
  - Return: Flight status home

**Quick actions grid (2x3):**
- 🎙️ Talk to Berlin (opens AI chat)
- 📅 Today's Plan (jumps to calendar for current day)
- ✈️ Flight Status (current/next flight)
- 💕 Send Chris a Note (quick message via Supabase realtime)
- 📍 What's Nearby (location-aware recommendations)
- ✓ Packing ({checked}/{total})

**"Next Up" timeline:**
- Shows the next 3 upcoming events from the calendar, with countdown timers

---

### Screen 2: 🎙️ Berlin AI Chat

Full-screen conversational interface.

**Layout:**
- Chat bubbles (user on right in red, Berlin on left in white)
- Rich response cards inline: location cards with map preview, restaurant cards with ratings, flight status cards, weather cards, translation cards
- Floating red mic button (bottom center, 64px, with animated pulse ring when recording)
- Text input field as fallback (with send button)
- "Speaking..." indicator when TTS is playing back
- Conversation history persisted to local storage
- "New conversation" button (top right) to reset context

**Voice features:**
- Tap mic → records → Whisper STT → Claude → ElevenLabs TTS → audio playback
- Visual waveform animation while recording
- Visual speaker animation while Berlin is talking
- Auto-stop recording after 2 seconds of silence
- Language auto-detect (English or German)

**Smart context injection:**
Every message to Claude includes:
```json
{
  "current_time_berlin": "2:30 PM CEST",
  "current_time_home": "7:30 AM CDT",
  "trip_day": 3,
  "trip_day_label": "Day with Chris",
  "current_location": { "lat": 52.4934, "lon": 13.4234, "neighborhood": "Kreuzberg" },
  "next_event": { "time": "7:00 PM", "title": "Dinner for two" },
  "weather": { "temp": "18°C", "condition": "Partly cloudy" },
  "user": "fiya",
  "checklist_progress": "38/48"
}
```

---

### Screen 3: 📅 Calendar

Interactive day-by-day view for May 19–27. (Preserve all data from the existing prototype.)

**Day selector strip** — horizontal scroll, tap to select:
- May 19: ✈️ Travel Day
- May 20: 🇩🇪 Arrival Day (arrive 8:55 AM, meet Chris, early check-in)
- May 21: 💕 Day with Chris (first full day, explore Berlin, dinner for two)
- May 22: 🧠 Skool Day 1 (Impact Hub Berlin, core day, community)
- May 23: 🧠 Skool Day 2 (Impact Hub Berlin, core day 2, community dinner)
- May 24: 🎉 Vibes Day (casual hangout per Mark, ScienceExperts.ai collab)
- May 25: 💕 Day with Chris (free day, Potsdam option, fully adjusted)
- May 26: 🌆 Last Full Day (final explorations, last dinner, pack)
- May 27: 🏠 Return Home (BER→AMS→DTW→BHM, depart 12:10 PM)

**Event cards** — color-coded by type (flight=red, layover=amber, arrive=green, event=blue, personal=pink, tip=gray). Each card shows time, title, subtitle/detail.

**Full event data**: (Reproduce every event from the existing CALENDAR data object in the prototype JSX — all flight times, layover details, personal events, community events, tips. This data is the canonical source of truth.)

**Below calendar**: Body Clock section (5 cards mapping each flight stage to body-time equivalent with tip) + Jet Lag Recovery Plan (4 cards).

**AI integration**: "Ask Berlin about this day" button at bottom of each day view → opens chat pre-seeded with "What should we do on May {day}?"

---

### Screen 4: ✈️ Flights

Outbound/Return toggle. Full flight card visualization.

**All flight data** (reproduce exactly from prototype):

**OUTBOUND — BHM→ATL→CDG→BER — 15h 10m — May 19-20**
1. DL3164 · Boeing 737-800 · Delta · BHM 10:45AM CDT → ATL 12:46PM EDT · Seat 21C
2. Layover 2h 39m ATL (change to International Terminal)
3. DL0082 · Boeing 767-400 · Delta · ATL 3:25PM EDT → CDG 6:10AM CEST · OVERNIGHT
4. Layover 1h CDG (Terminal E→F)
5. DL8419 · Airbus A318 · Air France · CDG 7:10AM → BER 8:55AM CEST · Terminal 1

**RETURN — BER→AMS→DTW→BHM — 15h 35m — May 27**
1. DL9462 · Airbus A321 · KLM · BER 12:10PM → AMS 1:30PM CEST
2. Layover 1h AMS
3. DL0137 · Airbus A350-900 · Delta · AMS 2:30PM → DTW 4:56PM EDT
4. Layover 2h 54m DTW (McNamara Terminal)
5. DL3145 · Boeing 717-200 · Delta · DTW 7:50PM EDT → BHM 8:45PM CDT

**Booking**: JLY3BV · Lutfiya Miller · eTicket #0062414000704 · SkyMiles Member · Delta Main Classic (V)

**Visual**: Airport codes in large serif, times in bold mono, red plane→line→dot connectors, dashed red layover lines, operator badges for Air France/KLM legs, timezone labels on all times.

**AI integration**: "Ask Berlin about this flight" → opens chat with flight context.

---

### Screen 5: 💕 Explore Berlin

Curated spots for Fiya & Chris, organized by category filter.

**Categories**: Romantic Walks, Coffee & Cafés, Dinner Spots, Experiences, Night Out

**All spots** (reproduce from prototype): Tiergarten, East Side Gallery, Landwehr Canal, Tempelhofer Feld, Bonanza Coffee, The Barn, Five Elephant, Café am Neuen See, Crackers, House of Small Wonder, Ora, Katz Orange, Mustafa's, Markthalle Neun, Badeschiff, Klunkerkranich, Mauerpark, Fernsehturm, Monkey Bar, Clärchens Ballhaus, Prater Garten, Michelberger.

Each card: name, vibe description, neighborhood, Google Maps deep link, heart-toggle favorite (persisted), distance from current location (if GPS available).

**Map view toggle**: Switch between list and map view showing all spots as pins.

**AI integration**: "Surprise us" button → asks Berlin AI for a personalized recommendation based on time of day, location, weather, and what they haven't done yet.

---

### Screen 6: ✓ Packing

Interactive checklist. (Reproduce all 7 categories and 48 items from prototype.)

**Categories**: Documents & Tech (10), Clothing (8), For the Event (6), Comfort & Wellness (8), Toiletries (7), Berlin Essentials (5), Fun Extras (4)

Progress bar, per-category counts, tap-to-toggle, green on complete, confetti at 100%.
Add custom items. Reset all with confirmation. Synced via Supabase so Chris can see progress.

---

### Screen 7: 📍 Berlin Info

Accordion sections with all essential information. (Reproduce from prototype.)

**Sections**: Getting Around (BVG, WelcomeCard, Uber, Impact Hub directions), Money (CASH IS KING, ATMs, tipping, cards), Useful German (Hallo, Tschüss, Die Rechnung bitte, Ich liebe dich, etc.), Emergency (112, US Embassy, Apotheke), Weather (55-72°F, long evenings).

**Quick Reference grid**: Time diff +7h, Currency Euro, Language German, Plugs Type C/F 230V, Emergency 112, Transit BVG €8.80.

**Enhancements**: Live currency converter EUR↔USD, tap-to-copy phone numbers, "Ask Berlin to translate" quick button.

---

### Screen 8: 📝 Notes

Per-day notepad with day selector. (Reproduce from prototype.)

Each day: textarea, scheduled events shown below, notes persisted. Days with content show indicator badge.

**Enhancement**: Notes sync via Supabase so both Fiya and Chris can see/edit. Shared journal.

---

### Screen 9: 💌 Us (Shared Space)

**NEW** — Private shared space between Fiya and Chris.

- **Live Messages**: Real-time text messages between them via Supabase Realtime (like a private mini-chat). Simple, fast, no bloat.
- **Shared Notes**: Both can see and edit the per-day notes (from Screen 8).
- **Photo Memories**: Upload photos tagged to a day. Grid view of trip memories building over time.
- **Mood Check-in**: Quick emoji tap — how are you feeling right now? Both see each other's latest mood.
- **"Thinking of You" ping**: One-tap notification to the other person. No words needed. Just a gentle buzz and a heart on their screen.

---

## 6. LOCATION-AWARE INTELLIGENCE

When GPS is available, the app continuously (every 5 min) checks location and enriches the AI context:

- **Neighborhood detection**: Map lat/lon to Berlin Bezirke (Mitte, Kreuzberg, Friedrichshain, Neukölln, Prenzlauer Berg, Charlottenburg, etc.)
- **Proximity alerts**: "You're 2 blocks from Five Elephant — their cheesecake is legendary." (only for favorited/saved spots)
- **Transit context**: "Impact Hub is 20 min from here — take U8 from Kottbusser Tor, change at Hermannplatz."
- **Time-aware suggestions**: Morning → coffee spots. Afternoon → walks/experiences. Evening → dinner/drinks. Late → bars/nightlife.
- **Weather-reactive**: If raining → suggest indoor activities. If sunny → suggest outdoor spots.

---

## 7. SMART NOTIFICATIONS (Push)

Proactive helpful notifications (user can toggle on/off):

- **Flight reminders**: "Your flight to Atlanta departs in 3 hours. Time to head to BHM airport!"
- **Layover alerts**: "You land in Paris in 30 min. Terminal E→F is a short walk. 1 hour layover."
- **Event reminders**: "Skool meetup starts in 1 hour at Impact Hub. U8 to Boddinstr."
- **Jet lag tips**: "Good morning! Your body thinks it's 3 AM. Get some sunlight — it'll help reset your clock."
- **Departure prep**: "Your flight home is tomorrow at 12:10 PM. Start packing tonight!"
- **Thinking of You pings**: When partner sends one.
- **Packing nudge** (pre-trip): "5 days until Berlin — you're 60% packed. Finish up today?"

---

## 8. REAL-TIME SYNC (SUPABASE SCHEMA)

```sql
-- Users (just two)
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- 'fiya' or 'chris'
  display_name TEXT,
  last_active TIMESTAMPTZ,
  current_mood TEXT, -- emoji
  last_location JSONB -- { lat, lon, neighborhood }
);

-- Shared messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user TEXT REFERENCES users(id),
  content TEXT,
  type TEXT DEFAULT 'text', -- 'text', 'ping', 'photo', 'voice_note'
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Shared notes (per day)
CREATE TABLE notes (
  day INTEGER PRIMARY KEY, -- 19-27
  content TEXT,
  last_edited_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Checklist state
CREATE TABLE checklist (
  item_key TEXT PRIMARY KEY,
  checked BOOLEAN DEFAULT false,
  checked_by TEXT,
  checked_at TIMESTAMPTZ
);

-- Explore favorites
CREATE TABLE favorites (
  spot_name TEXT,
  user_id TEXT,
  PRIMARY KEY (spot_name, user_id)
);

-- Photo memories
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day INTEGER,
  uploaded_by TEXT,
  url TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Enable Supabase Realtime on `messages`, `notes`, `checklist`, and `users` tables for instant sync.

---

## 9. FILE STRUCTURE

```
berlin-companion/
├── app.json (Expo config)
├── babel.config.js
├── tailwind.config.js
├── .env.local (API keys)
├── src/
│   ├── app/
│   │   ├── _layout.tsx (tab navigator)
│   │   ├── index.tsx (Home)
│   │   ├── chat.tsx (Berlin AI)
│   │   ├── calendar.tsx
│   │   ├── flights.tsx
│   │   ├── explore.tsx
│   │   ├── checklist.tsx
│   │   ├── info.tsx
│   │   ├── notes.tsx
│   │   └── us.tsx (shared space)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── VoiceButton.tsx (floating mic with pulse animation)
│   │   ├── ChatBubble.tsx
│   │   ├── RichCard.tsx (location, flight, weather, translation cards)
│   │   ├── FlightCard.tsx
│   │   ├── EventCard.tsx
│   │   ├── SpotCard.tsx
│   │   ├── ChecklistItem.tsx
│   │   ├── DaySelector.tsx
│   │   ├── DualClock.tsx
│   │   ├── RedLine.tsx
│   │   ├── Card.tsx
│   │   ├── MoodPicker.tsx
│   │   └── MapView.tsx
│   ├── services/
│   │   ├── ai.ts (Claude API wrapper + system prompt + tool definitions)
│   │   ├── stt.ts (Whisper API wrapper)
│   │   ├── tts.ts (ElevenLabs API wrapper)
│   │   ├── location.ts (geolocation + neighborhood detection)
│   │   ├── supabase.ts (client init + realtime subscriptions)
│   │   ├── notifications.ts (push notification scheduling)
│   │   └── weather.ts (OpenWeatherMap or similar)
│   ├── data/
│   │   ├── flights.ts
│   │   ├── calendar.ts (all 9 days of events — reproduce from prototype)
│   │   ├── explore.ts (all 22 spots with categories)
│   │   ├── checklist.ts (7 categories, 48 items)
│   │   ├── berlinInfo.ts (5 accordion sections)
│   │   ├── bodyClock.ts
│   │   ├── jetLag.ts
│   │   └── neighborhoods.ts (Berlin lat/lon → neighborhood mapping)
│   ├── store/
│   │   └── useStore.ts (Zustand — active tab, selected day, local state, user identity)
│   ├── lib/
│   │   ├── colors.ts (full palette)
│   │   ├── utils.ts (time formatting, countdown, timezone math)
│   │   └── types.ts
│   └── hooks/
│       ├── useLocation.ts
│       ├── useRealtimeMessages.ts
│       ├── useVoice.ts (recording + playback state machine)
│       └── useTripContext.ts (computes current trip phase, day, next event)
├── supabase/
│   └── migrations/001_initial.sql
└── README.md
```

---

## 10. AI TOOL DEFINITIONS (for Claude function calling)

```typescript
const tools = [
  {
    name: "get_current_location",
    description: "Returns the user's current GPS coordinates and detected Berlin neighborhood.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "get_trip_day",
    description: "Returns the current trip day number (1-9), date, label, emoji, and all scheduled events for today.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "get_next_event",
    description: "Returns the next upcoming event on the trip calendar with time, title, and details.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "get_nearby_places",
    description: "Returns curated Berlin spots near the user's current location, filtered by category.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", enum: ["romantic_walks", "coffee", "dinner", "experiences", "nightlife", "all"] }
      }
    }
  },
  {
    name: "translate",
    description: "Translates text between English and German.",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string" },
        from_lang: { type: "string", enum: ["en", "de"] },
        to_lang: { type: "string", enum: ["en", "de"] }
      },
      required: ["text", "from_lang", "to_lang"]
    }
  },
  {
    name: "add_note",
    description: "Saves a note to a specific trip day.",
    input_schema: {
      type: "object",
      properties: {
        day: { type: "integer", minimum: 19, maximum: 27 },
        text: { type: "string" }
      },
      required: ["day", "text"]
    }
  },
  {
    name: "send_message_to_partner",
    description: "Sends a text message to the user's partner (Fiya or Chris) via the shared 'Us' channel.",
    input_schema: {
      type: "object",
      properties: { message: { type: "string" } },
      required: ["message"]
    }
  },
  {
    name: "get_weather",
    description: "Returns current weather in Berlin — temperature, conditions, and forecast.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "get_flight_info",
    description: "Returns details for a specific flight on the itinerary.",
    input_schema: {
      type: "object",
      properties: {
        flight_number: { type: "string", description: "e.g., DL3164, DL0082, DL8419, DL9462, DL0137, DL3145" }
      },
      required: ["flight_number"]
    }
  },
  {
    name: "get_checklist_status",
    description: "Returns the packing checklist progress — total items, checked items, and what's remaining by category.",
    input_schema: { type: "object", properties: {} }
  }
];
```

---

## 11. VOICE UX DETAILS

### Speech-to-Text (Whisper)
- Record audio via Expo AV or MediaRecorder API
- Send to OpenAI Whisper API (`whisper-1`) with `language: "auto"` (auto-detect English or German)
- Display transcription in chat as user bubble
- Max recording: 30 seconds per message (auto-stop with silence detection at 2s)

### Text-to-Speech (ElevenLabs)
- Use a warm, friendly, slightly playful voice (e.g., "Rachel" or "Bella" voice)
- Stream audio for instant playback
- Visual "speaking" indicator (animated waveform or pulsing mic icon)
- User can tap to interrupt/stop playback
- Toggle: users can disable TTS and just read responses

### Fallback
- If no internet (airplane mode, poor signal): text input only, responses from cached data (calendar, flights, checklist) without AI generation. Show "Berlin is offline — using cached data" indicator.

---

## 12. DEPLOYMENT

### Option A: Expo Go (fastest for testing)
- User scans QR code in Expo Go on iPhone
- Immediate access, no App Store needed
- Push notifications work via Expo

### Option B: TestFlight
- Build iOS binary via EAS Build
- Upload to TestFlight
- Invite Fiya and Chris via email
- Full native experience

### Option C: PWA (web fallback)
- Deploy to Vercel as Next.js PWA
- Add to Home Screen on iPhone
- Service worker for offline
- WebRTC for audio recording

---

## 13. CRITICAL REFERENCE DATA

All trip data (flights, calendar events, explore spots, checklist items, Berlin info, body clock, jet lag tips) is defined in the attached `berlin-dashboard.jsx` file. Reproduce every data point exactly. That file is the canonical source of truth for all content.

---

## 14. BUILD ORDER

1. **Supabase setup** — tables, realtime, auth
2. **Data layer** — all static data files from prototype
3. **Store** — Zustand with persistence + Supabase sync
4. **Core services** — AI (Claude), STT (Whisper), TTS (ElevenLabs), location, weather
5. **Shared components** — Card, RedLine, DaySelector, DualClock, VoiceButton
6. **Screens in order**: Home → Chat → Calendar → Flights → Explore → Checklist → Info → Notes → Us
7. **Notifications** — schedule flight reminders, event alerts, jet lag tips
8. **Polish** — animations, haptics, safe areas, error states, offline fallback
9. **Deploy** — Expo Go for immediate testing, then TestFlight or Vercel PWA

---

*Build the complete app. Attach `berlin-dashboard.jsx` as the data reference. The goal: when Fiya pulls this up in front of Chris on May 20th, he should be absolutely blown away by how thoughtful, intelligent, and beautifully crafted it is — a love letter written in code, powered by AI, built by the two of them.*
