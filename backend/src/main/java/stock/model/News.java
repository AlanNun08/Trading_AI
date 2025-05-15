package stock.model;

public class News {
    private String ticker;
    private String date;
    private String headline;
    private String source;
    private String aiSummary;

    public News() {}

    public News(String ticker, String date, String headline, String source, String aiSummary) {
        this.ticker = ticker;
        this.date = date;
        this.headline = headline;
        this.source = source;
        this.aiSummary = aiSummary;
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

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }
}

