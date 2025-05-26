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
  background-color: #f8f9fa;
  border-radius: 16px;
}


.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #212529;
  font-size: 2.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Layout: Main content + Sidebar */
.main-layout {
  display: flex;
  gap: 4rem; /* was 2rem */
  align-items: flex-start;
}


/* Left column: fixed width and content sharing */
.content-section {
  flex: 1 1 75%;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* more breathing room between news & chart */
}



/* Right column: Top Gainers stays a fixed size */
.top-gainers-section {
  width: 300px;
  flex-shrink: 0;
  flex-grow: 0;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
  position: sticky;
  top: 2rem;
}


/* Reusable card layout */
.content-card {
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}



.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

/* Placeholder when no ticker selected */
.placeholder-section {
  text-align: center;
  color: #6c757d;
  padding: 3rem;
  border: 2px dashed #ced4da;
  border-radius: 16px;
  background-color: #ffffff;
  font-style: italic;
  font-size: 1.1rem;
  animation: fadeIn 0.4s ease-in-out;
}

/* Title inside top gainers */
.top-gainers-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #343a40;
}
.stock-search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stock-search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fefefe;
}

.stock-search-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

.stock-search-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stock-search-button:hover {
  background-color: #0b5ed7;
}


/* Responsive: Stack on small screens */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .content-section,
  .top-gainers-section {
    flex: 1 1 100%;
  }

  .top-gainers-section {
    position: static;
    margin-top: 1.5rem;
  }
}

/* Fade in effect */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
