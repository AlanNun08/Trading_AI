<template>
  <div>
    <h2>Top Gainers – Daily Prices</h2>
    <ul>
      <li v-for="stock in stocks" :key="stock.ticker">
        {{ stock.ticker }} | Open: {{ stock.open }} | Close: {{ stock.close }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGainersWithPrices } from '../services/stockService.js';

const stocks = ref([]);

onMounted(async () => {
  stocks.value = await getGainersWithPrices();
  await sendStockDataToBackend(stocks.value);
});

async function sendStockDataToBackend(stockList) {
  for (const stock of stockList) {
    const payload = {
      stock: {
        ticker: stock.ticker,
        date: stock.date ?? new Date().toISOString().split('T')[0],
        price: stock.close.toString()
      },
      news: []  // news will be handled in the other component
    };

    try {
      const response = await fetch('http://localhost:8080/api/data/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.text();
      console.log(`✅ Sent ${stock.ticker}:`, result);
    } catch (error) {
      console.error(`❌ Failed to send ${stock.ticker}:`, error);
    }
  }
}
</script>
