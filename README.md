## 📊 Trading AI – Full Stack App

This project is a full-stack trading intelligence dashboard that:

* Displays **top stock gainers** with daily price data
* Shows **real-time financial news** for each stock
* Generates **AI-powered news insights**
* Sends all relevant data automatically to a **Java Spring Boot backend** for storage

---

## ⚙️ Technologies Used

### 🔵 Frontend

* **Vue 3 + Vite**
* `fetch()` for API communication
* Chart.js (optional for price graphs)
* Components:

  * `Stocking.vue` – shows daily top gainers and sends them to backend
  * `Stockiness.vue` – shows news for a selected stock, generates insights, and sends to backend

### ☕ Backend

* **Java 17**, **Spring Boot 2.7**
* REST API endpoints with `@RestController`
* JDBC with `JdbcTemplate`
* SQLite or H2 for local SQL storage
* DAO pattern for `Stock` and `News`

---

## 🔗 Frontend–Backend Integration

### ✅ Stocking.vue

* Fetches daily top gainers via Polygon or Alpaca API
* Automatically sends each stock's `ticker`, `date`, and `price` to:

  ```
  POST http://localhost:8080/api/data/save
  ```

### ✅ Stockiness.vue

* Fetches latest news for a specific stock
* Automatically sends each news item (`headline`, `source`, `summary`) to the backend

---

## 📁 Backend Project Structure

```
src/main/java/
│
├── controller/
│   └── DataController.java     // Handles POST from frontend
│
├── service/
│   ├── StockService.java
│   ├── StockServiceImpl.java
│   ├── NewsService.java
│   └── NewsServiceImpl.java
│
├── dao/
│   ├── StockDao.java
│   ├── JdbcStockDao.java
│   ├── NewsDao.java
│   └── JdbcNewsDao.java
│
├── model/
│   ├── Stock.java
│   └── News.java
│
├── dto/
│   └── SaveRequest.java        // Accepts combined stock + news data
│
└── Application.java            // Spring Boot entry point
```

---

## 🚀 To Run

### 👥 Backend

```bash
cd backend/
mvn clean install
mvn spring-boot:run
```

### 🌐 Frontend

```bash
cd frontend/
npm install
npm run dev
```
