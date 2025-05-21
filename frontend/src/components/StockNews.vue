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
        <div v-if="insights[index] && insights[index].aiSummary" class="insight">
          <h4>Advisor Insight</h4>

          <template v-for="(section, sIndex) in formatInsight(insights[index].aiSummary)" :key="sIndex">
            <h5 class="section-title">{{ section.title }}</h5>
            <ul v-if="section.content.includes('- ')">
              <li v-for="(item, i) in section.content.split('- ').filter(Boolean)" :key="i">
                {{ item.trim() }}
              </li>
            </ul>
            <p v-else>{{ section.content }}</p>
          </template>
        </div>

      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
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

  function getDateRange() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now - offset).toISOString().split('T')[0];
  const yesterdayISO = new Date(now - offset - 86400000).toISOString().split('T')[0];
  return { today: localISO, yesterday: yesterdayISO };
}


async function fetchNews() {
  loading.value = true;
  try {
    
    const { today, yesterday } = getDateRange();
    news.value = await getStockNews(props.ticker, yesterday, today);
    insights.value = [];

    if (Array.isArray(news.value) && news.value.length > 0) {
      await sendNewsToBackend(news.value, props.ticker);
    } else {
      console.warn('⚠️ No news fetched. Skipping backend send.');
      return; // exit early
    }
  } catch (err) {
    error.value = 'Failed to fetch news.';
  } finally {
    loading.value = false;
  }
}


async function sendNewsToBackend(newsList, ticker) {
  if (!newsList || newsList.length === 0) return;

  const date = new Date().toISOString().split('T')[0];

  for (const article of newsList) {
    if (!article || !article.headline || !article.summary) continue;

    const payload = {
      stock: {
        ticker: ticker,
        date: date,
        price: "0.0"
      },
      news: [{
        ticker: ticker,
        date: date,
        headline: article.headline,
        source: article.source,
        aiSummary: article.summary
      }]
    };

    try {
      const response = await fetch('http://localhost:8080/api/data/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      console.log(`✅ Sent news: ${article.headline}`, result);
    } catch (err) {
      console.error(`❌ Failed to send news: ${article.headline}`, err);
    }
  }
}
function formatInsight(aiSummary) {
  const lines = aiSummary.split('### ').filter(Boolean);
  return lines.map(section => {
    const [titleLine, ...rest] = section.split('\n');
    return {
      title: titleLine.trim(),
      content: rest.join('\n').trim()
    };
  });
}


function generateInsights() {
  if (!news.value.length) return;

  insights.value = Array(news.value.length).fill(null);

  generateNewsInsights(news.value, (insight) => {
    const index = news.value.findIndex(n => n.headline === insight.headline);
    if (index !== -1 && looping.value) {
      insights.value[index] = insight;
    }
  }, props.ticker); // ✅ pass the current ticker
}


function toggleInsightLoop() {
  looping.value = !looping.value;

  if (looping.value) {
    generateInsights();
    loopInterval = setInterval(generateInsights, 10000);
  } else {
    clearInterval(loopInterval);
    loopInterval = null;
  }
}

onMounted(fetchNews);
watch(() => props.ticker, fetchNews);
onBeforeUnmount(() => clearInterval(loopInterval));
</script>

<style scoped>
.stocks-view {
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.meta {
  font-size: 0.85rem;
  color: #6c757d;
}

.insight-btn {
  margin: 1rem 0;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #007bff, #339af0);
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: background 0.3s ease, transform 0.2s ease;
}

.insight-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.insight {
  background-color: #eef4ff;
  padding: 1.25rem 1.5rem;
  margin-top: 0.75rem;
  border-left: 4px solid #339af0;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  color: #212529;
  transition: box-shadow 0.3s ease;
}

.insight:hover {
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1c3d5a;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.25rem;
}

.insight ul {
  margin-left: 1.5rem;
  padding-left: 0.5rem;
  list-style-type: disc;
  color: #374151;
}

.insight ul li {
  margin-bottom: 0.4rem;
  line-height: 1.5;
}


</style>
