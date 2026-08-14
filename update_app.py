import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports_to_add = """
import { Navbar } from './components/Navbar';
import { CustomPageView } from './components/CustomPageView';
import { CustomPage } from './types';
"""
if "import { Navbar }" not in content:
    content = content.replace("import { BrandArticlePage }", imports_to_add + "import { BrandArticlePage }")

if "const [customPages, setCustomPages] = useState<CustomPage[]>([]);" not in content:
    content = content.replace("const [subPartners, setSubPartners] = useState", "const [customPages, setCustomPages] = useState<CustomPage[]>([]);\n  const [subPartners, setSubPartners] = useState")

if "if (data.customPages) setCustomPages(data.customPages);" not in content:
    content = content.replace("if (data.subPartners) setSubPartners(data.subPartners);", "if (data.subPartners) setSubPartners(data.subPartners);\n        if (data.customPages) setCustomPages(data.customPages);")

routing = """
  // Custom Page Routing
  const customPageMatch = customPages.find(p => currentPath === `/${p.slug}`);
  if (customPageMatch) {
    return (
      <>
        <TopLoadingBar isLoading={isNavigating} />
        <Navbar platforms={platforms} customPages={customPages} geo={geo} />
        <CustomPageView page={customPageMatch} />
      </>
    );
  }
"""
if "// Custom Page Routing" not in content:
    content = content.replace("// Dynamic Brand Pages", routing + "\n  // Dynamic Brand Pages")

if "<TopBanner" in content and "<Navbar" not in content:
    # Add Navbar below TopBanner in the main render
    content = content.replace("<TopBanner", "<Navbar platforms={platforms} customPages={customPages} geo={geo} />\n        <TopBanner")

# Update AdminPanel props
if "customPages={customPages}" not in content:
    content = content.replace("<AdminPanel config={config}", "<AdminPanel config={config} customPages={customPages}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
