import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   FLIGHT DATA
   ═══════════════════════════════════════════════════════════════ */
const FLIGHTS_OUT = [
  { id: "DL3164", aircraft: "Boeing 737-800", operator: "Delta", from: { code: "BHM", city: "Birmingham, AL", terminal: "TBD", tz: "CDT (UTC−5)" }, to: { code: "ATL", city: "Atlanta, GA", terminal: "Domestic Term-South", tz: "EDT (UTC−4)" }, depart: "10:45 AM", departDate: "Tue, May 19", arrive: "12:46 PM", arriveDate: "Tue, May 19", seat: "21C", fare: "Delta Main Classic (V)", layoverAfter: "2h 39m" },
  { id: "DL0082", aircraft: "Boeing 767-400", operator: "Delta", from: { code: "ATL", city: "Atlanta, GA", terminal: "International Term", tz: "EDT (UTC−4)" }, to: { code: "CDG", city: "Paris-Charles de Gaulle", terminal: "Aerogare 2 Term E", tz: "CEST (UTC+2)" }, depart: "3:25 PM", departDate: "Tue, May 19", arrive: "6:10 AM", arriveDate: "Wed, May 20", seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "1h", overnight: true },
  { id: "DL8419", aircraft: "Airbus A318", operator: "Air France", from: { code: "CDG", city: "Paris-Charles de Gaulle", terminal: "Aerogare 2 Term F", tz: "CEST (UTC+2)" }, to: { code: "BER", city: "Berlin, Germany", terminal: "Terminal 1", tz: "CEST (UTC+2)" }, depart: "7:10 AM", departDate: "Wed, May 20", arrive: "8:55 AM", arriveDate: "Wed, May 20", seat: "—", fare: "Delta Main Classic (V)", layoverAfter: null },
];
const FLIGHTS_RETURN = [
  { id: "DL9462", aircraft: "Airbus A321", operator: "KLM", from: { code: "BER", city: "Berlin, Germany", terminal: "Terminal 1", tz: "CEST (UTC+2)" }, to: { code: "AMS", city: "Amsterdam, Netherlands", terminal: "Terminal TBD", tz: "CEST (UTC+2)" }, depart: "12:10 PM", departDate: "Wed, May 27", arrive: "1:30 PM", arriveDate: "Wed, May 27", seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "1h" },
  { id: "DL0137", aircraft: "Airbus A350-900", operator: "Delta", from: { code: "AMS", city: "Amsterdam, Netherlands", terminal: "TBD", tz: "CEST (UTC+2)" }, to: { code: "DTW", city: "Detroit, MI", terminal: "McNamara Terminal", tz: "EDT (UTC−4)" }, depart: "2:30 PM", departDate: "Wed, May 27", arrive: "4:56 PM", arriveDate: "Wed, May 27", seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "2h 54m" },
  { id: "DL3145", aircraft: "Boeing 717-200", operator: "Delta", from: { code: "DTW", city: "Detroit, MI", terminal: "McNamara Terminal", tz: "EDT (UTC−4)" }, to: { code: "BHM", city: "Birmingham, AL", terminal: "TBD", tz: "CDT (UTC−5)" }, depart: "7:50 PM", departDate: "Wed, May 27", arrive: "8:45 PM", arriveDate: "Wed, May 27", seat: "—", fare: "Delta Main Classic (V)", layoverAfter: null },
];

/* ═══════════════════════════════════════════════════════════════
   CALENDAR EVENTS — personalized
   ═══════════════════════════════════════════════════════════════ */
const CALENDAR = {
  19: { label: "Travel Day", emoji: "✈️", events: [
    { t: "10:45 AM CDT", title: "Depart Birmingham", sub: "DL3164 · Seat 21C · BHM → ATL", type: "flight" },
    { t: "12:46 PM EDT", title: "Arrive Atlanta — Layover 2h 39m", sub: "Change to International Terminal", type: "layover" },
    { t: "3:25 PM EDT", title: "Depart Atlanta (overnight)", sub: "DL0082 · ATL → CDG · Try to sleep!", type: "flight" },
  ]},
  20: { label: "Arrival Day", emoji: "🇩🇪", events: [
    { t: "6:10 AM", title: "Arrive Paris CDG — Layover 1h", sub: "Change Terminal E → F", type: "layover" },
    { t: "7:10 AM", title: "Depart Paris (Air France DL8419)", sub: "CDG → BER · Almost there!", type: "flight" },
    { t: "8:55 AM", title: "Land in Berlin!", sub: "BER Terminal 1 · Chris will be there", type: "arrive" },
    { t: "Morning", title: "Early check-in (Chris pre-arranged)", sub: "Room booked from night before so you can go straight in", type: "love" },
    { t: "Afternoon", title: "Rest & settle in together", sub: "Your body thinks it's 2 AM. Take it slow, enjoy the moment.", type: "love" },
  ]},
  21: { label: "Day with Chris", emoji: "💕", events: [
    { t: "Morning", title: "Sleep in — jet lag recovery", sub: "You'll likely wake early (3-4 AM body clock). Embrace the quiet morning together.", type: "love" },
    { t: "Daytime", title: "Explore Berlin together", sub: "First full day — no agenda, just be together. See Explore tab for ideas!", type: "love" },
    { t: "Evening", title: "Dinner for two", sub: "Berlin has incredible restaurants. See Berlin Info for picks.", type: "love" },
  ]},
  22: { label: "Skool Day 1", emoji: "🧠", events: [
    { t: "Morning", title: "Early AI-dopters Meetup — Day 1", sub: "betahaus Berlin · Rudi-Dutschke-Str. 23, 10969 Berlin", type: "event" },
    { t: "All Day", title: "Core Day with the community", sub: "Mark Kashef, Taha El-Harti, Ty (Brazil Nut AI), + European members", type: "event" },
    { t: "Tip", title: "Brazil Nut AI hackathon winners!", sub: "You, Chris & Ty — celebrate the win with the crew", type: "tip" },
  ]},
  23: { label: "Skool Day 2", emoji: "🧠", events: [
    { t: "Morning", title: "Early AI-dopters Meetup — Day 2", sub: "betahaus Berlin · Rudi-Dutschke-Str. 23, 10969 Berlin", type: "event" },
    { t: "All Day", title: "Core Day 2", sub: "N8N is also Berlin-based — possible crossover connections", type: "event" },
    { t: "Evening", title: "Community dinner / after-event hangout", sub: "Great chance to bond with the European community members", type: "event" },
  ]},
  24: { label: "Vibes Day", emoji: "🎉", events: [
    { t: "All Day", title: "Vibes Day (per Mark)", sub: "Casual community hangout — no formal agenda", type: "event" },
    { t: "Tip", title: "ScienceExperts.ai collab time?", sub: "Great day to work on the platform with Chris between community hangs", type: "tip" },
  ]},
  25: { label: "Day with Chris", emoji: "💕", events: [
    { t: "All Day", title: "Free day — explore together", sub: "You're fully adjusted to Berlin time by now. Make the most of it!", type: "love" },
    { t: "Idea", title: "Day trip or deeper Berlin exploration", sub: "Potsdam is 30 min by S-Bahn, or go deeper into Berlin neighborhoods", type: "tip" },
  ]},
  26: { label: "Last Full Day", emoji: "🌆", events: [
    { t: "Morning", title: "Last morning in Berlin", sub: "Soak it in.", type: "love" },
    { t: "Daytime", title: "Final explorations & souvenir shopping", sub: "Pack throughout the day so tonight is stress-free", type: "tip" },
    { t: "Evening", title: "Last dinner together", sub: "Make it special.", type: "love" },
    { t: "Night", title: "Pack for tomorrow's departure", sub: "Flight is at 12:10 PM — you'll need to leave for BER by ~9 AM", type: "tip" },
  ]},
  27: { label: "Return Home", emoji: "🏠", events: [
    { t: "~9 AM", title: "Head to BER Airport", sub: "Terminal 1 · Allow 2+ hours for international check-in", type: "tip" },
    { t: "12:10 PM", title: "Depart Berlin (KLM DL9462)", sub: "BER → AMS · 1h layover in Amsterdam", type: "flight" },
    { t: "2:30 PM", title: "Depart Amsterdam (DL0137)", sub: "AMS → DTW · The long leg home", type: "flight" },
    { t: "4:56 PM EDT", title: "Arrive Detroit — Layover 2h 54m", sub: "McNamara Terminal", type: "layover" },
    { t: "7:50 PM EDT", title: "Depart Detroit (DL3145)", sub: "DTW → BHM · Last leg!", type: "flight" },
    { t: "8:45 PM CDT", title: "Home in Birmingham", sub: "Body thinks it's 3:45 AM Berlin time. Straight to bed!", type: "arrive" },
  ]},
};

/* ═══════════════════════════════════════════════════════════════
   EXPLORE — Berlin date spots & activities
   ═══════════════════════════════════════════════════════════════ */
const EXPLORE = [
  { cat: "Romantic Walks", spots: [
    { name: "Tiergarten Park", vibe: "Berlin's Central Park — winding paths, hidden gardens, quiet benches", area: "Mitte" },
    { name: "East Side Gallery → Oberbaumbrücke", vibe: "Walk the longest remaining stretch of the Berlin Wall, then cross the iconic bridge at sunset", area: "Friedrichshain" },
    { name: "Landwehr Canal (Kreuzberg side)", vibe: "Tree-lined canal path, locals lounging on the banks, totally relaxed energy", area: "Kreuzberg" },
    { name: "Tempelhofer Feld", vibe: "Former airport turned massive open park — surreal, wide-open, magical at golden hour", area: "Neukölln" },
  ]},
  { cat: "Coffee & Cafés", spots: [
    { name: "Bonanza Coffee Roasters", vibe: "Berlin's specialty coffee pioneers. Minimal, beautiful, perfect flat whites", area: "Kreuzberg/Prenzlauer Berg" },
    { name: "The Barn", vibe: "Serious third-wave coffee in a gorgeous space. Multiple locations.", area: "Mitte" },
    { name: "Five Elephant", vibe: "Coffee + legendary cheesecake. Cozy Kreuzberg institution.", area: "Kreuzberg" },
    { name: "Café am Neuen See", vibe: "Lakeside beer garden in Tiergarten. Rowboats available!", area: "Tiergarten" },
  ]},
  { cat: "Dinner Spots", spots: [
    { name: "Crackers", vibe: "Stunning space, creative European cuisine, feels like a scene from a film", area: "Mitte" },
    { name: "House of Small Wonder", vibe: "Japanese-Berlin fusion, intimate treehouse-like interior, very romantic", area: "Mitte" },
    { name: "Ora", vibe: "Former pharmacy turned restaurant. Candlelit, gorgeous, seasonal menu", area: "Kreuzberg" },
    { name: "Katz Orange", vibe: "Farm-to-table in a hidden courtyard. Incredible slow-cooked meats.", area: "Mitte" },
    { name: "Mustafa's Gemüse Kebap", vibe: "Berlin's most famous döner. The line is worth it. Mandatory Berlin experience.", area: "Kreuzberg" },
  ]},
  { cat: "Experiences", spots: [
    { name: "Markthalle Neun (Thursday)", vibe: "Street Food Thursday — incredible food stalls from around the world. Go hungry!", area: "Kreuzberg" },
    { name: "Badeschiff", vibe: "Floating swimming pool on the Spree river. Pool party vibes in May.", area: "Treptow" },
    { name: "Klunkerkranich", vibe: "Rooftop bar on top of a parking garage. Sunset views, DJ sets, garden vibes.", area: "Neukölln" },
    { name: "Mauerpark Flea Market (Sunday)", vibe: "Massive flea market + outdoor karaoke. Very Berlin.", area: "Prenzlauer Berg" },
    { name: "Berlin Fernsehturm (TV Tower)", vibe: "360° views from the top. Touristy but worth it for the panorama.", area: "Alexanderplatz" },
  ]},
  { cat: "Night Out", spots: [
    { name: "Monkey Bar", vibe: "Rooftop cocktails overlooking the zoo + city. Stunning at night.", area: "Charlottenburg" },
    { name: "Clärchens Ballhaus", vibe: "Historic 1913 ballroom. Dancing, charm, and a fairy-light garden.", area: "Mitte" },
    { name: "Prater Garten", vibe: "Berlin's oldest beer garden (1837). Chestnut trees, communal tables, local vibes.", area: "Prenzlauer Berg" },
    { name: "Michelberger Hotel Bar", vibe: "Cool crowd, creative cocktails, eclectic music. Very Friedrichshain.", area: "Friedrichshain" },
  ]},
];

/* ═══════════════════════════════════════════════════════════════
   PACKING CHECKLIST
   ═══════════════════════════════════════════════════════════════ */
const CHECKLIST = [
  { cat: "Documents & Tech", items: [
    "Passport (valid through Nov 2026+)", "Delta app with boarding passes", "Travel insurance docs",
    "Hotel/accommodation confirmation", "Copy of itinerary (this dashboard!)", "Phone + charger",
    "EU power adapter (Type C/F)", "Portable battery pack", "AirPods", "Laptop + charger",
  ]},
  { cat: "Clothing (May Berlin = 55-70°F)", items: [
    "Layers — mornings are cool, afternoons warm", "Comfortable walking shoes (you'll walk MILES)",
    "Rain jacket (May showers are common)", "1-2 nice outfits for dinners & the event",
    "Something cute for the meetup days", "Sleepwear", "Undergarments (8 days)", "Swimsuit (Badeschiff!)",
  ]},
  { cat: "For the Event (May 22-23)", items: [
    "Business cards (if you have them)", "Laptop for hackathon/demos", "ScienceExperts.ai pitch notes",
    "Brazil Nut AI demo-ready", "Notebook & pen", "Chargers for all-day use",
  ]},
  { cat: "Comfort & Wellness", items: [
    "Neck pillow for the long flights", "Eye mask + ear plugs", "Compression socks for the flights",
    "Reusable water bottle (refill at airport after security)", "Melatonin (for jet lag adjustment)",
    "Snacks for flights & layovers", "Medications/vitamins", "Sunscreen (May sun is strong!)",
  ]},
  { cat: "Toiletries", items: [
    "TSA-size liquids bag", "Toothbrush + toothpaste", "Deodorant", "Skincare essentials",
    "Hair products/tools", "Makeup bag", "Perfume (travel size)",
  ]},
  { cat: "Berlin Essentials", items: [
    "Cash — EUROS! Berlin is very cash-heavy!", "Download BVG transit app before you go",
    "Download offline Berlin map in Google Maps", "Google Translate app (camera mode for menus)",
    "Comfortable day bag/backpack for exploring",
  ]},
  { cat: "Fun Extras", items: [
    "Camera for capturing memories together", "A little gift / surprise for Chris",
    "Journal for trip memories & notes", "Portable speaker (for the room)",
  ]},
];

/* ═══════════════════════════════════════════════════════════════
   BODY CLOCK + JET LAG
   ═══════════════════════════════════════════════════════════════ */
const BODY_CLOCK = [
  { time: "10:45 AM CDT", body: "4:45 PM Berlin", note: "Late afternoon energy — you'll feel fine. Grab a coffee at BHM.", icon: "☕" },
  { time: "12:46 PM EDT", body: "6:46 PM Berlin", note: "Early evening feeling. Eat a real meal in ATL — your body will thank you later.", icon: "🍽️" },
  { time: "3:25 PM EDT", body: "9:25 PM Berlin", note: "Your body thinks it's bedtime. Try to sleep on this flight!", icon: "😴" },
  { time: "6:10 AM CEST", body: "12:10 AM home", note: "Midnight back home. You'll be tired — this is normal. Stay awake!", icon: "🌙" },
  { time: "8:55 AM CEST", body: "1:55 AM home", note: "Deep night at home. Push through — sunlight & walking will help.", icon: "🌅" },
];
const JET_LAG = [
  { day: "Day 1–2", tip: "Expect to wake at 3–4 AM. Get morning sun. No naps over 20 min. Enjoy the quiet early mornings together." },
  { day: "Day 3–4", tip: "Push dinner to 7 PM local. Evening walks help. You'll start feeling normal." },
  { day: "Day 5+", tip: "Fully adjusted! Enjoy Berlin on local time. You've got this." },
  { day: "Return", tip: "Coming west is easier. You'll want to stay up late. Set an alarm, morning light, eat on home time." },
];

/* ═══════════════════════════════════════════════════════════════
   BERLIN INFO
   ═══════════════════════════════════════════════════════════════ */
const BERLIN_INFO = [
  { cat: "Getting Around", items: [
    { l: "BVG Day Pass", d: "€8.80/day covers all U-Bahn, S-Bahn, buses, trams in zones AB" },
    { l: "Berlin WelcomeCard", d: "Transit + museum discounts — great for tourists" },
    { l: "Uber / Bolt / Freenow", d: "All work well in Berlin as backup" },
    { l: "betahaus Berlin", d: "Rudi-Dutschke-Str. 23, 10969 — Kreuzberg. U6 to Kochstraße is closest." },
  ]},
  { cat: "Money (CASH IS KING!)", items: [
    { l: "Bring Euros in cash!", d: "Many Berlin restaurants, bars & shops are cash only. This is not a joke." },
    { l: "ATMs (Geldautomat)", d: "Withdraw at bank ATMs (Sparkasse, Deutsche Bank). Avoid random ones — high fees." },
    { l: "Tipping", d: "Round up or 5–10%. Say the total you want to pay when handing cash." },
    { l: "Cards", d: "Visa/Mastercard work at some places. Many only take EC (German debit) or cash." },
  ]},
  { cat: "Useful German", items: [
    { l: "Hallo / Tschüss", d: "Hello / Bye" },
    { l: "Sprechen Sie Englisch?", d: "Do you speak English? (Most Berliners do)" },
    { l: "Die Rechnung, bitte", d: "The check, please" },
    { l: "Ein Bier / Wein, bitte", d: "One beer / wine, please" },
    { l: "Danke / Bitte", d: "Thank you / Please (or You're welcome)" },
    { l: "Wo ist...?", d: "Where is...?" },
    { l: "Ich liebe dich", d: "I love you" },
  ]},
  { cat: "Emergency & Health", items: [
    { l: "EU Emergency", d: "112 (police, fire, ambulance)" },
    { l: "US Embassy Berlin", d: "Clayallee 170, 14191 Berlin · +49 30 8305-0" },
    { l: "Apotheke (Pharmacy)", d: "Green cross sign. Many open late. Basic meds available OTC." },
  ]},
  { cat: "Weather (Late May)", items: [
    { l: "Temperature", d: "55–72°F (13–22°C). Warm days, cool evenings." },
    { l: "Rain", d: "Possible showers. Bring a light rain jacket." },
    { l: "Daylight", d: "Sunrise ~5 AM, sunset ~9 PM. Long beautiful evenings!" },
  ]},
];

/* ═══════════════════════════════════════════════════════════════
   PALETTE & DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const C = {
  red: "#C8102E", redLight: "#E8354A", redDark: "#9B0C23",
  redSoft: "rgba(200,16,46,0.06)", redBorder: "rgba(200,16,46,0.14)",
  black: "#1A1A1A", dark: "#3A3A3A", med: "#6B6B6B", light: "#9E9E9E",
  border: "#E5E5E5", borderLight: "#F0F0F0", bg: "#FAFAFA", white: "#FFF",
  green: "#16A34A", greenSoft: "rgba(22,163,74,0.08)", greenBorder: "rgba(22,163,74,0.18)",
  blue: "#2563EB", blueSoft: "rgba(37,99,235,0.06)", blueBorder: "rgba(37,99,235,0.14)",
  amber: "#D97706", amberSoft: "rgba(217,119,6,0.06)", amberBorder: "rgba(217,119,6,0.14)",
  pink: "#DB2777", pinkSoft: "rgba(219,39,119,0.06)", pinkBorder: "rgba(219,39,119,0.14)",
};

const evColor = { flight: { bg: C.redSoft, bd: C.redBorder, dot: C.red }, layover: { bg: C.amberSoft, bd: C.amberBorder, dot: C.amber }, arrive: { bg: C.greenSoft, bd: C.greenBorder, dot: C.green }, event: { bg: C.blueSoft, bd: C.blueBorder, dot: C.blue }, love: { bg: C.pinkSoft, bd: C.pinkBorder, dot: C.pink }, tip: { bg: C.bg, bd: C.border, dot: C.light } };

/* ═══════════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const PlaneIcon = ({ rotate = 0, size = 16, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotate}deg)` }}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" /></svg>;
const CheckIcon = ({ size = 14, color = "#fff" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
const RedLine = ({ delay = 0 }) => <div style={{ width: "100%", height: 2, overflow: "hidden", borderRadius: 1, background: "rgba(200,16,46,0.06)" }}><div style={{ height: "100%", background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`, animation: `redSweep 3s ease-in-out ${delay}s infinite` }} /></div>;
const Section = ({ title, sub, delay = 0, children }) => <div style={{ marginTop: 32 }}><h2 className="fu" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, fontWeight: 400, color: C.black, marginBottom: sub ? 2 : 6 }}>{title}</h2>{sub && <p style={{ fontSize: 12, color: C.light, marginBottom: 6 }}>{sub}</p>}<RedLine delay={delay} /><div style={{ marginTop: 14 }}>{children}</div></div>;
const Card = ({ children, style: s = {} }) => <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", overflow: "hidden", position: "relative", ...s }}>{children}</div>;
const Mono = ({ children, style: s = {} }) => <span style={{ fontFamily: "'JetBrains Mono',monospace", ...s }}>{children}</span>;

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export default function BerlinDashboard() {
  const [page, setPage] = useState("calendar");
  const [day, setDay] = useState(20);
  const [fDir, setFDir] = useState("outbound");
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState({ 19:"",20:"",21:"",22:"",23:"",24:"",25:"",26:"",27:"" });
  const [expEss, setExpEss] = useState(null);
  const [expExplore, setExpExplore] = useState(0);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes redSweep{0%{transform:translateX(-100%)}50%{transform:translateX(100%)}100%{transform:translateX(-100%)}}@keyframes planeFloat{0%{transform:translateX(-3px) rotate(-1deg)}50%{transform:translateX(3px) rotate(1deg)}100%{transform:translateX(-3px) rotate(-1deg)}}@keyframes lineGrow{from{width:0}to{width:100%}}@keyframes dotBlink{0%,100%{box-shadow:0 0 0 0 rgba(200,16,46,0.4)}50%{box-shadow:0 0 0 5px rgba(200,16,46,0)}}@keyframes checkPop{0%{transform:scale(0.8)}50%{transform:scale(1.15)}100%{transform:scale(1)}}.fu{animation:fadeUp .45s ease-out both}.fd1{animation-delay:.05s}.fd2{animation-delay:.1s}.fd3{animation-delay:.15s}.pf{animation:planeFloat 3s ease-in-out infinite}.rdp{animation:dotBlink 2s ease-in-out infinite}.lg{animation:lineGrow .7s ease-out .2s both}.cp{animation:checkPop .2s ease-out}*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#D5D5D5;border-radius:3px}textarea,button,input{font-family:'Source Sans 3',sans-serif}`;
    document.head.appendChild(s); return () => document.head.removeChild(s);
  }, []);

  const berlinT = now.toLocaleString("en-US",{timeZone:"Europe/Berlin",hour:"numeric",minute:"2-digit",hour12:true});
  const homeT = now.toLocaleString("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit",hour12:true});
  const daysUntil = Math.ceil((new Date("2026-05-19")-now)/86400000);
  const toggle = useCallback(k => setChecked(p => ({...p,[k]:!p[k]})), []);
  const totalC = Object.values(checked).filter(Boolean).length;
  const totalI = CHECKLIST.reduce((a,c)=>a+c.items.length,0);
  const dayN = {19:"Mon",20:"Tue",21:"Wed",22:"Thu",23:"Fri",24:"Sat",25:"Sun",26:"Mon",27:"Tue"};

  const NAV = [
    { k:"calendar", l:"Calendar", e:"📅" },
    { k:"flights", l:"Flights", e:"✈️" },
    { k:"explore", l:"Explore", e:"💕" },
    { k:"checklist", l:"Packing", e:"✓" },
    { k:"info", l:"Berlin Info", e:"📍" },
    { k:"notes", l:"Notes", e:"📝" },
  ];

  return (
    <div style={{ fontFamily:"'Source Sans 3',sans-serif", background:C.bg, color:C.black, minHeight:"100vh" }}>
      {/* RED TOP BAR */}
      <div style={{ height:3, background:C.red }} />

      {/* HEADER */}
      <header style={{ background:C.white, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1080, margin:"0 auto", padding:"16px 24px 12px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30,height:30,borderRadius:6,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:13 }}>✈</div>
              <div>
                <div style={{ display:"flex",alignItems:"baseline",gap:6 }}>
                  <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, fontWeight:400 }}>Berlin</h1>
                  <Mono style={{ fontSize:9, letterSpacing:2, color:C.light }}>JLY3BV</Mono>
                </div>
                <div className="lg" style={{ height:2,background:C.red,borderRadius:1,maxWidth:50,marginTop:1 }} />
              </div>
            </div>
            <div style={{ display:"flex",gap:12,fontSize:10,color:C.light,alignItems:"center" }}>
              <Mono>May 19–27 · {daysUntil > 0 ? `${daysUntil}d away` : "Trip active!"}</Mono>
              <span style={{ color:C.borderLight }}>|</span>
              <Mono>Home {homeT}</Mono>
              <div style={{ display:"flex",alignItems:"center",gap:3 }}>
                <div className="rdp" style={{ width:5,height:5,borderRadius:"50%",background:C.red }} />
                <Mono style={{ color:C.dark,fontWeight:600 }}>Berlin {berlinT}</Mono>
              </div>
            </div>
          </div>
          {/* mini context */}
          <div className="fu fd1" style={{ display:"flex",gap:6,marginTop:10,flexWrap:"wrap" }}>
            {[
              { l:"Lutfiya Miller", s:"Passenger" },
              { l:"Chris Müller", s:"Co-founder & host" },
              { l:"betahaus Berlin", s:"May 22-23 event" },
              { l:"Early AI-dopters", s:"Skool community" },
              { l:"ScienceExperts.ai", s:"Your platform" },
            ].map((t,i) => (
              <div key={i} style={{ padding:"4px 10px",borderRadius:5,background:C.bg,border:`1px solid ${C.borderLight}`,fontSize:11 }}>
                <span style={{ fontWeight:600 }}>{t.l}</span> <span style={{ color:C.light,fontSize:9 }}>{t.s}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ position:"sticky",top:0,zIndex:10,background:"rgba(255,255,255,0.94)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px" }}>
        <div style={{ maxWidth:1080,margin:"0 auto",display:"flex",gap:0,overflowX:"auto" }}>
          {NAV.map(n => (
            <button key={n.k} onClick={()=>setPage(n.k)} style={{
              background:"none",border:"none",cursor:"pointer",padding:"8px 14px",
              borderBottom:page===n.k?`2.5px solid ${C.red}`:"2.5px solid transparent",
              display:"flex",alignItems:"center",gap:5,transition:"all .2s",whiteSpace:"nowrap",
            }}>
              <span style={{ fontSize:13 }}>{n.e}</span>
              <span style={{ fontSize:12,fontWeight:page===n.k?600:400,color:page===n.k?C.black:C.light }}>{n.l}</span>
              {n.k==="checklist"&&totalC>0&&<Mono style={{ fontSize:8,padding:"1px 4px",borderRadius:3,background:totalC===totalI?C.greenSoft:C.redSoft,color:totalC===totalI?C.green:C.red,fontWeight:600 }}>{totalC}/{totalI}</Mono>}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth:1080, margin:"0 auto", padding:"20px 24px 80px" }}>

        {/* ═══════ CALENDAR ═══════ */}
        {page==="calendar" && <div>
          <Section title="Your Trip, Day by Day" sub="Tap a day to see what's happening">
            {/* day strip */}
            <div style={{ display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:2 }}>
              {Object.entries(CALENDAR).map(([d,info])=>{
                const dn=Number(d); const sel=day===dn;
                const isEvent=[22,23,24].includes(dn); const isFlight=[19,27].includes(dn); const isLove=[20,21,25,26].includes(dn);
                let dotColor=C.light; if(isEvent)dotColor=C.blue; if(isFlight)dotColor=C.red; if(isLove)dotColor=C.pink; if(dn===20)dotColor=C.green;
                return (
                  <button key={dn} onClick={()=>setDay(dn)} style={{
                    flex:"0 0 auto",width:68,padding:"8px 0",
                    background:sel?C.red:C.white,
                    border:`1.5px solid ${sel?C.red:C.borderLight}`,
                    borderRadius:8,cursor:"pointer",transition:"all .2s",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:1,
                  }}>
                    <Mono style={{ fontSize:8,letterSpacing:1,color:sel?"rgba(255,255,255,0.65)":C.light }}>{dayN[dn]}</Mono>
                    <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,color:sel?C.white:C.black }}>{dn}</span>
                    <span style={{ fontSize:7,fontWeight:600,letterSpacing:.5,color:sel?"rgba(255,255,255,0.8)":dotColor }}>{info.emoji} {info.label}</span>
                  </button>
                );
              })}
            </div>
            {/* day header */}
            <div className="fu" style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
              <span style={{ fontSize:28 }}>{CALENDAR[day]?.emoji}</span>
              <div>
                <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:20 }}>May {day}</span>
                <span style={{ fontSize:12,color:C.light,marginLeft:8 }}>{CALENDAR[day]?.label}</span>
              </div>
            </div>
            {/* events */}
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {(CALENDAR[day]?.events||[]).map((ev,i)=>{
                const ec=evColor[ev.type]||evColor.tip;
                return (
                  <div key={i} className="fu" style={{ animationDelay:`${i*.05}s` }}>
                    <Card style={{ borderLeft:`3px solid ${ec.dot}`,background:ec.bg,borderColor:ec.bd }}>
                      <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                        <Mono style={{ minWidth:80,fontSize:10,fontWeight:600,color:ec.dot,paddingTop:2 }}>{ev.t}</Mono>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13,fontWeight:600,color:C.black }}>{ev.title}</div>
                          <div style={{ fontSize:11,color:C.med,marginTop:1,lineHeight:1.4 }}>{ev.sub}</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* body clock + jet lag */}
          <Section title="Body Clock (Outbound)" sub="Birmingham is 7 hours behind Berlin" delay={.5}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:6 }}>
              {BODY_CLOCK.map((bc,i) => <Card key={i} style={{ borderLeft:`3px solid ${C.red}`,display:"flex",gap:10,alignItems:"center" }}><span style={{fontSize:20}}>{bc.icon}</span><div><Mono style={{fontSize:9,color:C.red,fontWeight:600}}>{bc.time} <span style={{color:C.light,fontWeight:400}}>· body: {bc.body}</span></Mono><div style={{fontSize:11,color:C.med,marginTop:2,lineHeight:1.4}}>{bc.note}</div></div></Card>)}
            </div>
          </Section>
          <Section title="Jet Lag Plan" delay={1}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:6 }}>
              {JET_LAG.map((t,i)=><Card key={i} style={{borderTop:`3px solid ${C.red}`}}><Mono style={{fontSize:9,color:C.red,fontWeight:700,letterSpacing:1}}>{t.day}</Mono><div style={{fontSize:11,color:C.med,marginTop:4,lineHeight:1.5}}>{t.tip}</div></Card>)}
            </div>
          </Section>
        </div>}

        {/* ═══════ FLIGHTS ═══════ */}
        {page==="flights" && <div>
          <Section title="Flight Details" delay={0}>
            <div style={{ display:"flex",gap:0,marginBottom:16,background:C.bg,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden",width:"fit-content" }}>
              {[{k:"outbound",l:"Outbound · BHM → BER"},{k:"return",l:"Return · BER → BHM"}].map(t=>
                <button key={t.k} onClick={()=>setFDir(t.k)} style={{ background:fDir===t.k?C.red:"transparent",border:"none",cursor:"pointer",padding:"7px 16px",fontSize:11,fontWeight:fDir===t.k?600:400,color:fDir===t.k?C.white:C.med,transition:"all .2s" }}>{t.l}</button>
              )}
            </div>
            {(fDir==="outbound"?FLIGHTS_OUT:FLIGHTS_RETURN).map((f,i)=>
              <div key={f.id}>
                <Card style={{ marginBottom:0 }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:(i===0||i===(fDir==="outbound"?FLIGHTS_OUT:FLIGHTS_RETURN).length-1)?C.red:C.borderLight }} />
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:6 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <Mono style={{ fontSize:15,fontWeight:700 }}>{f.id}</Mono>
                      {f.operator!=="Delta"&&<Mono style={{ fontSize:8,padding:"2px 6px",borderRadius:3,background:C.redSoft,color:C.red,fontWeight:600 }}>OPR. {f.operator.toUpperCase()}</Mono>}
                      {f.overnight&&<Mono style={{ fontSize:8,padding:"2px 6px",borderRadius:3,background:"rgba(0,0,0,0.04)",color:C.dark }}>OVERNIGHT</Mono>}
                    </div>
                    <Mono style={{ fontSize:10,color:C.light }}>{f.aircraft}</Mono>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center" }}>
                    <div>
                      <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:22 }}>{f.from.code}</div>
                      <div style={{ fontSize:10,color:C.light,marginBottom:4 }}>{f.from.city}</div>
                      <Mono style={{ fontSize:12,fontWeight:600 }}>{f.depart}</Mono>
                      <div style={{ fontSize:9,color:C.light }}>{f.departDate}</div>
                      <Mono style={{ fontSize:8,color:C.light,marginTop:3 }}>{f.from.tz}</Mono>
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                      <PlaneIcon rotate={90} size={12} color={C.red} />
                      <div style={{ width:1.5,height:22,background:`linear-gradient(to bottom,${C.red},rgba(200,16,46,0.12))` }} />
                      <div className="rdp" style={{ width:6,height:6,borderRadius:"50%",background:C.red }} />
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:22 }}>{f.to.code}</div>
                      <div style={{ fontSize:10,color:C.light,marginBottom:4 }}>{f.to.city}</div>
                      <Mono style={{ fontSize:12,fontWeight:600 }}>{f.arrive}</Mono>
                      <div style={{ fontSize:9,color:C.light }}>{f.arriveDate}</div>
                      <Mono style={{ fontSize:8,color:C.light,marginTop:3 }}>{f.to.tz}</Mono>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:12,marginTop:12,paddingTop:10,borderTop:`1px solid ${C.borderLight}`,flexWrap:"wrap" }}>
                    {[{l:"Seat",v:f.seat},{l:"From",v:f.from.terminal},{l:"To",v:f.to.terminal},{l:"Fare",v:f.fare}].map((d,j)=>
                      <div key={j}><Mono style={{ fontSize:7,letterSpacing:1,color:C.light }}>{d.l}</Mono><div style={{ fontSize:10,fontWeight:d.v==="21C"?700:500,color:d.v==="21C"?C.red:C.dark }}>{d.v}</div></div>
                    )}
                  </div>
                </Card>
                {f.layoverAfter&&<div style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 18px" }}>
                  <div style={{ width:1.5,height:24,background:`repeating-linear-gradient(to bottom,${C.red} 0,${C.red} 3px,transparent 3px,transparent 6px)`,marginLeft:14 }} />
                  <div style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.redSoft,border:`1px solid ${C.redBorder}`,borderRadius:5 }}>
                    <div className="rdp" style={{ width:4,height:4,borderRadius:"50%",background:C.red }} />
                    <Mono style={{ fontSize:9,color:C.red,fontWeight:600 }}>Layover · {f.layoverAfter} · Change at {f.to.code}</Mono>
                  </div>
                </div>}
              </div>
            )}
          </Section>
        </div>}

        {/* ═══════ EXPLORE ═══════ */}
        {page==="explore" && <div>
          <Section title="Explore Berlin Together" sub="Date spots, restaurants, and experiences for you & Chris" delay={0}>
            <div style={{ display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:2 }}>
              {EXPLORE.map((cat,i)=>
                <button key={i} onClick={()=>setExpExplore(i)} style={{
                  flex:"0 0 auto",padding:"6px 14px",borderRadius:5,
                  background:expExplore===i?C.red:C.white,
                  border:`1px solid ${expExplore===i?C.red:C.borderLight}`,
                  cursor:"pointer",fontSize:12,fontWeight:expExplore===i?600:400,
                  color:expExplore===i?C.white:C.dark,transition:"all .2s",
                }}>{cat.cat}</button>
              )}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8 }}>
              {EXPLORE[expExplore]?.spots.map((s,i) =>
                <Card key={i} style={{ borderLeft:`3px solid ${C.pink}` }}>
                  <div style={{ fontSize:14,fontWeight:600,color:C.black,marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11,color:C.med,lineHeight:1.4,marginBottom:4 }}>{s.vibe}</div>
                  <Mono style={{ fontSize:8,color:C.pink,fontWeight:600 }}>{s.area}</Mono>
                </Card>
              )}
            </div>
          </Section>
        </div>}

        {/* ═══════ CHECKLIST ═══════ */}
        {page==="checklist" && <div>
          <Section title="Packing Checklist" sub={`${totalC} of ${totalI} packed`} delay={0}>
            <div style={{ marginBottom:16,background:C.borderLight,borderRadius:5,height:6,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${(totalC/totalI)*100}%`,background:totalC===totalI?C.green:C.red,borderRadius:5,transition:"width .3s" }} />
            </div>
            {CHECKLIST.map((cat,ci) => {
              const cc=cat.items.filter(it=>checked[`${ci}-${it}`]).length;
              return <div key={ci} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
                  <Mono style={{ fontSize:10,fontWeight:700,letterSpacing:1,color:cc===cat.items.length?C.green:C.red }}>{cat.cat}</Mono>
                  <Mono style={{ fontSize:8,color:C.light }}>{cc}/{cat.items.length}</Mono>
                  <div style={{ flex:1,height:1,background:C.borderLight }} />
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:3 }}>
                  {cat.items.map((it,ii)=>{
                    const k=`${ci}-${it}`; const d=!!checked[k];
                    return <button key={ii} onClick={()=>toggle(k)} style={{
                      display:"flex",alignItems:"center",gap:7,padding:"7px 10px",
                      background:d?C.greenSoft:C.white,border:`1px solid ${d?C.greenBorder:C.borderLight}`,
                      borderRadius:6,cursor:"pointer",transition:"all .2s",textAlign:"left",width:"100%",
                    }}>
                      <div className={d?"cp":""} style={{ width:16,height:16,borderRadius:3,flexShrink:0,border:`1.5px solid ${d?C.green:C.border}`,background:d?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
                        {d&&<CheckIcon size={10} />}
                      </div>
                      <span style={{ fontSize:12,color:d?C.green:C.dark,textDecoration:d?"line-through":"none",fontWeight:d?400:500 }}>{it}</span>
                    </button>;
                  })}
                </div>
              </div>;
            })}
          </Section>
        </div>}

        {/* ═══════ BERLIN INFO ═══════ */}
        {page==="info" && <div>
          <Section title="Berlin Essentials" sub="Everything you need to know on the ground" delay={0}>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {BERLIN_INFO.map((sec,si)=>
                <div key={si}>
                  <button onClick={()=>setExpEss(expEss===si?null:si)} style={{
                    width:"100%",cursor:"pointer",textAlign:"left",padding:"10px 14px",
                    background:expEss===si?C.redSoft:C.white,border:`1px solid ${expEss===si?C.redBorder:C.border}`,
                    borderLeft:`3px solid ${C.red}`,borderRadius:8,
                  }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <Mono style={{ fontSize:11,fontWeight:700,letterSpacing:1,color:C.red }}>{sec.cat}</Mono>
                      <span style={{ fontSize:16,color:C.light,transition:"transform .2s",transform:expEss===si?"rotate(180deg)":"rotate(0)" }}>&#9662;</span>
                    </div>
                  </button>
                  {expEss===si&&<div style={{ padding:"4px 0 0 10px",display:"flex",flexDirection:"column",gap:3 }}>
                    {sec.items.map((it,ii)=><Card key={ii} style={{ padding:"10px 14px" }}><div style={{ fontSize:12,fontWeight:600,color:C.black }}>{it.l}</div><div style={{ fontSize:11,color:C.med,marginTop:1 }}>{it.d}</div></Card>)}
                  </div>}
                </div>
              )}
            </div>
          </Section>
          <Section title="Quick Reference" delay={.5}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:6 }}>
              {[
                { l:"Time Diff",v:"+7 hours",s:"CEST vs CDT" },
                { l:"Currency",v:"Euro (EUR)",s:"BRING CASH!" },
                { l:"Language",v:"German",s:"Most speak English" },
                { l:"Plugs",v:"Type C/F · 230V",s:"Bring EU adapter" },
                { l:"Emergency",v:"112",s:"EU-wide" },
                { l:"Transit",v:"BVG",s:"€8.80 day pass" },
              ].map((info,i)=>
                <Card key={i} style={{ borderTop:`2px solid ${C.red}`,padding:"10px 12px" }}>
                  <Mono style={{ fontSize:7,letterSpacing:1,color:C.light }}>{info.l}</Mono>
                  <div style={{ fontSize:13,fontWeight:600,marginTop:2 }}>{info.v}</div>
                  <div style={{ fontSize:10,color:C.med,marginTop:1 }}>{info.s}</div>
                </Card>
              )}
            </div>
          </Section>
        </div>}

        {/* ═══════ NOTES ═══════ */}
        {page==="notes" && <div>
          <Section title="Trip Notes" sub="Plans, restaurant picks, reminders — anything you want to remember" delay={0}>
            <div style={{ display:"flex",gap:4,marginBottom:14,overflowX:"auto" }}>
              {Object.entries(CALENDAR).map(([d,info])=>{
                const dn=Number(d); const hasN=notes[dn]?.trim().length>0;
                return <button key={dn} onClick={()=>setDay(dn)} style={{
                  flex:"0 0 auto",padding:"5px 12px",borderRadius:5,
                  background:day===dn?C.red:hasN?C.redSoft:C.white,
                  border:`1px solid ${day===dn?C.red:hasN?C.redBorder:C.borderLight}`,
                  cursor:"pointer",fontSize:11,fontWeight:day===dn?600:400,
                  color:day===dn?C.white:C.dark,transition:"all .2s",
                }}>
                  {dn} {info.emoji}{hasN&&day!==dn&&<span style={{color:C.red,marginLeft:2}}>*</span>}
                </button>;
              })}
            </div>
            <Card style={{ padding:0 }}>
              <div style={{ padding:"10px 14px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontFamily:"'DM Serif Display',serif",fontSize:16 }}>May {day} — {CALENDAR[day]?.label}</span>
                <span style={{ fontSize:18 }}>{CALENDAR[day]?.emoji}</span>
              </div>
              <textarea value={notes[day]||""} onChange={e=>setNotes(p=>({...p,[day]:e.target.value}))}
                placeholder={`What's the plan for May ${day}? Ideas, restaurants, things to remember...`}
                style={{ width:"100%",minHeight:180,padding:"14px",border:"none",outline:"none",resize:"vertical",fontSize:13,lineHeight:1.6,color:C.black,background:"transparent" }}
              />
            </Card>
            {CALENDAR[day]?.events?.length>0&&<div style={{ marginTop:12 }}>
              <Mono style={{ fontSize:8,letterSpacing:1.5,color:C.light }}>SCHEDULED THIS DAY</Mono>
              {CALENDAR[day].events.map((ev,i)=>{
                const ec=evColor[ev.type]||evColor.tip;
                return <div key={i} style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 0" }}>
                  <div style={{ width:4,height:4,borderRadius:"50%",background:ec.dot }} />
                  <span style={{ fontSize:11,color:C.dark }}><strong>{ev.t}</strong> — {ev.title}</span>
                </div>;
              })}
            </div>}
          </Section>
        </div>}

        {/* FOOTER */}
        <div style={{ marginTop:48,paddingTop:12,borderTop:`1px solid ${C.borderLight}`,textAlign:"center" }}>
          <div style={{ height:2,background:C.red,width:32,margin:"0 auto 8px",borderRadius:1 }} />
          <Mono style={{ fontSize:8,color:C.light }}>Berlin Trip Dashboard · JLY3BV · Lutfiya Miller · Have the most incredible time, Fiya</Mono>
        </div>
      </main>
    </div>
  );
}
