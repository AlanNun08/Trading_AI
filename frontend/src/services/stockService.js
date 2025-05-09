import { restClient } from '@polygon.io/client-js';

const rest = restClient("qHykCRiI5wv36E1mBT4xsEG0wp5GXucJ");

function getYesterdayDate() {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
}

export async function getTopGainers() {
  try {
    const response = await rest.stocks.snapshotGainersLosers("gainers", {});
    console.log("📈 Gainers response:", response);
    if (!response.tickers || response.tickers.length === 0) {
      console.warn("⚠️ No tickers returned!");
      return [];
    }
    const tickers = response.tickers.map(stock => stock.ticker);
    console.log("✅ Extracted tickers:", tickers);
    return tickers;
  } catch (error) {
    console.error("❌ Error fetching gainers:", error);
    return [];
  }
}

export async function getStockData(ticker, date) {
  try {
    console.log(`📊 Fetching dailyOpenClose for ${ticker} on ${date}`);
    const response = await rest.stocks.dailyOpenClose(ticker, date);
    return response;
  } catch (err) {
    console.error(`❌ Error fetching data for ${ticker}:`, err);
    return null;
  }
}

export async function getGainersWithPrices() {
  const date = getYesterdayDate(); // Use yesterday for reliable data
  const tickers = await getTopGainers();
  console.log("🔁 Starting to fetch stock data...");

  const results = [];

  for (const ticker of tickers) {
    const data = await getStockData(ticker, date);
    if (data) {
      results.push({
        ticker,
        open: data.open,
        close: data.close,
        from: data.from,
        to: data.to
      });
    }
  }

  console.log("✅ Final stock results:", results);
  return results;
}
