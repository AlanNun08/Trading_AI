package stock.calculations;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import stock.dto.StockRow;

public class GainsAnalysis {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");

    private static String convertToPST(String date, String time) {
        try {
            // Combine fields like: "2025-07-01 9:30 AM"
            String datetimeStr = date + " " + time;

            LocalDateTime etTime = LocalDateTime.parse(datetimeStr, FORMATTER);
            ZonedDateTime eastern = etTime.atZone(ZoneId.of("America/New_York"));
            ZonedDateTime pacific = eastern.withZoneSameInstant(ZoneId.of("America/Los_Angeles"));

            return pacific.toLocalTime().truncatedTo(ChronoUnit.MINUTES).toString(); // e.g., "06:30"
        } catch (DateTimeParseException e) {
            System.err.println("❌ Invalid date/time format: " + date + " " + time);
            return "INVALID_TIME";
        }
    }

    private static Map<String, String> entry(String ticker, String oldTime, String newTime, double oldPrice, double newPrice, double percentChange) {
        Map<String, String> map = new HashMap<>();
        map.put("Ticker", ticker);
        map.put("Old time", oldTime);
        map.put("Old Price", String.format("Old Price: $%.2f", oldPrice));
        map.put("New time", newTime);
        map.put("New Price", String.format("New Price: $%.2f", newPrice));
        map.put("Percentage change", String.format("Percentage change: %.2f%%", percentChange));
        return map;
    }

    public static Map<String, List<Map<String, String>>> calculateGains(List<StockRow> rows) {
        Map<String, List<Map<String, String>>> gainSummary = new HashMap<>();
        gainSummary.put("10_percent", new ArrayList<>());
        gainSummary.put("20_percent", new ArrayList<>());
        gainSummary.put("30_percent", new ArrayList<>());
        gainSummary.put("above_30_percent", new ArrayList<>());

        if (rows == null || rows.size() < 2) {
            return gainSummary;
        }

        for (int i = 0; i < rows.size(); i++) {
            StockRow oldRow = rows.get(i);
            double oldPrice = oldRow.getPrice();
            String oldTime = convertToPST(oldRow.getDate(), oldRow.getTime());

            for (int j = i + 1; j < rows.size(); j++) {
                StockRow newRow = rows.get(j);
                double newPrice = newRow.getPrice();
                double change = percentChange(oldPrice, newPrice);

                if (change < 10) continue;

                String category = categorizeChange(change);
                if (category != null) {
                    gainSummary.get(category).add(entry(
                        newRow.getTicker(),
                        oldTime,
                        convertToPST(newRow.getDate(), newRow.getTime()),
                        oldPrice,
                        newPrice,
                        change
                    ));
                }
            }
        }

        return gainSummary;
    }

    private static String categorizeChange(double change) {
        if (change >= 10 && change < 20) return "10_percent";
        if (change >= 20 && change < 30) return "20_percent";
        if (change >= 30 && change <= 40) return "30_percent";
        if (change > 40) return "above_30_percent";
        return null;
    }

    private static double percentChange(double oldPrice, double newPrice) {
        return ((newPrice - oldPrice) / oldPrice) * 100.0;
    }
}
