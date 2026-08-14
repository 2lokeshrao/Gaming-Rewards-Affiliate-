with open('src/App.tsx', 'r') as f:
    text = f.read()

if "import { AiArticleView }" not in text:
    text = text.replace(
        "import { Footer } from './components/Footer';",
        "import { Footer } from './components/Footer';\nimport { AiArticleView } from './components/AiArticleView';"
    )

with open('src/App.tsx', 'w') as f:
    f.write(text)
