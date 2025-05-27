# 📈 Trading AI

A web-based application for viewing top stock gainers, real-time price charts, and AI-generated insights on financial news.

Built with:

* ⚙️ Java Spring Boot (backend)
* 🔤️ Vue 3 + Chart.js (frontend)
* 📡 Polygon.io for stock prices
* 🧠 OpenAI API for financial insights
* 📃️ SQLite for storing stock & news data

---

## 🚀 Features

### 🔥 Top Gainers

* Displays daily top gainers from the stock market using Alpaca Screener API
* Clicking a ticker loads news and a live price chart
* **Includes real-time monitoring** for gainer changes (with polling)

### 📊 Price Chart

* Fetches **minute-by-minute price history** via Polygon
* Subscribes to **live prices** using polling (5 per minute)
* Displays last 30 points on a real-time Line chart
* Supports **1 Day** and **30 Day** toggles
* Time labels format properly (e.g., "3:15 PM" instead of full timestamp)
* Sends each price point to the backend for persistence

### 📰 News + AI Insights

* Fetches the latest stock news from multiple APIs
* Uses deduplication logic to remove similar news articles (80% similarity threshold)
* Stores news in the database with `headline`, `source`, and `summary`
* AI generates structured insights using OpenAI GPT-4o function-calling:

  * Context
  * Short-Term Impact
  * Long-Term Outlook
  * Actionable Advice

* Each insight is **immediately shown in the UI** and sent to the backend
* Retry logic and backend summary updates are handled automatically

### 🔎 Search

* Includes a search input where users can **enter a stock symbol manually**
* Updates chart and news view on search

---

## 🧩 Technologies

| Layer    | Stack                                                                   |
| -------- | ----------------------------------------------------------------------- |
| Frontend | Vue 3, Chart.js, Vite                                                   |
| Backend  | Java Spring Boot, JdbcTemplate                                          |
| Database | SQLite (`market_data.db`)                                               |
| APIs     | [Polygon.io](https://polygon.io), [OpenAI](https://platform.openai.com), [Alpaca](https://alpaca.markets) |
| Hosting  | Localhost                                                               |

---

## 🛠️ Project Structure

```
Trading_AI/
├── backend/
│   ├── src/main/java/stock/
│   │   ├── controller/         # REST APIs
│   │   ├── dao/                # JDBC DAOs
│   │   ├── service/            # Business logic
│   │   ├── model/              # POJOs
│   │   ├── dto/                # Request DTOs
│   │   └── Application.java    # Spring Boot main
│   └── market_data.db          # SQLite DB
└── frontend/
    ├── components/
    │   ├── TopGainers.vue
    │   ├── StockPriceChart.vue
    │   └── StockNews.vue
    ├── services/
    │   ├── stockPriceService.js     # Polygon integration
    │   ├── stockGainerService.js    # Alpaca Screener API integration
    │   ├── chatGPTService.js        # OpenAI GPT-4o insights
    │   └── api.js                   # Calls to backend
    └── App.vue
```

---

## 🔧 Running the App

### 📦 Backend (Java + Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

* SQLite DB: `market_data.db` in `/backend/database/`
* Runs at: `http://localhost:8080`

> Ensure your `.env` or environment contains `POLY_API_KEY`, `ALPACA_API_KEY`, and `OPENAI_API_KEY`.

---

### 🌐 Frontend (Vue + Vite)

```bash
cd frontend
npm install
npm run dev
```

* Runs at: `http://localhost:5173`
* Edit API keys in `.env`:

  ```
  VITE_POLY_API_KEY=your_polygon_key
  VITE_ALPACA_API_KEY=your_alpaca_key
  VITE_OPENAI_KEY=your_openai_key
  ```

---

## 🔪 API Endpoints

### Save stock + news

```http
POST /api/data/save
```

```json
{
  "stock": { "ticker": "AAPL", "date": "2025-05-15T10:30:00", "price": "175.32" },
  "news": [
    {
      "ticker": "AAPL",
      "date": "2025-05-15",
      "headline": "Apple beats earnings",
      "source": "Reuters",
      "aiSummary": "Apple showed strong growth in services and iPhone revenue."
    }
  ]
}
```

### Update AI Summary

```http
POST /api/data/update/summary
```

```json
{
  "ticker": "AAPL",
  "date": "2025-05-15",
  "headline": "Apple beats earnings",
  "source": "Reuters",
  "aiSummary": {
    "context": "Apple posted a strong Q1...",
    "short_term": "Likely short-term boost...",
    "long_term": "Sustained growth in services...",
    "recommendation": "Consider holding position..."
  }
}
```

---

## ⚠️ Rate Limits

* **Polygon:** Free tier may limit requests — only fetch price history once per stock/day
* **OpenAI GPT-4o:** 3 RPM (requests per minute). App handles this with throttling and per-article delay
* **Alpaca Screener:** Updates gainers every few seconds; use polling with care

---

## 📬 Contact / Ideas

Have an idea for improvement? Found a bug? Create an issue or contact [Alan Nunez](https://github.com/AlanNun08).

---

## 📄 License

MIT License — use, modify, and build upon this freely.
