<!-- TopGainers.vue -->
<template>
  <div class="stocks-view">
    <h2>Top Gainers Today</h2>
    <ul>
      <li
        v-for="stock in stocks"
        :key="stock.ticker"
        @click="select(stock.ticker)"
        class="stock-item"
      >
        <strong>{{ stock.ticker }}</strong> —
        ${{ stock.price.toFixed(2) }} ({{ stock.percent_change.toFixed(2) }}%)
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getGainersWithPrices } from '../services/stockService.js';
const emit = defineEmits(['selectTicker']);

const stocks = ref([]);
const loading = ref(true);
const error = ref(null);

function select(ticker) {
  emit('selectTicker', ticker);
}

async function fetchGainers() {
  stocks.value = await getGainersWithPrices();
  loading.value = false;
}

onMounted(fetchGainers);
</script>

<style scoped>
.stock-item {
  cursor: pointer;
  margin-bottom: 0.5rem;
}
.stock-item:hover {
  background-color: #f0f0f0;
}
</style>
