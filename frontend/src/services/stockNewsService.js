function getEasternDateString() {
    const now = new Date();
  
    // Convert to Eastern Time using toLocaleString
    const estNow = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
  
    // Get the day of the week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = estNow.getDay();
  
    // If Saturday (6), subtract 1 day; if Sunday (0), subtract 2 days
    if (dayOfWeek === 6) {
      estNow.setDate(estNow.getDate() - 1); // Go back to Friday
    } else if (dayOfWeek === 0) {
      estNow.setDate(estNow.getDate() - 2); // Go back to Friday
    }
  
    // Format the final adjusted date as YYYY-MM-DD
    const year = estNow.getFullYear();
    const month = String(estNow.getMonth() + 1).padStart(2, '0');
    const day = String(estNow.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  function getLast30DaysRange() {
    // Get EST time as a string and re-parse it as a Date
    const estNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
  
    // Clone and subtract 30 days
    const pastDate = new Date(estNow);
    pastDate.setDate(estNow.getDate() - 30);
  
    const format = (date) => date.toISOString().split('T')[0];
  
    return {
      startDate: format(pastDate),
      endDate: format(estNow),
    };
  }
  
  export async function getStockNews(ticker) {
    const today = getEasternDateString();
    const allArticles = [];
    const { startDate, endDate } = getLast30DaysRange();
  
    // 1. Finnhub
    try {
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
      const finnhubUrl = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${startDate}&to=${endDate}&token=${apiKey}`;
      const res = await fetch(finnhubUrl);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(article => {
          allArticles.push({
            ticker,
            headline: article.headline,
            summary: article.summary,
            source: article.source || 'Finnhub',
            datetime: article.datetime,
          });
        });
      } else {
        console.log(`ℹ️ No Finnhub news for ${ticker}`);
      }
    } catch (err) {
      console.error(`❌ Finnhub error for ${ticker}:`, err);
    }
  
    // 2. Newsdata.io
    try {
      const key = import.meta.env.VITE_NEWSDATA_API_KEY;
      const url = `https://newsdata.io/api/1/news?apikey=${key}&q=${ticker}&language=en&category=business`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (Array.isArray(data.results) && data.results.length > 0) {
        data.results.forEach(article => {
          allArticles.push({
            ticker,
            headline: article.title,
            summary: article.description,
            source: article.source_id || 'Newsdata.io',
            datetime: new Date(article.pubDate).getTime() / 1000,
          });
        });
      } else {
        console.log(`ℹ️ No Newsdata.io results for ${ticker}`);
      }
    } catch (err) {
      console.error(`❌ Newsdata.io error for ${ticker}:`, err);
    }
  
    // 3. Marketaux
    try {
      const key = import.meta.env.VITE_MARKETAUX_API_KEY;
      const url = `https://api.marketaux.com/v1/news/all?symbols=${ticker}&filter_entities=true&language=en&api_token=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (Array.isArray(data.data) && data.data.length > 0) {
        data.data.forEach(article => {
          allArticles.push({
            ticker,
            headline: article.title,
            summary: article.description,
            source: article.source || 'Marketaux',
            datetime: new Date(article.published_at).getTime() / 1000,
          });
        });
      } else {
        console.log(`ℹ️ No Marketaux news for ${ticker}`);
      }
    } catch (err) {
      console.error(`❌ Marketaux error for ${ticker}:`, err);
    }
  
    // 4. GNews
    try {
      const key = import.meta.env.VITE_GNEWS_API_KEY;
      const url = `https://gnews.io/api/v4/search?q=${ticker}&token=${key}&lang=en`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        data.articles.forEach(article => {
          allArticles.push({
            ticker,
            headline: article.title,
            summary: article.description,
            source: article.source?.name || 'GNews',
            datetime: new Date(article.publishedAt).getTime() / 1000,
          });
        });
      } else {
        console.log(`ℹ️ No GNews results for ${ticker}`);
      }
    } catch (err) {
      console.error(`❌ GNews error for ${ticker}:`, err);
    }
  
    const uniqueArticles = removeSimilarArticles(allArticles, 0.5);
  
    // ✅ Send articles to backend after collection
    if (uniqueArticles.length > 0) {
      for (const article of uniqueArticles) {
        const payload = {
          stock: {
            ticker: article.ticker,
            date: new Date(article.datetime * 1000).toISOString().split('T')[0],
            price: "0.0"
          },
          news: [{
            ticker: article.ticker,
            date: new Date(article.datetime * 1000).toISOString().split('T')[0],
            headline: article.headline,
            source: article.source,
            aiSummary: article.summary
          }]
        };
  
        try {
          const res = await fetch('http://localhost:8080/api/data/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.text();
          console.log("📤 Sent article to backend:", article.headline, result);
        } catch (err) {
          console.error("❌ Failed to send article to backend:", article.headline, err);
        }
      }
    } else {
      console.warn(`⚠️ No news articles found for ${ticker}. Nothing sent to backend.`);
    }
    console.log(`📰 All fetched articles: ${allArticles.length}`);
    console.log(`🧹 After deduplication: ${uniqueArticles.length}`);
  
    return uniqueArticles;
  }

  function stringSimilarity(str1, str2) {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
  
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
  
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
  
    const editDistance = getEditDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
  }
  
  function getEditDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }
  
  function removeSimilarArticles(articles, threshold = 0.8) {
    const unique = [];
  
    for (const current of articles) {
      const currentKey = (current.headline + current.summary).toLowerCase().trim();
  
      const isDuplicate = unique.some(existing => {
        const existingKey = (existing.headline + existing.summary).toLowerCase().trim();
        const similarity = stringSimilarity(currentKey, existingKey);
        return similarity >= threshold;
      });
  
      if (!isDuplicate) {
        unique.push(current);
      }
    }
  
    return unique;
  }