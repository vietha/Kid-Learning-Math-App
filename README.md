# Math Champions 🦉

A browser-based maths practice app for New Zealand primary school children (Year 2–6).
No installation. No sign-up. Just open and play.

<p align="center">
  <img src="images/math-champions-home-page.png" alt="Math Champions home page" width="420">
</p>

An engaging, touch-friendly maths app with cheerful visuals, year-based levels, and quick practice sessions for young learners.

---

## Quick Start

1. Download or clone this folder to your computer
2. Open **`index.html`** in any modern web browser (Chrome, Firefox, Safari, Edge)
3. Pick a year level and start practising!

> **Works completely offline.** No internet connection required after the first page load
> (Google Fonts will load if online, and fall back to a system font if offline).

---

## Features

| Feature | Details |
|---|---|
| 5 year levels | Year 2–6, aligned to the NZ primary school curriculum |
| Practice Mode | Focus on one operation at a time |
| Mixed Test Mode | All operations shuffled together |
| Optional timer | 60-second countdown per question (toggle on/off) |
| Instant feedback | Animations and sounds after every answer (Practice only) |
| Star ratings | 1–3 stars based on your score |
| Confetti | Launched automatically for a 3-star result |
| Best scores | Saved in your browser with no account needed |
| Touch-friendly | Large numpad buttons — great on tablets and phones |
| Keyboard support | Type numbers + press Enter on desktop |

---

## NZ Curriculum Alignment

| Year | Age | Numbers up to | Operations |
|---|---|---|---|
| Year 2 | 6–7  | 20      | + − |
| Year 3 | 7–8  | 100     | + − × (intro) |
| Year 4 | 8–9  | 100     | + − × ÷ |
| Year 5 | 9–10 | 1,000   | + − × ÷ |
| Year 6 | 10–11| 10,000  | + − × ÷ |

### Question rules
- Answers are always non-negative whole numbers (no negatives)
- Division always divides evenly — no remainders
- Numbers stay within the year-level range at all times
- No repeated questions within a single session

---

## How to Play

### Home screen (`index.html`)
1. Type your name (optional — it's saved for next time)
2. Tap your year level button
3. Choose **Practice** or **Mixed Test**

### Practice Mode (`practice.html`)
- Pick one operation: + − × ÷
- Answer 10 questions one at a time
- See instant feedback (correct/wrong) after each answer
- Encouraging messages keep you going!
- Your score and stars appear at the end

### Mixed Test Mode (`test.html`)
- All available operations are mixed together
- Answer 10 questions with no mid-test feedback
- Toggle the ⏱ timer on or off before you start
- See your results at the end

### Results Screen (`results.html`)
- ⭐ 1–3 stars based on your percentage
- 🎉 Confetti for 80 %+ (3 stars)
- Hit **Try Again** to replay the same mode, or **Go Home** to switch

---

## File Structure

```
Kid-Learning-Math-App/
├── index.html        ← Home screen (name entry, year & mode selector)
├── practice.html     ← Single-operation practice (instant feedback)
├── test.html         ← Mixed test with optional timer
├── results.html      ← Score, stars, confetti, navigation
├── style.css         ← Shared design system
├── app.js            ← Question engine, timer, audio, localStorage
└── project-plan.md   ← Original project specification
```

---

## Development

No build tools, no npm, no frameworks — just open the HTML files directly.

**Recommended for development** — run a local server to avoid browser file-access restrictions:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Browser Support

Chrome, Firefox, Safari, Edge — all modern versions.
Audio uses the Web Audio API (silently skipped if not available).
