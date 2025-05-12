<template>
  <div class="dashboard">
    <h1>📊 Stock Dashboard</h1>

    <TopGainers @selectTicker="setTicker" />

    <div v-if="selectedTicker" class="flex-board">
      <StockNews :ticker="selectedTicker" />
      <StockPriceChart :ticker="selectedTicker" />
    </div>

    <div v-else class="placeholder">
      <p>Select a stock from the gainers list to see news and price chart.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopGainers from '@/components/TopGainers.vue';
import StockNews from '@/components/StockNews.vue';
import StockPriceChart from '@/components/StockPriceChart.vue';

const selectedTicker = ref(null);
function setTicker(ticker) {
  selectedTicker.value = ticker;
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  font-family: sans-serif;
}

.flex-board {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

/* Make each section take full width on mobile, half on desktop */
.flex-board > * {
  flex: 1 1 100%; /* full width on small screens */
}

@media (min-width: 768px) {
  .flex-board > * {
    flex: 1 1 45%; /* two items per row on desktop */
  }
}

.placeholder {
  margin-top: 2rem;
  font-style: italic;
  color: #888;
}
</style>
