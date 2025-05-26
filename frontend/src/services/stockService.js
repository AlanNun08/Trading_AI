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
      const dateObj = new Date(item.t);
      return {
        ticker,
        date: dateObj.toISOString().split('T')[0], // YYYY-MM-DD
        price: item.c.toString(), // closing price as string
      };
    });

    // Optional: Send each price to backend
    for (const price of prices) {
      await sendToBackend(price, []); // adapt as needed
    }

    return prices;
  } catch (err) {
    console.error("❌ Error fetching 30-day daily prices:", err);
    return [];
  }
}

function getMarketDay() {
  const now = new Date();

  // EST offset: use -5 in winter, -4 in summer (EDT)
  // We'll assume DST is in effect from March to November (U.S. market standard)
  const jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = Math.min(jan, jul) !== now.getTimezoneOffset();
  const offsetHours = isDST ? -4 : -5;

  // Convert to EST/EDT
  const est = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);

  const day = est.getDay(); // 0 = Sunday, 6 = Saturday

  // Adjust to Friday if it's weekend
  if (day === 6) est.setDate(est.getDate() - 1); // Saturday → Friday
  if (day === 0) est.setDate(est.getDate() - 2); // Sunday → Friday

  return est.toISOString().split('T')[0];
}

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

  // Convert to Eastern Time using toLocaleString
  const estNow = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );

  // Get the day of the week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = estNow.getDay();

  // If Saturday (6), subtract 1 day; if Sunday (0), subtract 2 days
  if (dayOfWeek === 6) {
    estNow.setDate(estNow.getDate() - 1); // Go back to Friday
  } else if (dayOfWeek === 0) {
    estNow.setDate(estNow.getDate() - 2); // Go back to Friday
  }

  // Format the final adjusted date as YYYY-MM-DD
  const year = estNow.getFullYear();
  const month = String(estNow.getMonth() + 1).padStart(2, '0');
  const day = String(estNow.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

export async function getStockNews(ticker) {
  const today = getEasternDateString();
  const allArticles = [];
  const { startDate, endDate } = getLast30DaysRange();

  // 1. Finnhub
  try {
    const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
    const finnhubUrl = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${startDate}&to=${endDate}&token=${apiKey}`;
    const res = await fetch(finnhubUrl);
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      data.forEach(article => {
        allArticles.push({
          ticker,
          headline: article.headline,
          summary: article.summary,
          source: article.source || 'Finnhub',
          datetime: article.datetime,
        });
      });
    } else {
      console.log(`ℹ️ No Finnhub news for ${ticker}`);
    }
  } catch (err) {
    console.error(`❌ Finnhub error for ${ticker}:`, err);
  }

  // 2. Newsdata.io
  try {
    const key = import.meta.env.VITE_NEWSDATA_API_KEY;
    const url = `https://newsdata.io/api/1/news?apikey=${key}&q=${ticker}&language=en&category=business`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (Array.isArray(data.results) && data.results.length > 0) {
      data.results.forEach(article => {
        allArticles.push({
          ticker,
          headline: article.title,
          summary: article.description,
          source: article.source_id || 'Newsdata.io',
          datetime: new Date(article.pubDate).getTime() / 1000,
        });
      });
    } else {
      console.log(`ℹ️ No Newsdata.io results for ${ticker}`);
    }
  } catch (err) {
    console.error(`❌ Newsdata.io error for ${ticker}:`, err);
  }

  // 3. Marketaux
  try {
    const key = import.meta.env.VITE_MARKETAUX_API_KEY;
    const url = `https://api.marketaux.com/v1/news/all?symbols=${ticker}&filter_entities=true&language=en&api_token=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach(article => {
        allArticles.push({
          ticker,
          headline: article.title,
          summary: article.description,
          source: article.source || 'Marketaux',
          datetime: new Date(article.published_at).getTime() / 1000,
        });
      });
    } else {
      console.log(`ℹ️ No Marketaux news for ${ticker}`);
    }
  } catch (err) {
    console.error(`❌ Marketaux error for ${ticker}:`, err);
  }

  // 4. GNews
  try {
    const key = import.meta.env.VITE_GNEWS_API_KEY;
    const url = `https://gnews.io/api/v4/search?q=${ticker}&token=${key}&lang=en`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (Array.isArray(data.articles) && data.articles.length > 0) {
      data.articles.forEach(article => {
        allArticles.push({
          ticker,
          headline: article.title,
          summary: article.description,
          source: article.source?.name || 'GNews',
          datetime: new Date(article.publishedAt).getTime() / 1000,
        });
      });
    } else {
      console.log(`ℹ️ No GNews results for ${ticker}`);
    }
  } catch (err) {
    console.error(`❌ GNews error for ${ticker}:`, err);
  }

  const uniqueArticles = removeSimilarArticles(allArticles, 0.5);

  // ✅ Send articles to backend after collection
  if (uniqueArticles.length > 0) {
    for (const article of uniqueArticles) {
      const payload = {
        stock: {
          ticker: article.ticker,
          date: new Date(article.datetime * 1000).toISOString().split('T')[0],
          price: "0.0"
        },
        news: [{
          ticker: article.ticker,
          date: new Date(article.datetime * 1000).toISOString().split('T')[0],
          headline: article.headline,
          source: article.source,
          aiSummary: article.summary
        }]
      };

      try {
        const res = await fetch('http://localhost:8080/api/data/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.text();
        console.log("📤 Sent article to backend:", article.headline, result);
      } catch (err) {
        console.error("❌ Failed to send article to backend:", article.headline, err);
      }
    }
  } else {
    console.warn(`⚠️ No news articles found for ${ticker}. Nothing sent to backend.`);
  }
  console.log(`📰 All fetched articles: ${allArticles.length}`);
  console.log(`🧹 After deduplication: ${uniqueArticles.length}`);

  return uniqueArticles;
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
  dangerouslyAllowBrowser: true,
});

export async function generateNewsInsights(newsArray, onInsightReceived, ticker) {
  const systemPrompt = `
  You are a financial assistant. For each news article, provide a structured analysis:

  - Context
  - Short-Term Impact
  - Long-Term Outlook
  - Actionable Advice

  Respond using the function definition provided.
  `;

  const functions = [
    {
      type: "function", // ✅ This line is required by OpenAI
      name: "summarizeArticle",
      description: "Summarize a financial article into structured insights.",
      parameters: {
        type: "object",
        properties: {
          context: {
            type: "string",
            description: "Brief background about the article and why it matters",
          },
          short_term: {
            type: "string",
            description: "Likely short-term effect on stock price or sentiment",
          },
          long_term: {
            type: "string",
            description: "Potential long-term company or industry implications",
          },
          recommendation: {
            type: "string",
            description: "Suggested takeaway or next steps for an investor",
          },
        },
        required: ["context", "short_term", "long_term", "recommendation"],
      },
    },
  ];


  for (let i = 0; i < newsArray.length; i++) {
    const article = newsArray[i];
    const userPrompt = `
Analyze the following article and fill in the insight fields:

- Headline: ${article.headline}
- Source: ${article.source}
- Summary: ${article.summary}
`;

    try {
      console.log(`🔎 Analyzing article ${i + 1}/${newsArray.length}: "${article.headline}"`);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: functions[0], // ✅ cleaner and reusable
          }
        ],
        tool_choice: "auto",
      });
      

      const toolResult = completion.choices[0].message.tool_calls?.[0]?.function?.arguments;
      const parsed = toolResult ? JSON.parse(toolResult) : null;

      if (!parsed) {
        throw new Error("No valid structured response returned.");
      }

      const updated = {
        ticker,
        date: new Date(article.datetime * 1000).toISOString().split('T')[0],
        headline: article.headline,
        source: article.source,
        aiSummary: parsed,
      };

      // ✅ Display immediately
      onInsightReceived(updated);
      console.log("✅ Insight generated:", updated);

      // Save to backend
      await updateInsightOnBackend(updated);

    } catch (err) {
      console.error(`❌ Failed insight for: ${article.headline}`, err);

      const fallback = {
        ticker,
        date: new Date(article.datetime * 1000).toISOString().split('T')[0],
        headline: article.headline,
        source: article.source,
        aiSummary: {
          context: "",
          short_term: "",
          long_term: "",
          recommendation: "⚠️ Error generating insight.",
        },
      };

      onInsightReceived(fallback);
    }

    // Optional: delay to space out requests
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log("🎉 All insights generated and sent.");
}

function stringSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longerLength - editDistance) / longerLength;
}

function getEditDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function removeSimilarArticles(articles, threshold = 0.8) {
  const unique = [];

  for (const current of articles) {
    const currentKey = (current.headline + current.summary).toLowerCase().trim();

    const isDuplicate = unique.some(existing => {
      const existingKey = (existing.headline + existing.summary).toLowerCase().trim();
      const similarity = stringSimilarity(currentKey, existingKey);
      return similarity >= threshold;
    });

    if (!isDuplicate) {
      unique.push(current);
    }
  }

  return unique;
}
