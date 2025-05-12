package dao;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import model.News;

public class JdbcNewsDao implements NewsDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcNewsDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        createTableIfNotExists();
    }

    private void createTableIfNotExists() {
        String sql = "CREATE TABLE IF NOT EXISTS news (" +
                     "ticker TEXT, " +
                     "date TEXT, " +
                     "headline TEXT, " +
                     "source TEXT, " +
                     "ai_summary TEXT)";
        jdbcTemplate.execute(sql);
    }

    @Override
    public void insertNews(News news) {
        String sql = "INSERT INTO news (ticker, date, headline, source, ai_summary) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            news.getTicker(),
            news.getDate(),
            news.getHeadline(),
            news.getSource(),
            news.getAiSummary()
        );
    }

    @Override
    public List<News> getNewsByTicker(String ticker) {
        String sql = "SELECT * FROM news WHERE ticker = ?";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, ticker);

        List<News> newsList = new ArrayList<>();
        while (results.next()) {
            News news = new News();
            news.setTicker(results.getString("ticker"));
            news.setDate(results.getString("date"));
            news.setHeadline(results.getString("headline"));
            news.setSource(results.getString("source"));
            news.setAiSummary(results.getString("ai_summary"));
            newsList.add(news);
        }
        return newsList;
    }
}
