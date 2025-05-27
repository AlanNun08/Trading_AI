package stock.dto;

public class StockRow {
    private int id;
    private String datetime;
    private String ticker;
    private double price;

    public StockRow(int id, String datetime, String ticker, double price) {
        this.id = id;
        this.datetime = datetime;
        this.ticker = ticker;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getDatetime() {
        return datetime;
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

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
