package dao;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import model.News;

public class JdbcNewsDao implements NewsDao {

    private final JdbcTemplate jdbcTemplate;

    private final String INSERT_NEWS = "INSERT INTO news (ticker, date, headline, source, ai_summary) VALUES (?, ?, ?, ?, ?) " +
                                       "ON CONFLICT(ticker) DO UPDATE SET date = excluded.date, headline = excluded.headline, " +
                                       "source = excluded.source, ai_summary = excluded.ai_summary";

    private final String SELECT_NEWS_BY_TICKER = "SELECT ticker, date, headline, source, ai_summary FROM news WHERE ticker = ?";

    public JdbcNewsDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public void insertNews(News news) {
        jdbcTemplate.update(INSERT_NEWS,
                news.getTicker(),
                news.getDate(),
                news.getHeadline(),
                news.getSource(),
                news.getAiSummary());
    }

    @Override
    public News getNewsByTicker(String ticker) {
        SqlRowSet results = jdbcTemplate.queryForRowSet(SELECT_NEWS_BY_TICKER, ticker);
        if (results.next()) {
            return mapRowToNews(results);
        }
        return null;
    }

    private News mapRowToNews(SqlRowSet row) {
        News news = new News();
        news.setTicker(row.getString("ticker"));
        news.setDate(row.getString("date"));
        news.setHeadline(row.getString("headline"));
        news.setSource(row.getString("source"));
        news.setAiSummary(row.getString("ai_summary"));
        return news;
    }
}
