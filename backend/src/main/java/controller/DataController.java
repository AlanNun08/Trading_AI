package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.SaveRequest;
import service.NewsService;
import service.StockService;

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

    @PostMapping("/save")
    public ResponseEntity<String> saveData(@RequestBody SaveRequest request) {
        stockService.saveStock(request.getStock());
        newsService.saveNews(request.getNews());
        return ResponseEntity.ok("Data saved successfully.");
    }
}
