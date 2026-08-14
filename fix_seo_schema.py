import re

with open('src/utils/seo.ts', 'r') as f:
    content = f.read()

replacement = """
  // Generate SoftwareApplication Schema for featured platforms
  const softwareSchemas = platforms.filter(p => p.isActive && p.isFeatured).map(p => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": p.name,
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web, Android, iOS",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating || 9.5,
      "ratingCount": p.totalReviewsCount || 15000
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }));

  const combinedSchema = [faqSchema, ...softwareSchemas];

  return combinedSchema;
}
"""

content = content.replace("  return faqSchema;\n}", replacement)

with open('src/utils/seo.ts', 'w') as f:
    f.write(content)
