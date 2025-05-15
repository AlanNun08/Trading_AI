package stock.service;

import java.util.List;

import stock.model.Stock;

public interface StockService {
    void saveStock(Stock stock);
    Stock getStockByTicker(String ticker);
    void saveStockPrices(List<Stock> stocks);
    boolean stockPricesExistForDate(String ticker, String date);
    List<Stock> getStockPricesByDate(String ticker, String date);
    void deleteStockPricesByDate(String ticker, String date);


}

