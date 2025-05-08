import { restClient } from '@polygon.io/client-js';

const rest = restClient(import.meta.env.VITE_POLY_API_KEY); // Using Vite-style env variables

export async function getStockData(ticker) {
  try {
    const response = await rest.stocks.dailyOpenClose(ticker, "2024-05-01");
    return response;
  } catch (err) {
    console.error("Error fetching stock data:", err);
    throw err;
  }
}
