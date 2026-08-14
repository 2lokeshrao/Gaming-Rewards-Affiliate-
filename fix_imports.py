with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace("import { CustomPageManagerTab } from './AiArticleManagerTab';", "")
text = text.replace("import { AiArticleManagerTab } from './AiArticleManagerTab';\nimport { CustomPageManagerTab } from \"./CustomPageManagerTab\";\n", "import { AiArticleManagerTab } from './AiArticleManagerTab';\nimport { CustomPageManagerTab } from './CustomPageManagerTab';\n")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
