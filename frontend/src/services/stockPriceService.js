// src/services/stockService.js

import { sendToBackend} from './api.js';

export async function get30DayDailyPrices(ticker) {
  const apiKey = import.meta.env.VITE_POLY_API_KEY;
  const { startDate, endDate } = getLast30DaysRange(); // returns YYYY-MM-DD strings

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.error("❌ No daily price data returned for", ticker);
      return [];
    }

    const prices = data.results.map(item => {
      const dateObj = new Date(item.t); // item.t is in ms UTC

      const date = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const time = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"  // or use 'America/New_York' if you want market time
      });

      return {
        ticker,
        date,                // e.g., "2020-01-02"
        time,                // e.g., "9:00 AM"
        price: item.c.toString()
      };
    });

    for (const price of prices) {
      await sendToBackend(price, []);
    }

    return prices;
  } catch (err) {
    console.error("❌ Error fetching 30-day daily prices:", err);
    return [];
  }
}


const US_MARKET_HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK Jr. Day
  '2025-02-17', // Presidents' Day
  '2025-04-18', // Good Friday
  '2025-05-26', // Memorial Day
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving Day
  '2025-12-25'  // Christmas Day
];

function getMarketDay() {
  const now = new Date();

  // EST offset handling with DST (US-based approximation)
  const jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = Math.min(jan, jul) !== now.getTimezoneOffset();
  const offsetHours = isDST ? -4 : -5;

  // Convert to EST/EDT
  let est = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);

  // Helper: format date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Step 1: If weekend → backtrack to Friday
  let day = est.getDay();
  if (day === 6) est.setDate(est.getDate() - 1); // Saturday → Friday
  if (day === 0) est.setDate(est.getDate() - 2); // Sunday → Friday

  // Step 2: If holiday → backtrack until weekday and not a holiday
  let marketDate = formatDate(est);
  while (
    US_MARKET_HOLIDAYS_2025.includes(marketDate) ||
    est.getDay() === 6 || est.getDay() === 0
  ) {
    est.setDate(est.getDate() - 1);
    marketDate = formatDate(est);
  }

  return marketDate;
}

function getLast30DaysRange() {
  // Get EST time as a string and re-parse it as a Date
  const estNow = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  );

  // Clone and subtract 30 days
  const pastDate = new Date(estNow);
  pastDate.setDate(estNow.getDate() - 30);

  const format = (date) => date.toISOString().split('T')[0];

  return {
    startDate: format(pastDate),
    endDate: format(estNow),
  };
}

// Fetch full-day minute-by-minute price history for a stock from Polygon and send to backend
export async function getDailyPriceHistory(ticker) {
  const apiKey = import.meta.env.VITE_POLY_API_KEY;
  const today = getMarketDay();

  console.log("today: " , today);
  
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/${today}/${today}?adjusted=true&sort=asc&limit=50000&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.error("❌ No price data returned for", ticker);
      return [];
    }

    const prices = data.results.map(item => {
      const dateObj = new Date(item.t); // item.t is in milliseconds
    
      // Format date as YYYY-MM-DD
      const date = dateObj.toISOString().split("T")[0];
    
      // Format time in AM/PM
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // or remove if you want local time
      });
    
      return {
        ticker,
        date,      // "2025-07-01"
        time,      // "8:45 AM"
        price: item.c.toString()
      };
    });
    

    // Optional: send all to backend
    for (const price of prices) {
      await sendToBackend(price, []);
    }

    return prices;
  } catch (err) {
    console.error("❌ Error fetching price history:", err);
    return [];
  }
}

export function subscribeToLivePrice(ticker, onPriceUpdate) {
  const apiKey = import.meta.env.VITE_POLY_API_KEY;
  const baseUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`;

  console.log(`📡 Starting polling for ${ticker}`);

  let intervalId = null;

  const fetchPrice = async () => {
    try {
      const res = await fetch(baseUrl);
      const json = await res.json();

      if (json.results && json.results.length > 0) {
        const result = json.results[0];
        const timestamp = new Date(result.t); // ✅ make sure this line is here

        if (isNaN(timestamp.getTime())) {
          console.error("❌ Invalid timestamp:", result.t);
          return;
        }

        console.log('💰 Fetched price data:', result);

        onPriceUpdate({
          symbol: result.T,
          price: result.c,
          date: timestamp.toISOString().split('T')[0], // ✅ "YYYY-MM-DD"
          time: timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/New_York' // or 'UTC'
          })
        });
      } else {
        console.warn('⚠️ No price data returned from Polygon.');
      }
    } catch (err) {
      console.error('❌ Error fetching price data:', err);
    }
  };

  fetchPrice();
  intervalId = setInterval(fetchPrice, 12000);

  return () => {
    console.log(`👋 Stopping polling for ${ticker}`);
    clearInterval(intervalId);
  };
}
