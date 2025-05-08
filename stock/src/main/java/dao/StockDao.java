package dao;

import model.Stock;

public interface StockDao {
    void insertStock(Stock stock);
    Stock getStockByTicker(String ticker);
}
