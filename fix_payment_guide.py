import re

with open('src/components/PaymentGuideSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("title: \"Popular Payment Methods in India\",", "title: t('guide.title.IN') || \"Popular Payment Methods in India\",")
content = content.replace("title: \"Popular Payment Methods in Brazil\",", "title: t('guide.title.BR') || \"Popular Payment Methods in Brazil\",")
content = content.replace("title: \"Popular Payment Methods in Canada\",", "title: t('guide.title.CA') || \"Popular Payment Methods in Canada\",")
content = content.replace("title: \"Global Secure Payment Methods\",", "title: t('guide.title.Global') || \"Global Secure Payment Methods\",")

with open('src/components/PaymentGuideSection.tsx', 'w') as f:
    f.write(content)
