package dao;
import model.News;

public interface NewsDao {
    void insertNews(News news);
    News getNewsByTicker(String ticker);
}
