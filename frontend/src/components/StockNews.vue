<template>
    <div class="stocks-view">
      <h2>Latest News: {{ ticker }}</h2>
  
      <div v-if="loading">Loading news...</div>
      <div v-else-if="error">{{ error }}</div>
      <ul v-else>
        <li v-for="(article, index) in news" :key="index">
          <strong>{{ article.headline }}</strong>
          <p class="meta">{{ formatDate(article.datetime) }} — <em>{{ article.source }}</em></p>
          <p>{{ article.summary }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getStockNews } from '../services/stockService.js';
  
 // Top of <script setup>
const props = defineProps({
  ticker: String
});

  
  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleString();
  
  async function fetchNews() {
    try {
      news.value = await getStockNews(ticker);
    } catch (err) {
      error.value = 'Failed to fetch news.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    fetchNews();
  });
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
    margin-bottom: 1rem;
  }
  .meta {
    font-size: 0.85rem;
    color: #666;
    margin: 0.25rem 0;
  }
  </style>
  