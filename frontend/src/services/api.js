// services/api.js or in your component
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
