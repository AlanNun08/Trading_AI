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
  gap: 0.75rem;
}

.gainers-header {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.gainers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stock-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stock-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.stock-item:hover::before {
  transform: scaleY(1);
}

.stock-item:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.stock-item:active {
  transform: translateX(3px) scale(0.98);
}

.stock-ticker {
  font-weight: 700;
  font-size: 1.05rem;
  color: #1a202c;
  letter-spacing: 0.3px;
  grid-column: 1;
}

.stock-price {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
  grid-column: 1;
  margin-top: -0.25rem;
}

.stock-change {
  font-weight: 700;
  font-size: 1.1rem;
  text-align: right;
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;
}

.stock-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.stock-change.positive::before {
  content: '▲ ';
  font-size: 0.8rem;
}

.stock-change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.stock-change.negative::before {
  content: '▼ ';
  font-size: 0.8rem;
}

/* Loading state */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-item {
  height: 70px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .stock-item {
    padding: 0.875rem;
  }

  .stock-ticker {
    font-size: 1rem;
  }

  .stock-price {
    font-size: 0.9rem;
  }

  .stock-change {
    font-size: 1rem;
    padding: 0.4rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .gainers-header {
    font-size: 1.1rem;
  }

  .stock-item {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .stock-ticker {
    font-size: 0.95rem;
  }

  .stock-price {
    font-size: 0.85rem;
  }

  .stock-change {
    font-size: 0.95rem;
    padding: 0.35rem 0.5rem;
  }
}
</style>

