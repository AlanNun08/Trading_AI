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

* Displays daily top gainers from the stock market
* Clicking a ticker loads news and a live price chart
* Includes a search bar to manually look up any stock symbol

### 📊 Price Chart

* Fetches **minute-by-minute price history** via Polygon
* Toggle between **1 Day** and **30 Day** views:

  * 1 Day: shows minute-by-minute with **live updates**
  * 30 Day: shows daily closing prices with MM-DD formatting
* Displays last 30 points in a responsive Line chart
* Sends each price point to the backend for persistence

### 📰 News + AI Insights

* Fetches stock news from multiple APIs
* Filters out duplicate news with **80% similarity check**
* Stores news in the database with `headline`, `source`, `summary`
* AI generates structured insights using OpenAI GPT-4o function calling:

  * Context
  * Short-Term Impact
  * Long-Term Outlook
  * Actionable Advice
* Insights are shown per article on-demand and saved to the backend

---

## 🧩 Technologies

| Layer    | Stack                                                                   |
| -------- | ----------------------------------------------------------------------- |
| Frontend | Vue 3, Chart.js, Vite                                                   |
| Backend  | Java Spring Boot, JdbcTemplate                                          |
| Database | SQLite (`market_data.db`)                                               |
| APIs     | [Polygon.io](https://polygon.io), [OpenAI](https://platform.openai.com) |
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
    │   ├── stockService.js     # Polygon + OpenAI integration
    │   └── api.js              # Calls to backend
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

> Ensure your `.env` or environment contains `POLY_API_KEY` and OpenAI keys.

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
  "aiSummary": "### Context\n...\n### Short-Term Impact\n...\n### Long-Term Outlook\n...\n### Recommendation\n..."
}
```

---

## ⚠️ Rate Limits

* **Polygon:** Free tier may limit requests — only fetch price history once per stock/day
* **OpenAI GPT-4o:** 3 RPM (requests per minute). App handles this with spacing and per-article insight generation

---

## 📬 Contact / Ideas

Have an idea for improvement? Found a bug? Create an issue or contact [Alan Nunez](https://github.com/AlanNun08).

---

## 📄 License

MIT License — use, modify, and build upon this freely.
