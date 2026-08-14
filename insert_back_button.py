import re

def insert_back_button(file_path):
    with open(file_path, 'r') as f:
        text = f.read()
    
    if "import { BackButton }" not in text:
        text = text.replace("import { Eye", "import { BackButton } from './BackButton';\nimport { Eye")
        text = text.replace("import { Star", "import { BackButton } from './BackButton';\nimport { Star")
        text = text.replace("import { Shield", "import { BackButton } from './BackButton';\nimport { Shield")
        text = text.replace("import { Navbar }", "import { BackButton } from './BackButton';\nimport { Navbar }")

    # Insert back button near the top of the main container
    if "<BackButton className=\"mb-6\" />" not in text:
        # Find something like `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`
        text = text.replace('<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">', '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n          <BackButton className="mb-6" />')
        
    with open(file_path, 'w') as f:
        f.write(text)

insert_back_button('src/components/AiArticleView.tsx')
insert_back_button('src/components/CustomPageView.tsx')
