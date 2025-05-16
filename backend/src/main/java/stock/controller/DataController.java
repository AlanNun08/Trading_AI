package stock.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import stock.dto.SaveRequest;
import stock.model.News;
import stock.model.Stock;
import stock.service.NewsService;
import stock.service.StockService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/data")
public class DataController {

    private final StockService stockService;
    private final NewsService newsService;

    @Autowired
    public DataController(StockService stockService, NewsService newsService) {
        this.stockService = stockService;
        this.newsService = newsService;
    }

    // ✅ POST: Save individual stock + news
    @PostMapping("/save")
    public ResponseEntity<String> saveData(@RequestBody SaveRequest request) {
        Stock stock = request.getStock();
        List<News> newsList = request.getNews();

        if (stock != null) {
            // Extract date-only string (e.g., "2025-05-13" from "2025-05-13T10:30:00")
            String dateOnly = stock.getDate().split("T")[0];

            // 🧹 Delete all existing prices for the ticker + date
            stockService.deleteStockPricesByDate(stock.getTicker(), dateOnly);

            // 💾 Insert the new price
            stockService.saveStock(stock);
        }

        if (newsList != null && !newsList.isEmpty()) {
            newsService.saveNews(newsList);
        }

        return ResponseEntity.ok("Data saved successfully.");
    }

    @PostMapping("/update/summary")
    public ResponseEntity<String> updateSummary(@RequestBody News updatedNews) {
        if (updatedNews.getTicker() == null || updatedNews.getDate() == null || updatedNews.getHeadline() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        // Update existing news with matching ticker + date + headline
        newsService.updateAiSummary(updatedNews);
        return ResponseEntity.ok("Summary updated");
    } 
}