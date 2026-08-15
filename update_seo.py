import re

with open('src/utils/seo.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_functions = """
export function injectSeoTags(title: string, description: string, canonicalUrl: string, ogImage?: string) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = title;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);

  if (ogImage) {
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', ogImage);
  }
}
"""

if "injectSeoTags" not in content:
    content += "\n" + new_functions
    with open('src/utils/seo.ts', 'w', encoding='utf-8') as f:
        f.write(content)
