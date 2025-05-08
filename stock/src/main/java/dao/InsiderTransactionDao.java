package dao;

import model.InsiderTransaction;

public interface InsiderTransactionDao {
    void insertTransaction(InsiderTransaction tx);
    InsiderTransaction getTransactionByTicker(String ticker);
}
