<!-- TopGainers.vue -->
<template>
  <div class="stocks-view">
    <h2 class="gainers-header">Top Gainers Today</h2>
    <ul class="gainers-list">
      <li
        v-for="stock in stocks"
        :key="stock.ticker"
        @click="select(stock.ticker)"
        class="stock-item"
      >
        <span class="stock-ticker">{{ stock.ticker }}</span>
        <span class="stock-price">${{ stock.price.toFixed(2) }}</span>
        <span
          class="stock-change"
          :class="{ positive: stock.percent_change > 0, negative: stock.percent_change < 0 }"
        >
          ({{ stock.percent_change.toFixed(2) }}%)
        </span>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getGainersWithPrices } from '../services/stockGainerService.js';
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
.stocks-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gainers-header {
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}

.gainers-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  font-size: 0.95rem;
}

.stock-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.stock-ticker {
  font-weight: 600;
  color: #1d3557;
  flex: 1;
}

.stock-price {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  text-align: right;
}

.stock-change {
  font-weight: 600;
  min-width: 70px;
  text-align: right;
}

.stock-change.positive {
  color: #28a745; /* green */
}

.stock-change.negative {
  color: #dc3545; /* red */
}
</style>

