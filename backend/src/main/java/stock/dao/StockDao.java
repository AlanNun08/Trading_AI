package stock.dao;

import java.util.List;

import stock.model.Stock;

public interface StockDao {
    void insertStock(Stock stock);
    Stock getStockByTicker(String ticker);

    // ✅ New methods for full-day support
    void insertStockPrices(List<Stock> stocks);
    List<Stock> getStockPricesByDate(String ticker, String date);
    boolean existsForDate(String ticker, String date);
    void deleteStockPricesByDate(String ticker, String date);

}
