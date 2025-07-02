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

    <div v-if="gainWindows" class="gains-section">
      <h3>📈 Gain Opportunities</h3>

      <div v-for="(entries, label) in gainWindows" :key="label" class="gain-group">
        <button @click="toggleGroup(label)" class="collapse-btn">
          {{ label.replace('_', ' ').replace('percent', '% Gain') }}
          <span>{{ expandedGroups[label] ? '▲' : '▼' }}</span>
        </button>

        <transition name="fade">
          <ul v-show="expandedGroups[label]" class="gain-list">
            <li v-for="(entry, index) in entries" :key="index">
              {{ entry['Percentage change'] }} |
              Buy: {{ entry['Old Price'] }} @ {{ entry['Old time'] }} →
              Sell: {{ entry['New Price'] }} @ {{ entry['New time'] }}
            </li>
          </ul>
        </transition>

      </div>
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

import { getDailyPriceHistory, get30DayDailyPrices, subscribeToLivePrice } from '../services/stockPriceService.js';

import { sendToBackend, sendPriceHistoryToBackend } from '../services/api.js';

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

const gainWindows = ref(null);
const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  }
};
const expandedGroups = ref({});
function toggleGroup(label) {
  expandedGroups.value[label] = !expandedGroups.value[label];
}


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

  // Optional: still get gain windows if you want to display them somewhere else later
  gainWindows.value = await sendPriceHistoryToBackend(prices);


  console.log(prices);
  console.log('gain windows: ', gainWindows);

  const labels = prices.map(p => {
    const dateObj = new Date(p.date);
    return rangeMode.value === '30d'
      ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  });

  chartData.value = {
    labels,
    datasets: [
      {
        label: `${props.ticker} Price`,
        data: prices.map(p => parseFloat(p.price)),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1,
        pointRadius: 2,
        pointBorderWidth: 1,
        pointBorderColor: '#42A5F5',
        pointBackgroundColor: 'rgba(66, 165, 245, 0.8)'
      }
    ]
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

    // Use already-formatted time from priceData
    const labels = [...chartData.value.labels, priceData.time];
    const data = [...chartData.value.datasets[0].data, priceData.price];

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
      date: `${priceData.date} ${priceData.time}`, // ← combine directly
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

.gains-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 0.85rem;
}

.collapse-btn {
  width: 100%;
  text-align: left;
  background: #e9ecef;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.25rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.gain-list li {
  margin-bottom: 0.4rem;
  line-height: 1.4;
  padding: 0.3rem 0.4rem;
  border-left: 3px solid #0d6efd;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.gain-list li::before {
  content: '📊 ';
  margin-right: 0.3rem;
}

.gains-section h3 {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: #0d6efd;
}

.gain-group h4 {
  margin: 0.5rem 0 0.3rem;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 600;
}


/* Optional: Smooth show/hide transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}


</style>
