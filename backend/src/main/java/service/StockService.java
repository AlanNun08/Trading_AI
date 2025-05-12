package service;

import model.Stock;

public interface StockService {
    void saveStock(Stock stock);
    Stock getStockByTicker(String ticker);
}

