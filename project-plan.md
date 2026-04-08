# Kid Learning Math App — Project Plan

**Date:** 9 April 2026
**Curriculum:** New Zealand (Year 2–6)
**Type:** Web app (HTML/CSS/JS), kid-friendly UI

---

## Overview

A browser-based math practice app for New Zealand primary school children (Year 2–6). Kids select their year level, choose between practice or mixed test mode, and answer questions tailored to their number range and operations. The app runs offline with no frameworks required.

---

## NZ Curriculum Alignment

| Year | Age   | Number Range | Operations Available |
|------|-------|-------------|----------------------|
| Year 2 | 6–7  | < 20        | + −                  |
| Year 3 | 7–8  | < 100       | + − (intro ×)        |
| Year 4 | 8–9  | < 100       | + − × ÷              |
| Year 5 | 9–10 | < 1,000     | + − × ÷              |
| Year 6 | 10–11| < 10,000    | + − × ÷              |

---

## App Screens

### 1. Home / Welcome Screen (`index.html`)
- Friendly mascot and bright, welcoming design
- Player name entry (optional, stored locally)
- Year level selector buttons (Year 2 → Year 6)

### 2. Level Select Screen (part of `index.html`)
- Displays the number range for the selected year
- Shows which operations are available
- Two mode buttons: **Practice** or **Mixed Test**

### 3. Practice Mode (`practice.html`)
- One operation at a time (e.g. addition only)
- 10 questions per session
- Instant feedback: ✅ correct / ❌ incorrect with animation
- Large tap targets — touch/tablet friendly
- Encouraging messages between questions

### 4. Mixed Test Mode (`test.html`)
- 10–20 questions mixing all unlocked operations for the year level
- Optional countdown timer (can be toggled off for younger kids)
- Progress bar across the top
- No feedback until end of test

### 5. Results Screen (`results.html`)
- Star rating: ⭐ (1–3 stars based on score %)
- Confetti/celebration animation for high scores
- Score summary (e.g. "8 out of 10 — Awesome!")
- Buttons: **Try Again** and **Go Home**
- Best score saved to localStorage

---

## Tech Stack

| Layer    | Choice                          | Reason                                  |
|----------|---------------------------------|-----------------------------------------|
| HTML     | Vanilla HTML5 (multi-page)     | Simple, no build step, offline-friendly |
| CSS      | Custom CSS (style.css)         | Full control over kid-friendly design   |
| JS       | Vanilla JavaScript (app.js)    | Lightweight, no dependencies            |
| Audio    | Web Audio API                  | Feedback sounds without external files  |
| Storage  | localStorage                   | Save player name and best scores        |

---

## File Structure

```
Kid-Learning-Math-App/
├── project-plan.md     ← This file
├── index.html          ← Home screen + year/level selector
├── practice.html       ← Single-operation practice mode
├── test.html           ← Mixed test mode
├── results.html        ← Results, stars, and celebration
├── style.css           ← Shared kid-friendly design system
└── app.js              ← Question engine, scoring, timer logic
```

---

## Build Order

1. **`style.css`** — Design system: colours, fonts, button styles, animations
2. **`app.js`** — Core logic: question generator, answer checker, scoring, timer
3. **`index.html`** — Home screen with name entry and year/level picker
4. **`practice.html`** — Practice mode UI wired to app.js
5. **`test.html`** — Mixed test mode with timer toggle
6. **`results.html`** — Score display, stars, confetti, navigation

---

## Design Principles

- **Big and bold** — large fonts, high contrast, easy to read
- **Touch-friendly** — buttons at least 60px tall, generous spacing
- **Encouraging** — positive language, animations for correct answers
- **No reading required** — icons and visuals support all instructions
- **Fast feedback** — responses feel immediate and responsive

---

## Question Generation Rules

- Questions are randomly generated on each session
- Answers are always non-negative whole numbers (no negatives for kids)
- Division questions always divide evenly (no remainders)
- Numbers stay within the year-level range at all times
- No repeated questions within a single session

---

## Milestones

| # | Deliverable              | Status  |
|---|--------------------------|---------|
| 1 | Project plan             | ✅ Done |
| 2 | style.css + design system| ✅ Done |
| 3 | app.js question engine   | ✅ Done |
| 4 | index.html home screen   | ✅ Done |
| 5 | practice.html            | ✅ Done |
| 6 | test.html                | ✅ Done |
| 7 | results.html             | ✅ Done |
| 8 | End-to-end testing       | ⬜ Todo |
