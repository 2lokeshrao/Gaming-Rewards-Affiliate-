import re

with open('src/components/LazyImage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add priority prop
pattern = r"interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> \{"
replacement = r"""interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;"""

content = re.sub(pattern, replacement, content)

# Change loading attribute
pattern_loading = r"(<img loading=)\"lazy\""
replacement_loading = r"\1{priority ? \"eager\" : \"lazy\"}"

content = re.sub(pattern_loading, replacement_loading, content)

# Update the props destructuring
pattern_props = r"export const LazyImage: React.FC<LazyImageProps> = \(\{ src, alt, className = '', \.\.\.props \}\) => \{"
replacement_props = r"export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', priority = false, ...props }) => {"

content = re.sub(pattern_props, replacement_props, content)

with open('src/components/LazyImage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
