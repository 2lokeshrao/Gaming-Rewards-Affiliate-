import re
import random

with open('src/data.ts', 'r') as f:
    content = f.read()

def add_ratings(match):
    rating = match.group(1)
    starRating = match.group(2)
    # Generate random Universal rating and 10k+ reviews based on some pseudo-randomness
    avg_rating = round(random.uniform(4.7, 4.98), 1)
    reviews_count = random.randint(10500, 48500)
    
    return f'rating: {rating},\n    starRating: {starRating},\n    averageUserRating: {avg_rating},\n    totalReviewsCount: {reviews_count},'

plat_pattern = re.compile(r'rating:\s*([\d\.]+),\s*starRating:\s*(\d),')
content = plat_pattern.sub(add_ratings, content)

with open('src/data.ts', 'w') as f:
    f.write(content)
