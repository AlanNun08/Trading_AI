package stock.calculations;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class GainsAnalysis {
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static String convertToPST(String datetimeStr) {
        LocalDateTime etTime = LocalDateTime.parse(datetimeStr, TIME_FORMAT);
        LocalDateTime pstTime = etTime.minusHours(3);
        return pstTime.toLocalTime().truncatedTo(ChronoUnit.SECONDS).toString();
    }

    private static Map<String, String> entry(String ticker, String oldTime, String newTime, double oldPrice, double newPrice, double percentChange) {
        Map<String, String> entry = new HashMap<>();
        entry.put("Ticker", ticker);
        entry.put("Old time", oldTime);
        entry.put("Old Price", String.format("Old Price: $%.2f", oldPrice));
        entry.put("New time", newTime);
        entry.put("New Price", String.format("New Price: $%.2f", newPrice));
        entry.put("Percentage change", String.format("Percentage change: %.2f%%", percentChange));
        return entry;
    }

    public static Map<String, List<Map<String, String>>> calculateGains(String ticker, String date) {
        String url = "jdbc:sqlite:backend/database/market_data.db";
        String sql = "SELECT * FROM stock WHERE ticker = ? AND date(datetime) = ? ORDER BY datetime ASC";
    
        List<Map<String, String>> tenPercentInfo = new ArrayList<>();
        List<Map<String, String>> twentyPercentInfo = new ArrayList<>();
        List<Map<String, String>> thirtyPercentInfo = new ArrayList<>();
    
        Map<String, List<Map<String, String>>> gainSummary = new HashMap<>();
    
        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
    
            pstmt.setString(1, ticker);
            pstmt.setString(2, date);
    
            ResultSet rs = pstmt.executeQuery();
    
            List<StockRow> rows = new ArrayList<>();
            while (rs.next()) {
                rows.add(new StockRow(
                    rs.getInt("id"),
                    rs.getString("datetime"),
                    rs.getString("ticker"),
                    rs.getDouble("price")
                ));
            }
    
            if (rows.size() < 4) {
                return gainSummary;  // Return empty map
            }
    
            StockRow oldTen = rows.get(0);
            StockRow newTen = rows.get(1);
            StockRow oldTwenty = rows.get(0);
            StockRow newTwenty = rows.get(2);
            StockRow oldThirty = rows.get(0);
            StockRow newThirty = rows.get(3);
    
            String currentDate = oldTen.datetime.split(" ")[0];
    
            for (StockRow row : rows) {
                String rowDate = row.datetime.split(" ")[0];
                if (!row.ticker.equals(ticker) || !rowDate.equals(currentDate)) {
                    currentDate = rowDate;
                    int pos = row.id - 1;
                    if (pos >= 0 && pos + 3 < rows.size()) {
                        oldTen = rows.get(pos);
                        newTen = rows.get(pos + 1);
                        oldTwenty = rows.get(pos);
                        newTwenty = rows.get(pos + 2);
                        oldThirty = rows.get(pos);
                        newThirty = rows.get(pos + 3);
                    }
                } else {
                    double tenChange = percentChange(oldTen.price, newTen.price);
                    if (tenChange >= 10 && tenChange < 20) {
                        tenPercentInfo.add(entry(row.ticker, convertToPST(oldTen.datetime), convertToPST(newTen.datetime), oldTen.price, newTen.price, tenChange));
                        oldTen = row;
                        newTen = row;
                    } else {
                        newTen = row;
                    }
    
                    double twentyChange = percentChange(oldTwenty.price, newTwenty.price);
                    if (twentyChange >= 20 && twentyChange < 30) {
                        twentyPercentInfo.add(entry(row.ticker, convertToPST(oldTwenty.datetime), convertToPST(newTwenty.datetime), oldTwenty.price, newTwenty.price, twentyChange));
                        oldTwenty = row;
                        newTwenty = row;
                    } else {
                        newTwenty = row;
                    }
    
                    double thirtyChange = percentChange(oldThirty.price, newThirty.price);
                    if (thirtyChange >= 30 && thirtyChange < 40) {
                        thirtyPercentInfo.add(entry(row.ticker, convertToPST(oldThirty.datetime), convertToPST(newThirty.datetime), oldThirty.price, newThirty.price, thirtyChange));
                        oldThirty = row;
                        newThirty = row;
                    } else {
                        newThirty = row;
                    }
                }
            }
    
            gainSummary.put("10_percent", tenPercentInfo);
            gainSummary.put("20_percent", twentyPercentInfo);
            gainSummary.put("30_percent", thirtyPercentInfo);
    
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    
        return gainSummary;
    }
    

    private static double percentChange(double oldPrice, double newPrice) {
        return ((newPrice - oldPrice) / oldPrice) * 100;
    }

    static class StockRow {
        int id;
        String datetime;
        String ticker;
        double price;

        public StockRow(int id, String datetime, String ticker, double price) {
            this.id = id;
            this.datetime = datetime;
            this.ticker = ticker;
            this.price = price;
        }
    }
}
