import re

with open('src/components/SeoManagerTab.tsx', 'r') as f:
    content = f.read()

helper = """
  // Helper to truncate text
  const truncateSeoText = (text: string | undefined, max: number) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const truncated = text.substring(0, max - 3).trim();
    return `${truncated}...`;
  };
"""

if "truncateSeoText" not in content:
    content = content.replace("  const handleAutoGenerateSeo = async () => {", helper + "\n  const handleAutoGenerateSeo = async () => {")

    content = content.replace("      const generatedTitle = data.title;", "      const generatedTitle = truncateSeoText(data.title, 60);")
    content = content.replace("                metaDescription: data.description,", "                metaDescription: truncateSeoText(data.description, 160),")

with open('src/components/SeoManagerTab.tsx', 'w') as f:
    f.write(content)
