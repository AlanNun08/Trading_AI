import OpenAI from "openai";
import { updateInsightOnBackend } from "./api";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateNewsInsights(newsArray, onInsightReceived, ticker) {
  const systemPrompt = `
    You are a financial research assistant generating investor-ready insights from financial news.

    For each article, analyze and summarize the following in a structured and concise format:

    1. **Key Context**  
      - What happened? Why does it matter?

    2. **Short-Term Market Impact**  
      - Price movements? Beat or miss on earnings? Volume or volatility reaction?

    3. **Long-Term Outlook**  
      - What is the company’s strategic direction? Are there concerns or promising signals?

    4. **Actionable Recommendation**  
      - Based on results and market signals, what should an investor consider?

    Where possible, always include:
    - Key metrics (EPS, revenue, margins, debt, cash flow)
    - Analyst expectations vs actuals
    - Market sentiment or price reactions
    - Updated forward guidance
    - Competitive comparisons
    - Risks (legal, regulatory, operational)

    Respond in a structured format using the provided function schema: "summarizeArticle".

    `;

  const functions = [
    {
      type: "function",
      name: "summarizeArticle",
      description: "Generate structured investment insight from a financial news article.",
      parameters: {
        type: "object",
        properties: {
          context: {
            type: "string",
            description: "What the article is about and why it matters",
          },
          short_term: {
            type: "string",
            description: "Immediate impact on investor sentiment or stock movement",
          },
          long_term: {
            type: "string",
            description: "Implications for the company’s long-term value or strategy",
          },
          recommendation: {
            type: "string",
            description: "What an investor should consider doing or watching for",
          },
        },
        required: ["context", "short_term", "long_term", "recommendation"],
      },
    },
  ];

  for (let i = 0; i < newsArray.length; i++) {
    const article = newsArray[i];
    const userPrompt = `
      Analyze the following earnings-related article for key investor takeaways.

      Headline: ${article.headline}  
      Source: ${article.source}  
      Summary: ${article.summary}

      Please include:
      - Financial metrics (EPS, revenue, margins)
      - Comparison to analyst expectations
      - Market reaction if available
      - Risks or red flags

      Format response using the schema fields provided.
      `;

    try {
      console.log(`🔎 Analyzing article ${i + 1}/${newsArray.length}: "${article.headline}"`);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: functions[0],
          },
        ],
        tool_choice: "auto",
      });

      const toolResult = completion.choices[0].message.tool_calls?.[0]?.function?.arguments;
      const parsed = toolResult ? JSON.parse(toolResult) : null;

      if (!parsed) {
        throw new Error("No valid structured response returned.");
      }

      const updated = {
        ticker,
        date: new Date(article.datetime * 1000).toISOString().split('T')[0],
        headline: article.headline,
        source: article.source,
        aiSummary: parsed,
      };

      onInsightReceived(updated);
      console.log("✅ Insight generated:", updated);
      await updateInsightOnBackend(updated);

    } catch (err) {
      console.error(`❌ Failed insight for: ${article.headline}`, err);

      const fallback = {
        ticker,
        date: new Date(article.datetime * 1000).toISOString().split('T')[0],
        headline: article.headline,
        source: article.source,
        aiSummary: {
          context: "",
          short_term: "",
          long_term: "",
          recommendation: "⚠️ Error generating insight.",
        },
      };

      onInsightReceived(fallback);
    }

    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log("🎉 All insights generated and sent.");
}
