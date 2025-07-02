package stock.dto;

public class StockRow {
    private int id;
    private String date;     // e.g., "2025-07-01"
    private String time;     // e.g., "8:45 AM"
    private String ticker;
    private double price;

    public StockRow(int id, String date, String time, String ticker, double price) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.ticker = ticker;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getTicker() {
        return ticker;
    }

    public double getPrice() {
        return price;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
