# 📈 Stock Gainer Dashboard

## Overview

This project is a **Vue 3 stock monitoring dashboard** that lets users:

- ✅ View the **top gaining stocks** of the day
- ✅ Click a gainer to view its **live news feed**
- ✅ Display a **price chart** for the selected stock
- ✅ View everything on a single, clean dashboard with a responsive layout

The dashboard is powered by live data from **Alpaca** and **Finnhub APIs**, with a frontend built in **Vue 3** and backend integration planned via **Java** for storing and processing stock data.

---

## 🔧 Features Implemented So Far

- **Top Gainers List**  
  Displays the top gainers of the day using Alpaca's API. Stocks are clickable to load additional data.

- **Stock News Viewer**  
  Fetches and displays today's news headlines for the selected stock using Finnhub’s `company-news` endpoint.

- **Live Price Chart**  
  Renders a daily stock price chart using Chart.js and Finnhub’s candle endpoint.

- **Dynamic Dashboard**  
  All components are modular (gainers, news, chart) and wired together in `DashboardView.vue`. Selecting a stock updates both news and price chart.

- **Router Setup with Navbar**  
  Includes a top navigation bar with links to Home and Stocks, styled with responsive CSS.

---

## 📦 Tech Stack

- **Frontend:** Vue 3 + Vite
- **Charts:** Chart.js (via vue-chartjs)
- **Styling:** Scoped CSS + Flexbox (fully responsive)
- **APIs:**
  - [Alpaca Market Movers](https://alpaca.markets/docs/)
  - [Finnhub Company News + Stock Candle](https://finnhub.io/docs/api)
- **Backend:** (Planned) Java Spring Boot (for data persistence and extended analysis)

---

## 🚧 Next Steps

- 🔄 Hook into the Java backend to store selected tickers, news, and prices
- 📊 Add support for intraday chart resolution switching
- 🔔 Optional: Add notifications or watchlist support
- 🧪 Add unit tests and loading spinners
