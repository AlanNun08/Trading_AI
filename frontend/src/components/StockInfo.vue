<template>
    <div>
      <h2>Stock Info for {{ ticker }}</h2>
      <pre>{{ stockData }}</pre>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getStockData } from '../services/stockService.js';
  
  const ticker = 'AAPL';
  const stockData = ref(null);
  
  onMounted(async () => {
    stockData.value = await getStockData(ticker);
  });
  </script>
  