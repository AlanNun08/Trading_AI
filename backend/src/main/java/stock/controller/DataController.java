package stock.controller;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import stock.calculations.GainsAnalysis;
import stock.dto.SaveRequest;
import stock.dto.StockPricePoint;
import stock.dto.StockRow;
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

    // ✅ Save stock and news data
    @PostMapping("/save")
    public ResponseEntity<String> saveData(@RequestBody SaveRequest request) {
        Stock stock = request.getStock();
        List<News> newsList = request.getNews();

        if (stock != null) {
            String dateOnly = stock.getDate().split("T")[0];

            // 🧹 Clear existing prices for that ticker + date
            stockService.deleteStockPricesByDate(stock.getTicker(), dateOnly);

            // 💾 Save the incoming stock price
            stockService.saveStock(stock);
        }

        if (newsList != null && !newsList.isEmpty()) {
            newsService.saveNews(newsList);
        }

        return ResponseEntity.ok("Data saved successfully.");
    }

    // ✅ Update AI-generated news summaries
    @PostMapping("/update/summary")
    public ResponseEntity<String> updateSummary(@RequestBody News updatedNews) {
        if (updatedNews.getTicker() == null || updatedNews.getDate() == null || updatedNews.getHeadline() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        newsService.updateAiSummary(updatedNews);
        return ResponseEntity.ok("Summary updated");
    }

    // ✅ Analyze gain windows from price history (10-30% intraday gains)
    @PostMapping("/analyze/gains")
    public ResponseEntity<Map<String, List<Map<String, String>>>> analyzeGains(@RequestBody List<StockPricePoint> priceHistory) {
        if (priceHistory == null || priceHistory.size() < 2) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", List.of(Map.of("message", "Price history must include at least two entries"))
            ));
        }

        List<StockRow> rows = priceHistory.stream()
            .map(p -> {
                try {
                    double parsedPrice = Double.parseDouble(p.getPrice());
                    return new StockRow(0, p.getDate(), p.getTicker(), parsedPrice);
                } catch (NumberFormatException e) {
                    return null; // This row will be skipped
                }
            })
            .filter(Objects::nonNull)
            .toList();

        Map<String, List<Map<String, String>>> gainData = GainsAnalysis.calculateGains(rows);
        return ResponseEntity.ok(gainData);
    }

}
