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
    const payload = {
      ticker: newsItem.ticker,
      date: newsItem.date,
      headline: newsItem.headline,
      aiSummary: typeof newsItem.aiSummary === 'object'
        ? formatInsightAsString(newsItem.aiSummary)
        : newsItem.aiSummary
    };

    console.log("📤 Sending to backend:", payload);

    const response = await fetch("http://localhost:8080/api/data/update/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();
    console.log("✅ Insight update sent to backend:", result);
    return result;
  } catch (err) {
    console.error("❌ Failed to send insight update:", err);
  }
}

function formatInsightAsString(insight) {
  return `### Context\n${insight.context}\n\n### Short-Term Impact\n${insight.short_term}\n\n### Long-Term Outlook\n${insight.long_term}\n\n### Recommendation\n${insight.recommendation}`;
}

