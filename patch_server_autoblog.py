import re

with open('server.ts', 'r') as f:
    text = f.read()

autoblog_logic = """
// ----------------------------------------------------------------------
// AUTOMATED AUTO-BLOGGER BACKGROUND SERVICE
// ----------------------------------------------------------------------
const autoblogInterval = setInterval(async () => {
  if (!stateConfig.autoBlogSettings?.enabled) return;
  if (!process.env.GEMINI_API_KEY) return;
  
  const { categories, topics } = stateConfig.autoBlogSettings;
  if (!categories || categories.length === 0) return;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Pick random category and topic
    const category = categories[Math.floor(Math.random() * categories.length)];
    const topic = topics && topics.length > 0 
      ? topics[Math.floor(Math.random() * topics.length)]
      : 'latest online gaming and banking trends';

    console.log(`[Auto-Blogger] Generating draft for: ${topic} in ${category}`);
    
    const prompt = `You are an expert SEO copywriter. Write a comprehensive, highly engaging article about: "${topic}".
    Category: ${category}.
    Return ONLY valid JSON in this exact format:
    {
      "title": "Catchy SEO Title",
      "content": "Markdown formatted content. At least 500 words.",
      "metaTitle": "SEO Meta Title under 60 chars",
      "metaDescription": "SEO Meta Description under 160 chars",
      "tags": ["tag1", "tag2", "tag3"]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "metaTitle", "metaDescription", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      const newArticle = {
        id: 'art_auto_' + Math.floor(Math.random() * 1000000),
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        title: data.title,
        content: data.content,
        category,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        publishedAt: new Date().toISOString(),
        author: 'AI Auto-Blogger',
        tags: data.tags || [],
        views: 0,
        status: 'draft' as const
      };

      if (!stateConfig.articles) stateConfig.articles = [];
      stateConfig.articles = [newArticle, ...stateConfig.articles];
      console.log(`[Auto-Blogger] Successfully created draft: ${data.title}`);
    }
  } catch (err) {
    console.error('[Auto-Blogger] Error generating article:', err);
  }
}, (stateConfig.autoBlogSettings?.intervalHours || 24) * 60 * 60 * 1000); // Default to checking daily, but interval updates when hours change.

"""

if "AUTOMATED AUTO-BLOGGER BACKGROUND SERVICE" not in text:
    text = text.replace("app.listen(PORT", autoblog_logic + "  app.listen(PORT")

with open('server.ts', 'w') as f:
    f.write(text)
