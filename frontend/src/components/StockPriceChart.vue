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
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.stocks-view h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.range-toggle {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.range-toggle button {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background-color: #ffffff;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.range-toggle button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.range-toggle button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.range-toggle button:hover:not(.active) {
  background-color: #f7fafc;
  border-color: #667eea;
  transform: translateY(-2px);
}

.gains-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.gains-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gain-group {
  margin-bottom: 1rem;
}

.collapse-btn {
  width: 100%;
  text-align: left;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #1a202c;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
  border-color: #667eea;
  transform: translateX(3px);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
}

.gain-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gain-list li {
  line-height: 1.5;
  padding: 0.75rem 1rem;
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-size: 0.9rem;
  color: #4a5568;
  transition: all 0.3s ease;
}

.gain-list li:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left-color: #764ba2;
}

.gain-list li::before {
  content: '📊 ';
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Smooth show/hide transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Chart container - make it responsive */
canvas {
  max-width: 100%;
  height: auto !important;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stocks-view h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .range-toggle {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .range-toggle button {
    flex: 1;
    min-width: 120px;
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }

  .gains-section {
    padding: 1.25rem;
    margin-top: 1.5rem;
  }

  .gains-section h3 {
    font-size: 1.2rem;
  }

  .collapse-btn {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
  }

  .gain-list li {
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .stocks-view h2 {
    font-size: 1.2rem;
  }

  .range-toggle {
    flex-direction: column;
  }

  .range-toggle button {
    width: 100%;
    min-width: unset;
  }

  .gains-section {
    padding: 1rem;
    border-radius: 12px;
  }

  .gains-section h3 {
    font-size: 1.1rem;
    margin-bottom: 0.875rem;
  }

  .collapse-btn {
    font-size: 0.85rem;
    padding: 0.625rem 0.75rem;
  }

  .gain-list li {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }

  .gain-list li::before {
    font-size: 1rem;
  }
}
</style>
