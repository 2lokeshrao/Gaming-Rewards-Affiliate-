import re

with open('src/components/ProgrammaticSeoArticles.tsx', 'r') as f:
    content = f.read()

# 1. Add userInteracted state
content = content.replace("const [isPaused, setIsPaused] = useState(false);", "const [isPaused, setIsPaused] = useState(false);\n  const [userInteracted, setUserInteracted] = useState(false);")

# 2. Update useEffect timer
timer_old = """  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 15000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);"""

timer_new = """  useEffect(() => {
    if (isPaused || totalSlides === 0 || userInteracted) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 15000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, userInteracted]);"""

content = content.replace(timer_old, timer_new)

# 3. Update next/prev functions
nav_old = """  const nextSlide = () => setCurrentIndex((p) => (p + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides);"""

nav_new = """  const nextSlide = () => { setUserInteracted(true); setCurrentIndex((p) => (p + 1) % totalSlides); };
  const prevSlide = () => { setUserInteracted(true); setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides); };"""

content = content.replace(nav_old, nav_new)

# 4. Update pagination dots
dots_old = """onClick={() => setCurrentIndex(idx)}"""
dots_new = """onClick={() => { setUserInteracted(true); setCurrentIndex(idx); }}"""
content = content.replace(dots_old, dots_new)

# 5. Update touch swipe handler
touch_old = """  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide(); // Swiped left
    if (distance < -50) prevSlide(); // Swiped right
    setTouchStart(0);
    setTouchEnd(0);
  };"""

touch_new = """  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      setUserInteracted(true); // Disable auto-swipe on manual swipe
      if (distance > 50) setCurrentIndex((p) => (p + 1) % totalSlides); // Swiped left
      if (distance < -50) setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides); // Swiped right
    }
    setTouchStart(0);
    setTouchEnd(0);
  };"""

content = content.replace(touch_old, touch_new)

with open('src/components/ProgrammaticSeoArticles.tsx', 'w') as f:
    f.write(content)
