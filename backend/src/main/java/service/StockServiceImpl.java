package service;

import org.springframework.stereotype.Service;

import dao.StockDao;
import model.Stock;

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
}

