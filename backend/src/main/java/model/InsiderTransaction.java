package model;

public class InsiderTransaction {
    private String ticker;
    private String date;
    private String share;
    private String change;
    private String transactionPrice;
    private String aiTransactionInsights;

    public InsiderTransaction() {}

    public InsiderTransaction(String ticker, String date, String share, String change, String transactionPrice, String aiTransactionInsights) {
        this.ticker = ticker;
        this.date = date;
        this.share = share;
        this.change = change;
        this.transactionPrice = transactionPrice;
        this.aiTransactionInsights = aiTransactionInsights;
    }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getShare() { return share; }
    public void setShare(String share) { this.share = share; }

    public String getChange() { return change; }
    public void setChange(String change) { this.change = change; }

    public String getTransactionPrice() { return transactionPrice; }
    public void setTransactionPrice(String transactionPrice) { this.transactionPrice = transactionPrice; }

    public String getAiTransactionInsights() { return aiTransactionInsights; }
    public void setAiTransactionInsights(String aiTransactionInsights) { this.aiTransactionInsights = aiTransactionInsights; }
}
