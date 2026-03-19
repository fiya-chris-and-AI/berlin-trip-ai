/* ──────────────────────────────────────────────
   Explore Berlin spots (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { ExploreCategory } from "@/lib/types";

export const EXPLORE: ExploreCategory[] = [
  {
    cat: "Romantic Walks",
    spots: [
      { name: "Tiergarten Park", vibe: "Berlin's Central Park — winding paths, hidden gardens, quiet benches", area: "Mitte" },
      { name: "East Side Gallery → Oberbaumbrücke", vibe: "Walk the longest remaining stretch of the Berlin Wall, then cross the iconic bridge at sunset", area: "Friedrichshain" },
      { name: "Landwehr Canal (Kreuzberg side)", vibe: "Tree-lined canal path, locals lounging on the banks, totally relaxed energy", area: "Kreuzberg" },
      { name: "Tempelhofer Feld", vibe: "Former airport turned massive open park — surreal, wide-open, magical at golden hour", area: "Neukölln" },
    ],
  },
  {
    cat: "Coffee & Cafés",
    spots: [
      { name: "Bonanza Coffee Roasters", vibe: "Berlin's specialty coffee pioneers. Minimal, beautiful, perfect flat whites", area: "Kreuzberg/Prenzlauer Berg" },
      { name: "The Barn", vibe: "Serious third-wave coffee in a gorgeous space. Multiple locations.", area: "Mitte" },
      { name: "Five Elephant", vibe: "Coffee + legendary cheesecake. Cozy Kreuzberg institution.", area: "Kreuzberg" },
      { name: "Café am Neuen See", vibe: "Lakeside beer garden in Tiergarten. Rowboats available!", area: "Tiergarten" },
    ],
  },
  {
    cat: "Dinner Spots",
    spots: [
      { name: "Crackers", vibe: "Stunning space, creative European cuisine, feels like a scene from a film", area: "Mitte" },
      { name: "House of Small Wonder", vibe: "Japanese-Berlin fusion, intimate treehouse-like interior, very romantic", area: "Mitte" },
      { name: "Ora", vibe: "Former pharmacy turned restaurant. Candlelit, gorgeous, seasonal menu", area: "Kreuzberg" },
      { name: "Katz Orange", vibe: "Farm-to-table in a hidden courtyard. Incredible slow-cooked meats.", area: "Mitte" },
      { name: "Mustafa's Gemüse Kebap", vibe: "Berlin's most famous döner. The line is worth it. Mandatory Berlin experience.", area: "Kreuzberg" },
    ],
  },
  {
    cat: "Experiences",
    spots: [
      { name: "Markthalle Neun (Thursday)", vibe: "Street Food Thursday — incredible food stalls from around the world. Go hungry!", area: "Kreuzberg" },
      { name: "Badeschiff", vibe: "Floating swimming pool on the Spree river. Pool party vibes in May.", area: "Treptow" },
      { name: "Klunkerkranich", vibe: "Rooftop bar on top of a parking garage. Sunset views, DJ sets, garden vibes.", area: "Neukölln" },
      { name: "Mauerpark Flea Market (Sunday)", vibe: "Massive flea market + outdoor karaoke. Very Berlin.", area: "Prenzlauer Berg" },
      { name: "Berlin Fernsehturm (TV Tower)", vibe: "360° views from the top. Touristy but worth it for the panorama.", area: "Alexanderplatz" },
    ],
  },
  {
    cat: "Night Out",
    spots: [
      { name: "Monkey Bar", vibe: "Rooftop cocktails overlooking the zoo + city. Stunning at night.", area: "Charlottenburg" },
      { name: "Clärchens Ballhaus", vibe: "Historic 1913 ballroom. Dancing, charm, and a fairy-light garden.", area: "Mitte" },
      { name: "Prater Garten", vibe: "Berlin's oldest beer garden (1837). Chestnut trees, communal tables, local vibes.", area: "Prenzlauer Berg" },
      { name: "Michelberger Hotel Bar", vibe: "Cool crowd, creative cocktails, eclectic music. Very Friedrichshain.", area: "Friedrichshain" },
    ],
  },
];
