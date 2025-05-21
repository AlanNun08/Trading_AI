// services/api.js 
export async function sendToBackend(stock, news) {
  try {
    console.log("📤 Sending to backend:", { stock, news });

    const response = await fetch("http://localhost:8080/api/data/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock: stock,
        news: news,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    console.log("✅ Backend response:", text);
    return text;
  } catch (err) {
    console.error("❌ Backend error:", err);
  }
}

export async function updateInsightOnBackend(newsItem) {
  try {
    console.log("📤 Sending updated insight to backend:", newsItem);

    const response = await fetch("http://localhost:8080/api/data/update/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: newsItem.ticker,
        date: newsItem.date,
        headline: newsItem.headline,
        source: newsItem.source,
        aiSummary: newsItem.aiSummary,
      }),
    });

    const result = await response.text();
    console.log("✅ Insight update sent to backend:", result);
    return result;
  } catch (err) {
    console.error("❌ Failed to send insight update:", err);
  }
}
