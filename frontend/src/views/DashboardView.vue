<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>📊 Stock Dashboard</h1>
    </header>

    <section class="top-gainers-section">
      <TopGainers @selectTicker="setTicker" />
    </section>

    <section v-if="selectedTicker" class="content-section">
      <div class="content-card">
        <StockNews :ticker="selectedTicker" />
      </div>
      <div class="content-card">
        <StockPriceChart :ticker="selectedTicker" />
      </div>
    </section>

    <section v-else class="placeholder-section">
      <p>Select a stock from the gainers list to view news and price details.</p>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopGainers from '@/components/TopGainers.vue';
import StockNews from '@/components/StockNews.vue';
import StockPriceChart from '@/components/StockPriceChart.vue';

const selectedTicker = ref(null);
const setTicker = (ticker) => selectedTicker.value = ticker;
</script>

<style scoped>
.dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  background-color: #f1f3f5;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #212529;
  font-size: 2rem;
  letter-spacing: 0.5px;
}

.top-gainers-section {
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.content-section {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  animation: fadeIn 0.6s ease-in-out;
}

.content-card {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 2rem;
  flex: 1 1 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #dee2e6;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.placeholder-section {
  text-align: center;
  color: #868e96;
  padding: 3rem;
  border: 2px dashed #ced4da;
  border-radius: 16px;
  background-color: #ffffff;
  animation: fadeIn 0.7s ease-in;
  font-style: italic;
  font-size: 1.1rem;
}

@media (min-width: 768px) {
  .content-card {
    flex: 1 1 calc(50% - 1rem);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
