<template>
  <div class="stocks-view">
    <h2>{{ ticker }} Stock Price Chart</h2>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else>Loading chart...</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
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
import { subscribeToLivePrice } from '../services/stockService.js';
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

// ⏱️ Reset call count every 60s
function startRateLimitReset() {
  callTimer = setInterval(() => {
    callCount = 0;
  }, 60000);
}

// 🚀 Get data from backend (checks DB or calls Polygon API if not cached)
async function loadChartHistory(ticker) {
  try {
    const res = await axios.get(`/api/data/prices?ticker=${ticker}`);
    const prices = res.data;

    console.log(`🛬 Response for ${ticker}:`, prices);

    if (!Array.isArray(prices) || prices.length === 0) {
      console.warn(`⚠️ No data returned for ${ticker}`);
      return;
    }

    chartData.value = {
      labels: prices.map(p => new Date(p.date).toLocaleTimeString()),
      datasets: [{
        label: `${ticker} Price`,
        data: prices.map(p => p.price),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
      }]
    };

    console.log(`📊 Loaded ${prices.length} points from DB/API`);
  } catch (err) {
    console.error('❌ Failed to load price history:', err);
  }
}


// 📡 Subscribe to live prices using polling (limited to 5/min)
function startLiveCharting() {
  if (unsubscribe) unsubscribe();

  unsubscribe = subscribeToLivePrice(props.ticker, async (priceData) => {
    if (!chartData.value || !chartData.value.labels || !chartData.value.datasets?.[0]?.data) {
    console.error('❌ chartData not fully initialized');
    return;
  }


    if (callCount >= 5) return;

    const time = new Date(priceData.timestamp).toLocaleTimeString();

    chartData.value.labels.push(time);
    chartData.value.datasets[0].data.push(priceData.price);

    if (chartData.value.labels.length > 30) {
      chartData.value.labels.shift();
      chartData.value.datasets[0].data.shift();
    }

    await sendToBackend({
      ticker: priceData.symbol,
      date: priceData.timestamp,
      price: priceData.price
    }, null);

    callCount++;
    console.log(`📈 Live update ${callCount}/5 this minute`);
  });
}



// 🧩 Full setup when ticker is mounted or changes
async function setupChart() {
  if (unsubscribe) unsubscribe();
 
  await loadChartHistory(props.ticker); // 1 backend call
  startLiveCharting();                  // live updates after history
}

// Lifecycle
onMounted(() => {
  setupChart();
  startRateLimitReset();
});

watch(() => props.ticker, setupChart);

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
