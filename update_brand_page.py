import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Update BrandArticlePage props in App.tsx to pass customPages and config
text = text.replace(
    "<BrandArticlePage path={currentPath} geo={geo} platforms={platforms} onClaimClick={handleClaimClick} />",
    "<Navbar platforms={platforms} customPages={customPages} geo={geo} />\n        <BrandArticlePage path={currentPath} geo={geo} platforms={platforms} customPages={customPages} config={config} onClaimClick={handleClaimClick} />"
)

# And CustomPageView needs config for sidebar ad
text = text.replace(
    "<CustomPageView page={customPageMatch} />",
    "<CustomPageView page={customPageMatch} platforms={platforms} customPages={customPages} config={config} />"
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
