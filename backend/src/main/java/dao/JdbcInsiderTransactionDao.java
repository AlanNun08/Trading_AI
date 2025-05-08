package dao;

import model.InsiderTransaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import javax.sql.DataSource;

public class JdbcInsiderTransactionDao implements InsiderTransactionDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcInsiderTransactionDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        createTableIfNotExists();
    }

    private void createTableIfNotExists() {
        String sql = "CREATE TABLE IF NOT EXISTS insider_transaction (" +
                     "ticker TEXT PRIMARY KEY, " +
                     "date TEXT, " +
                     "share TEXT, " +
                     "change TEXT, " +
                     "transaction_price TEXT, " +
                     "ai_transaction_insights TEXT, " +
                     "FOREIGN KEY (ticker) REFERENCES stock(ticker))";
        jdbcTemplate.execute(sql);
    }

    @Override
    public void insertTransaction(InsiderTransaction tx) {
        String sql = "INSERT OR REPLACE INTO insider_transaction (ticker, date, share, change, transaction_price, ai_transaction_insights) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, tx.getTicker(), tx.getDate(), tx.getShare(), tx.getChange(), tx.getTransactionPrice(), tx.getAiTransactionInsights());
    }

    @Override
    public InsiderTransaction getTransactionByTicker(String ticker) {
        String sql = "SELECT * FROM insider_transaction WHERE ticker = ?";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, ticker);
        if (results.next()) {
            InsiderTransaction tx = new InsiderTransaction();
            tx.setTicker(results.getString("ticker"));
            tx.setDate(results.getString("date"));
            tx.setShare(results.getString("share"));
            tx.setChange(results.getString("change"));
            tx.setTransactionPrice(results.getString("transaction_price"));
            tx.setAiTransactionInsights(results.getString("ai_transaction_insights"));
            return tx;
        }
        return null;
    }
}
