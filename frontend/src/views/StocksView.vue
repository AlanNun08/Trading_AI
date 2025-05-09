<template>
    <div class="stocks-view">
      <h1>Top Gainers Today</h1>
  
      <div v-if="loading">Loading stock data...</div>
      <div v-else-if="error">{{ error }}</div>
      <ul v-else>
        <li v-for="stock in stocks" :key="stock.ticker">
          <strong>{{ stock.ticker }}</strong> — 
          Open: {{ stock.open }}, Close: {{ stock.close }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getGainersWithPrices } from '../services/stockService.js';
  
  const stocks = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  onMounted(async () => {
    try {
      stocks.value = await getGainersWithPrices();
    } catch (err) {
      error.value = 'Failed to load stock data.';
      console.error(err);
    } finally {
      loading.value = false;
    }
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
  