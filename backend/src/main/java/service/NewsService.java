package service;

import java.util.List;

import model.News;

public interface NewsService {
    void saveNews(List<News> newsList);
    List<News> getNewsByTicker(String ticker);
}

