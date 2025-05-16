// src/services/stockService.js

import { sendToBackend, updateInsightOnBackend } from './api.js';
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_ALPACA_API_KEY;
const API_SECRET = import.meta.env.VITE_ALPACA_SECRET_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'APCA-API-KEY-ID': API_KEY,
    'APCA-API-SECRET-KEY': API_SECRET
  }
};

// Get the current list of top 10 gainers
export async function getGainersWithPrices() {
  try {
    const res = await fetch(
      'https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=10',
      options
    );
    const data = await res.json();

    if (!data.gainers || data.gainers.length === 0) return [];

    return data.gainers.map(stock => ({
      ticker: stock.symbol,
      price: stock.price,
      change: stock.change,
      percent_change: stock.percent_change
    }));
  } catch (err) {
    console.error("❌ Error fetching gainers:", err);
    return [];
  }
}

// Fetch full-day minute-by-minute price history for a stock from Polygon and send to backend
export async function getDailyPriceHistory(ticker, startDate, endDate) {
  const apiKey = import.meta.env.VITE_POLY_API_KEY;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/${startDate}/${endDate}?adjusted=true&sort=asc&limit=50000&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.error("❌ No price data returned for", ticker);
      return [];
    }

    const prices = data.results.map(item => {
      const dateObj = new Date(item.t);
      return {
        ticker,
        date: dateObj.toISOString(),
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


export async function monitorGainers(intervalMs = 6000, onChange = null) {
  let previousTickers = [];

  while (true) {
    const gainers = await getGainersWithPrices();
    const currentTickers = gainers.map(g => g.ticker);

    if (JSON.stringify(currentTickers) !== JSON.stringify(previousTickers)) {
      console.log("🔄 Gainers changed!");
      console.log("Previous:", previousTickers);
      console.log("Current :", currentTickers);
      previousTickers = currentTickers;

      if (onChange) onChange(gainers);
    } else {
      console.log("✅ No change at", new Date().toLocaleTimeString());
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
}

function getEasternDateString() {
  const now = new Date();
  const estDate = now.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
  });
  const [month, day, year] = estDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export async function getStockNews(ticker) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
  const today = getEasternDateString();

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${today}&to=${today}&token=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data.map(article => ({
      headline: article.headline,
      summary: article.summary,
      source: article.source,
      datetime: article.datetime,
    }));
  } catch (err) {
    console.error(`❌ Error fetching news for ${ticker}:`, err);
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
        console.log('💰 Fetched price data:', result);
        onPriceUpdate({
          symbol: result.T,
          price: result.c,
          timestamp: new Date(result.t).toISOString()
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


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateNewsInsights(newsArray, onInsightReceived) {
  const systemPrompt = `
You are a Financial News Analysis Assistant for a financial advisor. For every article, provide:

1. **Context**
2. **Short-Term Impact**
3. **Long-Term Impact**
4. **Recommendation**

Use clear, friendly language with headings or bullet points.
`;

  for (const article of newsArray) {
    const userPrompt = `
Here is the news article for analysis:
- **Headline**: ${article.headline}
- **Source**: ${article.source}
- **Summary**: ${article.summary}

Please provide context, short- and long-term impact, and a recommendation.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      });

      const content = completion.choices?.[0]?.message?.content || "No response";

      const updated = {
        ...article,
        summary: content // ✅ Replace 'summary' with the generated insight
      };

      onInsightReceived(updated); // Update in UI
      console.log("📤 News sending to backend:", updated);
      await updateInsightOnBackend(updated); // Update in DB

    } catch (err) {
      console.error("❌ Error generating insight:", err);
      onInsightReceived({ ...article, summary: "⚠️ Error generating insight" });
    }
  }
}
