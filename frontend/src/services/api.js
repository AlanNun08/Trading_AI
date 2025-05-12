// services/api.js or in your component
export async function sendToBackend(stock, news) {
    try {
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
        throw new Error("Failed to save data");
      }
  
      return await response.text(); // or .json() if backend returns JSON
    } catch (err) {
      console.error("❌ Backend error:", err);
    }
  }
  