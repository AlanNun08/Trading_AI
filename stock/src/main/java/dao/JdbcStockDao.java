package dao;

import model.Stock;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import javax.sql.DataSource;

public class JdbcStockDao implements StockDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcStockDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        createTableIfNotExists();
    }

    private void createTableIfNotExists() {
        String sql = "CREATE TABLE IF NOT EXISTS stock (" +
                     "ticker TEXT PRIMARY KEY, " +
                     "date TEXT, " +
                     "price TEXT)";
        jdbcTemplate.execute(sql);
    }

    @Override
    public void insertStock(Stock stock) {
        String sql = "INSERT OR REPLACE INTO stock (ticker, date, price) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, stock.getTicker(), stock.getDate(), stock.getPrice());
    }

    @Override
    public Stock getStockByTicker(String ticker) {
        String sql = "SELECT * FROM stock WHERE ticker = ?";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, ticker);
        if (results.next()) {
            Stock stock = new Stock();
            stock.setTicker(results.getString("ticker"));
            stock.setDate(results.getString("date"));
            stock.setPrice(results.getString("price"));
            return stock;
        }
        return null;
    }
}
