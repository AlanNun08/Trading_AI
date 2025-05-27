package stock.calculations;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import stock.dto.StockRow;

public class GainsAnalysis {

    private static String convertToPST(String datetimeStr) {
        try {
            // Pad with time if only date is provided
            if (datetimeStr.length() == 10) { // e.g., "2025-04-28"
                datetimeStr += " 09:30:00"; // default to market open
            }
    
            DateTimeFormatter fullFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime etTime = LocalDateTime.parse(datetimeStr, fullFormat);
            LocalDateTime pstTime = etTime.minusHours(3);
            return pstTime.toLocalTime().truncatedTo(ChronoUnit.SECONDS).toString();
        } catch (DateTimeParseException e) {
            System.err.println("❌ Invalid datetime format: " + datetimeStr);
            return "INVALID_TIME";
        }
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

    public static Map<String, List<Map<String, String>>> calculateGains(List<StockRow> rows) {
        List<Map<String, String>> tenPercentInfo = new ArrayList<>();
        List<Map<String, String>> twentyPercentInfo = new ArrayList<>();
        List<Map<String, String>> thirtyPercentInfo = new ArrayList<>();
        List<Map<String, String>> aboveThirtyPercentInfo = new ArrayList<>();
    
        Map<String, List<Map<String, String>>> gainSummary = new HashMap<>();
    
        if (rows == null || rows.size() < 2) {
            
            return gainSummary;
        }
    
        for (int i = 0; i < rows.size(); i++) {
            StockRow oldRow = rows.get(i);
    
            for (int j = i + 1; j < rows.size(); j++) {
                StockRow newRow = rows.get(j);
                double change = percentChange(oldRow.getPrice(), newRow.getPrice());
        
                if (change >= 10 && change < 20) {
                    tenPercentInfo.add(entry(
                        newRow.getTicker(),
                        convertToPST(oldRow.getDatetime()),
                        convertToPST(newRow.getDatetime()),
                        oldRow.getPrice(),
                        newRow.getPrice(),
                        change
                    ));
                } else if (change >= 20 && change < 30) {
                    twentyPercentInfo.add(entry(
                        newRow.getTicker(),
                        convertToPST(oldRow.getDatetime()),
                        convertToPST(newRow.getDatetime()),
                        oldRow.getPrice(),
                        newRow.getPrice(),
                        change
                    ));
                } else if (change >= 30 && change <= 40) {
                    thirtyPercentInfo.add(entry(
                        newRow.getTicker(),
                        convertToPST(oldRow.getDatetime()),
                        convertToPST(newRow.getDatetime()),
                        oldRow.getPrice(),
                        newRow.getPrice(),
                        change
                    ));
                } else if (change > 40) {
                    aboveThirtyPercentInfo.add(entry(
                        newRow.getTicker(),
                        convertToPST(oldRow.getDatetime()),
                        convertToPST(newRow.getDatetime()),
                        oldRow.getPrice(),
                        newRow.getPrice(),
                        change
                    ));
                }
            }
        }
    
        gainSummary.put("10_percent", tenPercentInfo);
        gainSummary.put("20_percent", twentyPercentInfo);
        gainSummary.put("30_percent", thirtyPercentInfo);
        gainSummary.put("above_30_percent", aboveThirtyPercentInfo);
        return gainSummary;
    }    

    private static double percentChange(double oldPrice, double newPrice) {
        return ((newPrice - oldPrice) / oldPrice) * 100;
    }
}