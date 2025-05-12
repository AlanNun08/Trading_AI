<template>
  <div class="stocks-view">
    <h2>{{ ticker }} Stock Price Chart</h2>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else>Loading chart...</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';
import { getDailyPrices } from '../services/stockService.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

// ✅ Accept ticker as a prop
const props = defineProps({
  ticker: {
    type: String,
    required: true
  }
});

const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  }
};

// ✅ Fetch data and update chart
async function loadChartData() {
  chartData.value = null;
  const data = await getDailyPrices(props.ticker);
  if (data.length) {
    chartData.value = {
      labels: data.map(p => p.date),
      datasets: [{
        label: `${props.ticker} Price`,
        data: data.map(p => p.close),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
      }]
    };
  }
}

// ✅ Load when mounted or ticker changes
onMounted(loadChartData);
watch(() => props.ticker, loadChartData);
</script>

<style scoped>
.stocks-view {
  padding: 1rem;
  font-family: sans-serif;
}
</style>
