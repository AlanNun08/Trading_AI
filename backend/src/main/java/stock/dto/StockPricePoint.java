package stock.dto;

public class StockPricePoint {
    private String ticker;
    private String date; // e.g., "2025-07-01"
    private String time; // NEW: e.g., "8:45 AM"
    private String price;

    public StockPricePoint() {}

    public StockPricePoint(String ticker, String date, String time, String price) {
        this.ticker = ticker;
        this.date = date;
        this.time = time;
        this.price = price;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}
