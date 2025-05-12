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
