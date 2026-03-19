/* ──────────────────────────────────────────────
   Flight itinerary data (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { Flight } from "@/lib/types";

export const FLIGHTS_OUT: Flight[] = [
  {
    id: "DL3164", aircraft: "Boeing 737-800", operator: "Delta",
    from: { code: "BHM", city: "Birmingham, AL", terminal: "TBD", tz: "CDT (UTC−5)" },
    to:   { code: "ATL", city: "Atlanta, GA", terminal: "Domestic Term-South", tz: "EDT (UTC−4)" },
    depart: "10:45 AM", departDate: "Tue, May 19",
    arrive: "12:46 PM", arriveDate: "Tue, May 19",
    seat: "21C", fare: "Delta Main Classic (V)", layoverAfter: "2h 39m",
  },
  {
    id: "DL0082", aircraft: "Boeing 767-400", operator: "Delta",
    from: { code: "ATL", city: "Atlanta, GA", terminal: "International Term", tz: "EDT (UTC−4)" },
    to:   { code: "CDG", city: "Paris-Charles de Gaulle", terminal: "Aerogare 2 Term E", tz: "CEST (UTC+2)" },
    depart: "3:25 PM", departDate: "Tue, May 19",
    arrive: "6:10 AM", arriveDate: "Wed, May 20",
    seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "1h", overnight: true,
  },
  {
    id: "DL8419", aircraft: "Airbus A318", operator: "Air France",
    from: { code: "CDG", city: "Paris-Charles de Gaulle", terminal: "Aerogare 2 Term F", tz: "CEST (UTC+2)" },
    to:   { code: "BER", city: "Berlin, Germany", terminal: "Terminal 1", tz: "CEST (UTC+2)" },
    depart: "7:10 AM", departDate: "Wed, May 20",
    arrive: "8:55 AM", arriveDate: "Wed, May 20",
    seat: "—", fare: "Delta Main Classic (V)", layoverAfter: null,
  },
];

export const FLIGHTS_RETURN: Flight[] = [
  {
    id: "DL9462", aircraft: "Airbus A321", operator: "KLM",
    from: { code: "BER", city: "Berlin, Germany", terminal: "Terminal 1", tz: "CEST (UTC+2)" },
    to:   { code: "AMS", city: "Amsterdam, Netherlands", terminal: "Terminal TBD", tz: "CEST (UTC+2)" },
    depart: "12:10 PM", departDate: "Wed, May 27",
    arrive: "1:30 PM", arriveDate: "Wed, May 27",
    seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "1h",
  },
  {
    id: "DL0137", aircraft: "Airbus A350-900", operator: "Delta",
    from: { code: "AMS", city: "Amsterdam, Netherlands", terminal: "TBD", tz: "CEST (UTC+2)" },
    to:   { code: "DTW", city: "Detroit, MI", terminal: "McNamara Terminal", tz: "EDT (UTC−4)" },
    depart: "2:30 PM", departDate: "Wed, May 27",
    arrive: "4:56 PM", arriveDate: "Wed, May 27",
    seat: "—", fare: "Delta Main Classic (V)", layoverAfter: "2h 54m",
  },
  {
    id: "DL3145", aircraft: "Boeing 717-200", operator: "Delta",
    from: { code: "DTW", city: "Detroit, MI", terminal: "McNamara Terminal", tz: "EDT (UTC−4)" },
    to:   { code: "BHM", city: "Birmingham, AL", terminal: "TBD", tz: "CDT (UTC−5)" },
    depart: "7:50 PM", departDate: "Wed, May 27",
    arrive: "8:45 PM", arriveDate: "Wed, May 27",
    seat: "—", fare: "Delta Main Classic (V)", layoverAfter: null,
  },
];

/** Booking reference */
export const BOOKING = {
  confirmation: "JLY3BV",
  passenger: "Lutfiya Miller",
  eTicket: "0062414000704",
  membership: "SkyMiles Member",
  outboundDuration: "15h 10m",
  returnDuration: "15h 35m",
} as const;
