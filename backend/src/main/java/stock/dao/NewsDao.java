package stock.dao;

import java.util.List;

import stock.model.News;

public interface NewsDao {
    void insertNews(News news);
    List<News> getNewsByTicker(String ticker);
    void updateSummary(News news);
}
