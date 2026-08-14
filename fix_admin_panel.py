import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

# Add useEffect for customPages
use_effect_insertion = """  const [pagesList, setPagesList] = useState<CustomPage[]>(customPages || []);

  useEffect(() => {
    if (customPages) {
      setPagesList(customPages);
    }
  }, [customPages]);
"""
text = text.replace("  const [pagesList, setPagesList] = useState<CustomPage[]>(customPages || []);", use_effect_insertion)

# Check if AI Article Tab and Footer Manager exist in tabs list, if not add them
if "'articles'" not in text:
    text = text.replace(
        "| 'abtest' | 'pages'>('dashboard');",
        "| 'abtest' | 'pages' | 'articles' | 'footer'>('dashboard');"
    )

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
