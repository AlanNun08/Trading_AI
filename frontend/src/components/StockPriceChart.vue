<template>
  <div class="stocks-view">
    <h2>{{ ticker }} Stock Price Chart</h2>

    <div class="range-toggle">
      <button
        :class="{ active: rangeMode === '1d' }"
        @click="changeRange('1d')"
      >
        1 Day
      </button>
      <button
        :class="{ active: rangeMode === '30d' }"
        @click="changeRange('30d')"
      >
        30 Days
      </button>
    </div>

    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else>Loading chart...</p>
  </div>
</template>


<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js';

import { getDailyPriceHistory, get30DayDailyPrices, subscribeToLivePrice } from '../services/stockService.js';

import { sendToBackend } from '../services/api.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const props = defineProps({
  ticker: { type: String, required: true }
});

const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  }
};

let unsubscribe = null;
let callCount = 0;
let callTimer = null;

function startRateLimitReset() {
  if (callTimer) clearInterval(callTimer);
  callCount = 0;
  callTimer = setInterval(() => {
    callCount = 0;
  }, 60000);
}
const rangeMode = ref('1d'); // '1d' is default

function changeRange(mode) {
  if (rangeMode.value !== mode) {
    rangeMode.value = mode;
    setupChart();
  }
}

async function setupChart() {
  if (unsubscribe) unsubscribe();
  callCount = 0;

  let prices = [];

  if (rangeMode.value === '30d') {
    prices = await get30DayDailyPrices(props.ticker);
  } else {
    prices = await getDailyPriceHistory(props.ticker);
  }

  chartData.value = {
    labels: prices.map(p => {
      const dateObj = new Date(p.date);
      return rangeMode.value === '30d'
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // e.g., May 25
        : dateObj.toLocaleTimeString('en-US'); // e.g., 3:15 PM
    }),
    datasets: [{
      label: `${props.ticker} Price`,
      data: prices.map(p => p.price),
      fill: false,
      borderColor: '#42A5F5',
      tension: 0.1
    }]
  };

  if (rangeMode.value === '1d') {
    startLiveCharting();
  }
}


function startLiveCharting() {
  if (unsubscribe) unsubscribe();

  unsubscribe = subscribeToLivePrice(props.ticker, async (priceData) => {
    if (!chartData.value) return;
    if (callCount >= 5) return;

    const time = new Date(priceData.timestamp).toLocaleTimeString();

    // Copy existing chart data to preserve reactivity
    const labels = [...chartData.value.labels, time];
    const data = [...chartData.value.datasets[0].data, priceData.price];

    // Trim to 30 points
    if (labels.length > 30) {
      labels.shift();
      data.shift();
    }

    chartData.value = {
      labels,
      datasets: [{
        ...chartData.value.datasets[0],
        data
      }]
    };

    await sendToBackend({
      ticker: priceData.symbol,
      date: priceData.timestamp,
      price: priceData.price
    }, []);

    callCount++;
    console.log(`📈 Live update ${callCount}/5 for ${props.ticker}`);
  });
}


onMounted(() => {
  setupChart();
  startRateLimitReset();
});

watch(() => props.ticker, () => {
  console.log(`🔁 Switching to new ticker: ${props.ticker}`);
  setupChart();
  startRateLimitReset();
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  if (callTimer) clearInterval(callTimer);
});

</script>

<style scoped>
.stocks-view {
  padding: 1rem;
  font-family: sans-serif;
}
.range-toggle {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.range-toggle button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.range-toggle button.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0a58ca;
}

.range-toggle button:hover {
  background-color: #e7f1ff;
}

</style>
