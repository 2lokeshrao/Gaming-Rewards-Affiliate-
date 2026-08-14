import re

with open('src/components/Footer.tsx', 'r') as f:
    text = f.read()

# I will just remove the extra </div>
text = text.replace(
"""          </div>
        </footer>
""", 
"""        </footer>
"""
)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(text)
