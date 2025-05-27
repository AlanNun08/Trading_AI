package stock.dto;

import java.util.List;

import stock.model.News;
import stock.model.Stock;

public class SaveRequest {
    private Stock stock;
    private List<News> news;
    private List<Stock> priceHistory;  // 👈 New field for all price data

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public List<News> getNews() {
        return news;
    }

    public void setNews(List<News> news) {
        this.news = news;
    }

    public List<Stock> getPriceHistory() {
        return priceHistory;
    }

    public void setPriceHistory(List<Stock> priceHistory) {
        this.priceHistory = priceHistory;
    }
}


