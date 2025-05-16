package stock.service;

import java.util.List;

import stock.model.News;

public interface NewsService {
    void saveNews(List<News> newsList);
    List<News> getNewsByTicker(String ticker);
    void updateAiSummary(News news);
}

