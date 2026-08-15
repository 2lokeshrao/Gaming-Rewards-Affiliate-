import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            # We need to add e.currentTarget.onerror = null; to prevent infinite loops
            # Current pattern: onError={(e) => { e.currentTarget.src = "/logos/placeholder.png"; }}
            # Replace with: onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/logos/placeholder.png"; }}
            
            new_content = content.replace(
                'onError={(e) => { e.currentTarget.src = "/logos/placeholder.png"; }}',
                'onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/logos/placeholder.png"; }}'
            )
            
            # For LazyImage.tsx
            new_content = new_content.replace(
                '''onError={(e) => {
          e.currentTarget.src = "/logos/placeholder.png";
          setIsLoaded(true);
        }}''',
                '''onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/logos/placeholder.png";
          setIsLoaded(true);
        }}'''
            )
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
