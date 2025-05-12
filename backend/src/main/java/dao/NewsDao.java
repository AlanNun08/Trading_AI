package dao;

import java.util.List;

import model.News;

public interface NewsDao {
    void insertNews(News news);
    List<News> getNewsByTicker(String ticker);
}
