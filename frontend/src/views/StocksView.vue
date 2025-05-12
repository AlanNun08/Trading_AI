<template>
  <div class="stocks-view">
    <h1>Top Gainers Today</h1>

    <div v-if="loading">Loading stock data...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="stock in stocks" :key="stock.ticker">
        <strong>{{ stock.ticker }}</strong> — 
        ${{ stock.price.toFixed(2) }} ({{ stock.percent_change.toFixed(2) }}%)
      </li>
    </ul>
  </div>
</template>

  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getGainersWithPrices } from '../services/stockService.js';

const stocks = ref([]);
const lastTickers = ref([]);
const loading = ref(true);
const error = ref(null);
let intervalId = null;

function listsChanged(newList, oldList) {
  return JSON.stringify(newList) !== JSON.stringify(oldList);
}

async function fetchAndTrackGainers() {
  try {
    const gainers = await getGainersWithPrices();
    const tickers = gainers.map(g => g.ticker);

    if (listsChanged(tickers, lastTickers.value)) {
      console.log("🔁 Gainers changed!");
      stocks.value = gainers;
      lastTickers.value = tickers;
    } else {
      console.log("✅ No change in gainers.");
    }
  } catch (err) {
    error.value = 'Failed to fetch stock data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchAndTrackGainers(); // initial fetch
  intervalId = setInterval(fetchAndTrackGainers, 6000); // fetch every 60s
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

  
  
  <style scoped>
  .stocks-view {
    padding: 1rem;
    font-family: sans-serif;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.5rem 0;
  }
  </style>
  