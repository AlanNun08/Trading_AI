// src/services/stockService.js

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

// Poll gainers every X milliseconds and detect changes
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

      // Optional: call external function if provided
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

export async function getDailyPrices(ticker) {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  // Get past 5 days of data
  const end = Math.floor(Date.now() / 1000); // now in UNIX time
  const start = end - 5 * 24 * 60 * 60;       // 5 days ago

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${start}&to=${end}&token=${apiKey}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.s !== 'ok') {
      console.warn("No chart data returned.");
      return [];
    }

    return json.t.map((timestamp, i) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      close: json.c[i]
    }));
  } catch (err) {
    console.error("❌ Error fetching chart data:", err);
    return [];
  }
}

export async function generateNewsInsights(newsArray) {
  const apiKey = import.meta.env.VITE_OPENAI_KEY; // Or VITE_DEEPSEEK_KEY
  const endpoint = 'https://api.openai.com/v1/chat/completions'; // or DeepSeek URL
  const model = 'gpt-3.5-turbo'; // or 'deepseek-chat'

  const systemPrompt = `
You are a Financial News Analysis Assistant for a financial advisor. For every article, provide:

1. **Context**
2. **Short-Term Impact**
3. **Long-Term Impact**
4. **Recommendation**

Use clear, friendly language with headings or bullet points.
`;

  const results = [];

  for (const article of newsArray) {
    const userPrompt = `
Here is the news article for analysis:
- **Headline**: ${article.headline}
- **Source**: ${article.source}
- **Summary**: ${article.summary}

Please provide context, short- and long-term impact, and a recommendation.
`;

    const body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      const insight = json.choices?.[0]?.message?.content || 'No response';
      results.push({ headline: article.headline, insight });
    } catch (err) {
      console.error('❌ Error generating insight:', err);
      results.push({ headline: article.headline, insight: 'Error generating insight' });
    }
  }

  return results;
}
