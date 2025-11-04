<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>📈 Stock Performance Dashboard</h1>
    </header>

    <div class="main-layout">
      <!-- Main Content: News + Chart -->
      <div class="content-container">
        <section v-if="selectedTicker" class="content-section">
          <div class="content-card">
            <StockPriceChart :ticker="selectedTicker" />
          </div>
          <div class="content-card">
            <StockNews :ticker="selectedTicker" />
          </div>
        </section>

        <section v-else class="placeholder-section">
          <p>Select a stock from the Top Gainers list to view market news and live price data.</p>
        </section>
      </div>

      <!-- Sidebar: Top Gainers -->
      <aside class="top-gainers-section">
        <h2 class="sidebar-title">📊 Search & Gainers</h2>

        <!-- Search form -->
        <form @submit.prevent="searchStock" class="stock-search-form">
          <input
            v-model="searchInput"
            class="stock-search-input"
            type="text"
            placeholder="Search by symbol (e.g. AAPL)"
          />
          <button type="submit" class="stock-search-button">Search</button>
        </form>

        <!-- Top Gainers component -->
        <TopGainers @selectTicker="setTicker" />
      </aside>


    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import TopGainers from '@/components/TopGainers.vue';
import StockNews from '@/components/StockNews.vue';
import StockPriceChart from '@/components/StockPriceChart.vue';

const selectedTicker = ref(null);
const setTicker = (ticker) => selectedTicker.value = ticker;

const searchInput = ref('');

function searchStock() {
  const ticker = searchInput.value.trim().toUpperCase();
  if (ticker) {
    console.log("🔍 Searching for:", ticker);
    setTicker(ticker);
    searchInput.value = '';
  }
}


</script>


<style scoped>
.dashboard {
  max-width: 1700px;
  margin: auto;
  padding: 2rem;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #1a202c;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  animation: fadeInDown 0.6s ease-out;
}

.dashboard-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Layout: Main content + Sidebar */
.main-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Left column: flexible content area */
.content-container {
  flex: 1;
  min-width: 0;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.6s ease-out;
}

/* Right column: Top Gainers sidebar */
.top-gainers-section {
  width: 320px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 6rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  animation: slideInRight 0.6s ease-out;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Search form */
.stock-search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stock-search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background-color: #fefefe;
  transition: all 0.3s ease;
}

.stock-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.stock-search-button {
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.stock-search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.stock-search-button:active {
  transform: translateY(0);
}

/* Reusable card layout */
.content-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* Placeholder when no ticker selected */
.placeholder-section {
  text-align: center;
  color: #4a5568;
  padding: 4rem 2rem;
  border: 2px dashed #cbd5e0;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  font-size: 1.1rem;
  animation: fadeIn 0.6s ease-in-out;
}

.placeholder-section p {
  margin: 0;
  line-height: 1.6;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Tablet Responsive */
@media (max-width: 1200px) {
  .dashboard {
    padding: 1.5rem;
  }

  .main-layout {
    gap: 1.5rem;
  }

  .top-gainers-section {
    width: 280px;
    padding: 1.25rem;
  }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .content-section,
  .top-gainers-section {
    flex: 1 1 100%;
    width: 100%;
  }

  .top-gainers-section {
    position: static;
    max-height: none;
    margin-top: 0;
    order: 1;
  }

  .content-container {
    order: 2;
  }

  .dashboard-header {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
    border-radius: 0;
  }

  .dashboard-header {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  .main-layout {
    gap: 1.5rem;
  }

  .content-card {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .top-gainers-section {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .sidebar-title {
    font-size: 1.2rem;
  }

  .stock-search-form {
    flex-direction: column;
    gap: 0.75rem;
  }

  .stock-search-button {
    width: 100%;
    padding: 0.875rem;
  }

  .placeholder-section {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.75rem;
  }

  .dashboard-header {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .content-card {
    padding: 1rem;
  }

  .top-gainers-section {
    padding: 1rem;
  }

  .stock-search-input {
    padding: 0.625rem 0.875rem;
    font-size: 0.9rem;
  }

  .stock-search-button {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .placeholder-section {
    padding: 2rem 1rem;
    font-size: 0.95rem;
  }
}

/* Custom scrollbar for sidebar */
.top-gainers-section::-webkit-scrollbar {
  width: 6px;
}

.top-gainers-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.top-gainers-section::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.top-gainers-section::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}
</style>
