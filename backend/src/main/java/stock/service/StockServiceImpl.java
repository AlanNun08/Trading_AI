package stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import stock.dao.StockDao;
import stock.model.Stock;

@Service
public class StockServiceImpl implements StockService {

    private final StockDao stockDao;

    public StockServiceImpl(StockDao stockDao) {
        this.stockDao = stockDao;
    }

    @Override
    public void saveStock(Stock stock) {
        stockDao.insertStock(stock);
    }

    @Override
    public Stock getStockByTicker(String ticker) {
        return stockDao.getStockByTicker(ticker);
    }
    @Override
    public List<Stock> getStockPricesByDate(String ticker, String date) {
        return stockDao.getStockPricesByDate(ticker, date);
    }

    @Override
    public void saveStockPrices(List<Stock> stocks) {
        stockDao.insertStockPrices(stocks);
    }

    @Override
    public boolean stockPricesExistForDate(String ticker, String date) {
        return stockDao.existsForDate(ticker, date);
    }
    @Override
    public void deleteStockPricesByDate(String ticker, String date) {
        stockDao.deleteStockPricesByDate(ticker, date);
    }

}

