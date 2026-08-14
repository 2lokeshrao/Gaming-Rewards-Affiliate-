import re

with open('server.ts', 'r') as f:
    text = f.read()

route_code = """
app.post('/api/generate-article', async (req, res) => {
  try {
    const { topic, category, platformName, platformId } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert SEO content writer and copywriter for a gaming/finance affiliate website. 
    Write a comprehensive, engaging, and highly SEO-optimized article about "${topic}" in the category of "${category}".
    ${platformName ? `The article should focus heavily on the brand/platform: ${platformName}.` : ''}
    
    Guidelines:
    - Use proper markdown formatting (H2, H3, bold text, bullet points).
    - Write an engaging introduction and a strong conclusion.
    - Naturally include relevant keywords related to the topic.
    - Return the response as JSON matching the schema precisely.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A catchy, SEO-friendly H1 title' },
            metaTitle: { type: Type.STRING, description: 'SEO Meta Title (max 60 chars)' },
            metaDescription: { type: Type.STRING, description: 'SEO Meta Description (max 160 chars)' },
            content: { type: Type.STRING, description: 'The full article content in Markdown format' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-7 relevant SEO tags/keywords' }
          },
          required: ['title', 'metaTitle', 'metaDescription', 'content', 'tags']
        },
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding for trending info
      }
    });

    if (!response.text) {
      return res.status(500).json({ error: 'AI returned empty response' });
    }
    
    const generated = JSON.parse(response.text);
    res.json(generated);
  } catch (error: any) {
    console.error('Error generating AI article:', error);
    res.status(500).json({ error: 'Failed to generate article: ' + error.message });
  }
});

"""

# Insert before `app.listen`
pattern = r'(app\.listen\(PORT,)'
text = re.sub(pattern, route_code + r'\1', text)

with open('server.ts', 'w') as f:
    f.write(text)
