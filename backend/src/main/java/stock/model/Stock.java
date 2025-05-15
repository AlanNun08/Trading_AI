package stock.model;

import java.math.BigDecimal;

public class Stock {
    private String ticker;
    private String date;
    private BigDecimal price;

    public Stock() {}

    public Stock(String ticker, String date, BigDecimal price) {
        this.ticker = ticker;
        this.date = date;
        this.price = price;
    }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
