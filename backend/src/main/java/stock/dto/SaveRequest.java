package stock.dto;

import java.util.List;

import stock.model.News;
import stock.model.Stock;
public class SaveRequest {
    private Stock stock;
    private List<News> news;

    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }

    public List<News> getNews() { return news; }
    public void setNews(List<News> news) { this.news = news; }
}

