package dto;

import java.util.List;

import model.News;
import model.Stock;
public class SaveRequest {
    private Stock stock;
    private List<News> news;

    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }

    public List<News> getNews() { return news; }
    public void setNews(List<News> news) { this.news = news; }
}

