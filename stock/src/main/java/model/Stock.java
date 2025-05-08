package model;

public class Stock {
    private String ticker;
    private String date;
    private String price;

    public Stock() {}

    public Stock(String ticker, String date, String price) {
        this.ticker = ticker;
        this.date = date;
        this.price = price;
    }

    
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    
}
