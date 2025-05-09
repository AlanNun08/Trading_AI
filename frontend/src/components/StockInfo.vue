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
  });
  </script>
  
  
  