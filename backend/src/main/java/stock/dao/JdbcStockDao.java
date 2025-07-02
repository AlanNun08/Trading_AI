package stock.dao;

import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import stock.model.Stock;

@Repository
public class JdbcStockDao implements StockDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcStockDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        createTableIfNotExists();
    }

    private void createTableIfNotExists() {
        System.out.println("✅ Creating 'stock' table if not exists...");
        String sql = "CREATE TABLE IF NOT EXISTS stock (" +
                     "ticker TEXT NOT NULL, " +
                     "date TEXT NOT NULL, " +
                     "time TEXT NOT NULL, " +
                     "price DECIMAL, " +
                     "PRIMARY KEY (ticker, date, time))";
        jdbcTemplate.execute(sql);
    }
    

    @Override
    public void insertStock(Stock stock) {
        String sql = "INSERT OR REPLACE INTO stock (ticker, date, time, price) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, stock.getTicker(), stock.getDate(), stock.getTime(), stock.getPrice());
    }

    @Override
    public void insertStockPrices(List<Stock> stocks) {
        String sql = "INSERT OR REPLACE INTO stock (ticker, date, time, price) VALUES (?, ?, ?, ?)";
        for (Stock stock : stocks) {
            jdbcTemplate.update(sql, stock.getTicker(), stock.getDate(), stock.getTime(), stock.getPrice());
        }
    }

    @Override
    public Stock getStockByTicker(String ticker) {
        String sql = "SELECT * FROM stock WHERE ticker = ? LIMIT 1";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, ticker);
        if (results.next()) {
            Stock stock = new Stock();
            stock.setTicker(results.getString("ticker"));
            stock.setDate(results.getString("date"));
            stock.setTime(results.getString("time"));
            stock.setPrice(results.getBigDecimal("price"));
            return stock;
        }
        return null;
    }

    @Override
    public boolean existsForDate(String ticker, String date) {
        String sql = "SELECT 1 FROM stock WHERE ticker = ? AND date = ? LIMIT 1";
        return !jdbcTemplate.queryForList(sql, ticker, date).isEmpty();
    }

    @Override
    public List<Stock> getStockPricesByDate(String ticker, String date) {
        String sql = "SELECT * FROM stock WHERE ticker = ? AND date = ? ORDER BY time ASC";
        List<Stock> prices = new ArrayList<>();

        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, ticker, date);
        while (results.next()) {
            Stock stock = new Stock();
            stock.setTicker(results.getString("ticker"));
            stock.setDate(results.getString("date"));
            stock.setTime(results.getString("time"));
            stock.setPrice(results.getBigDecimal("price"));
            prices.add(stock);
        }

        return prices;
    }

    @Override
    public void deleteStockPricesByDate(String ticker, String date) {
        String sql = "DELETE FROM stock WHERE ticker = ? AND date = ?";
        jdbcTemplate.update(sql, ticker, date);
    }
}
