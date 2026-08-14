with open('src/components/AdminPanel.tsx', 'r') as f:
    text = f.read()

text = text.replace("{stats.totalVisits}", "{stats?.totalVisits || 0}")
text = text.replace("{stats.totalClicks}", "{stats?.totalClicks || 0}")
text = text.replace("{stats.totalPromoCopies}", "{stats?.totalPromoCopies || 0}")
text = text.replace("{stats.totalWheelSpins}", "{stats?.totalWheelSpins || 0}")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(text)
