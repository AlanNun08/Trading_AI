package stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import stock.dao.NewsDao;
import stock.model.News;

@Service
public class NewsServiceImpl implements NewsService {

    private final NewsDao newsDao;

    public NewsServiceImpl(NewsDao newsDao) {
        this.newsDao = newsDao;
    }

    @Override
    public void saveNews(List<News> newsList) {
        for (News news : newsList) {
            newsDao.insertNews(news);
        }
    }

    @Override
    public List<News> getNewsByTicker(String ticker) {
        return newsDao.getNewsByTicker(ticker);
    }
    @Override
    public void updateAiSummary(News news) {
        newsDao.updateSummary(news);
    }

}

