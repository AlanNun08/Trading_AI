<template>
  <div class="stocks-view">
    <h2>Latest News: {{ ticker }}</h2>

    <!-- 🔘 Toggle Insights Button -->
    <button @click="toggleInsightLoop" class="insight-btn">
      {{ looping ? '🛑 Stop Insights' : '🧠 Get Insights' }}
    </button>

    <!-- 📰 News List -->
    <div v-if="loading">Loading news...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="(article, index) in news" :key="index">
        <strong>{{ article.headline }}</strong>
        <p class="meta">{{ formatDate(article.datetime) }} — <em>{{ article.source }}</em></p>
        <p>{{ article.summary }}</p>

        <!-- 💡 AI Insight Section -->
        <div v-if="insights[index]" class="insight">
          <h4>Advisor Insight:</h4>
          <p>{{ insights[index].insight }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { getStockNews, generateNewsInsights } from '../services/stockService.js';

const props = defineProps({ ticker: String });

const news = ref([]);
const insights = ref([]);
const loading = ref(true);
const error = ref(null);
const looping = ref(false);
let loopInterval = null;

const formatDate = (timestamp) =>
  new Date(timestamp * 1000).toLocaleString();

async function fetchNews() {
  try {
    news.value = await getStockNews(props.ticker);
    insights.value = [];
  } catch (err) {
    error.value = 'Failed to fetch news.';
  } finally {
    loading.value = false;
  }
}

async function generateInsights() {
  if (!news.value.length) return;
  insights.value = await generateNewsInsights(news.value);
}

function toggleInsightLoop() {
  looping.value = !looping.value;

  if (looping.value) {
    generateInsights(); // run immediately
    loopInterval = setInterval(generateInsights, 10000); // every 10s (adjust as needed)
  } else {
    clearInterval(loopInterval);
    loopInterval = null;
  }
}

onMounted(fetchNews);
watch(() => props.ticker, fetchNews);
</script>


<style scoped>
.stocks-view {
  padding: 1rem;
  font-family: sans-serif;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 1.5rem;
}
.meta {
  font-size: 0.85rem;
  color: #666;
}
.insight-btn {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: #007bff;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
.insight-btn:hover {
  background-color: #0056b3;
}
.insight {
  background-color: #f5f5f5;
  padding: 1rem;
  margin-top: 0.5rem;
  border-left: 4px solid #007bff;
}
</style>
