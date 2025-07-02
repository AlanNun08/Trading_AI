package stock.model;

import java.math.BigDecimal;

public class Stock {
    private String ticker;
    private String date; // format: "YYYY-MM-DD"
    private String time; // new field: format "hh:mm AM/PM"
    private BigDecimal price;

    public Stock() {}

    public Stock(String ticker, String date, String time, BigDecimal price) {
        this.ticker = ticker;
        this.date = date;
        this.time = time;
        this.price = price;
    }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}

