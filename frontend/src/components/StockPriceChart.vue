<template>
  <div class="stocks-view">
    <h2>{{ ticker }} Stock Price Chart</h2>
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

import { getDailyPriceHistory, subscribeToLivePrice } from '../services/stockService.js';
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

function getLocalISODate(date) {
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
}

async function setupChart() {
  if (unsubscribe) unsubscribe();
  callCount = 0;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const startDate = getLocalISODate(yesterday); // e.g., "2025-05-14"
  const endDate = getLocalISODate(today);       // e.g., "2025-05-15"


  const prices = await getDailyPriceHistory(props.ticker, startDate, endDate);

  chartData.value = {
    labels: prices.map(p => new Date(p.date).toLocaleTimeString()),
    datasets: [{
      label: `${props.ticker} Price`,
      data: prices.map(p => p.price),
      fill: false,
      borderColor: '#42A5F5',
      tension: 0.1
    }]
  };

  console.log(`📊 Chart loaded with ${prices.length} points from ${startDate} to ${endDate}`);
  startLiveCharting();
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
</style>
