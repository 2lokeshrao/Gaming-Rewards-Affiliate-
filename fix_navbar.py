import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add Navbar in the main layout if not there
nav_code = "\n        <Navbar platforms={platforms} customPages={customPages} geo={geo} />\n"
if "<Navbar platforms" not in content[content.find("<header"):content.find("</header>")]:
    content = content.replace("        {/* Nav Bar */}", nav_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)
