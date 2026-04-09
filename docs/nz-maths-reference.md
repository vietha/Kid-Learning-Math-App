# NZ Maths Reference for App Logic

This document is the working reference for math scope decisions in the app.

It has 2 purposes:

1. Capture the New Zealand Ministry of Education guidance for Years 1-6 in one place.
2. Define the app's internal difficulty model and logic checks, so future code changes can be reviewed against a stable reference.

This is a product reference, not a legal or official curriculum reproduction.
Official curriculum guidance comes first; app difficulty labels such as `easy`, `medium`, `hard`, and `talent` are internal design choices.

Last reviewed: 2026-04-09

## Official Source Set

- Year 1 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-1-new-zealand-curriculum/maths-and-statistics-in-year-1
- Year 2 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-2-new-zealand-curriculum/maths-and-statistics-in-year-2
- Year 3 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-3-new-zealand-curriculum/mathematics-and-statistics-in-year-3
- Year 4 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-4-new-zealand-curriculum/maths-and-statistics-in-year-4
- Year 5 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-5-new-zealand-curriculum/maths-and-statistics-in-year-5
- Year 6 maths: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-6-new-zealand-curriculum/mathematics-and-statistics-in-year-6
- Year-by-year guide hub: https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/understand-your-childs-learning/new-zealand-curriculum-year-by-year-learning-guide

## How To Use This Doc

When changing math logic:

1. Check the official year-level summary below.
2. Check the app scope for that year.
3. Check the difficulty rules.
4. Check the implementation checklist before shipping.

If the app intentionally simplifies the official curriculum, document that simplification instead of silently assuming it is curriculum-accurate.

## Year-by-Year Reference

### Year 1

Official guidance summary:
- Count in 1s, 2s, and 10s forwards and backwards.
- Recognise, read, write, compare, and place-value numbers up to at least 100.
- Join and separate groups up to 20.
- Learn basic addition facts up to 10 and related subtraction facts.
- Build early multiplication/division ideas through equal groups.
- Explore halves and quarters of small sets or shapes.
- Solve simple missing-number statements such as `3 + X = 7`.

App scope:
- Current app scope is intentionally narrower than the official guidance.
- Use addition only.
- No subtraction in Year 1 mixed test or Year 1 practice.
- Use numbers up to 10.
- Keep questions direct and concrete.

Why this differs from the official source:
- The official Year 1 guidance includes early subtraction and simple unknown-value tasks.
- The product decision for this app is to keep Year 1 friendlier and less cognitively heavy.

Recommended app checks:
- Mixed test must use only `add`.
- No negative numbers.
- No 3-term expressions.
- Missing-number format should be off by default for Year 1.
- Avoid carry-focused patterns dominating the set.

### Year 2

Official guidance summary:
- Work with numbers up to about 120.
- Count forwards/backwards in 1s, 2s, 5s, and 10s.
- Use place value with tens and ones.
- Add and subtract using place-value thinking.
- Recall addition facts and doubles/halves up to 20.
- Develop multiplication/division through grouping and skip counting with 2s, 5s, and 10s.
- Recognise simple fractions such as halves, thirds, and quarters.
- Use true/false and fill-in-the-blank number statements.

App scope:
- Addition and subtraction only.
- Numbers up to 20.
- No multiplication or division yet in the app.

Recommended app checks:
- Mixed test should use only `add` and `sub`.
- Results stay non-negative.
- Missing-number questions should be rare in medium and more common only in harder settings.

### Year 3

Official guidance summary:
- Work with whole numbers up to 1,000.
- Skip count in 2s, 3s, 4s, 5s, 8s, 10s, and 100s.
- Recall multiplication and division facts for core tables.
- Solve addition and subtraction problems up to 1,000.
- Use rounding and estimation.
- Read, write, compare, and add/subtract simple fractions with the same denominator.
- Use missing-number equations and growing/repeating patterns.

App scope:
- Addition, subtraction, and introductory multiplication.
- Numbers up to 100 in the current product design.
- No division in the app at Year 3.

Recommended app checks:
- Multiplication should feel introductory.
- Division must not appear in Year 3 mixed test.
- Addition/subtraction should still make up most of the set.

### Year 4

Official guidance summary:
- Read, write, order, and compare whole numbers up to 10,000.
- Add and subtract 2, 3, and 4-digit numbers.
- Know 2 to 10 times tables.
- Practise multiplication and division with larger numbers.
- Start decimal tenths.
- Add/subtract same-denominator fractions.
- Find fractions of sets and recover wholes from fractions.
- Fill missing numbers in addition, subtraction, multiplication, and division equations.

App scope:
- Addition, subtraction, multiplication, division.
- Numbers up to 100.
- Harder unknown-value questions become appropriate here.

Recommended app checks:
- Mixed test may use all 4 operations.
- Missing-number equations are appropriate from this year upward.
- Direct-answer questions should still remain common in easier modes.

### Year 5

Official guidance summary:
- Work with numbers up to 1,000,000.
- Round large whole numbers.
- Count backwards through 0 into negatives.
- Multiply 3 and 4-digit numbers by 1-digit numbers, and some 2-digit by 2-digit cases.
- Divide 4-digit numbers by 1-digit numbers with remainders.
- Memorise 11 and 12 times tables.
- Calculate with 2 decimal places.
- Use decimals, fractions, and common percentages such as 10%, 25%, and 50%.
- Solve missing-number equations across all 4 operations.

App scope:
- Addition, subtraction, multiplication, division.
- Numbers up to 1,000.
- Whole-number arithmetic only in current game logic.

Recommended app checks:
- No decimals, percentages, or remainders in current arithmetic engine unless explicitly added later.
- Talent mode may stretch structure complexity, but not beyond whole-number solvability.

### Year 6

Official guidance summary:
- Work confidently with numbers up to 1,000,000.
- Round, compare, and estimate with whole numbers and decimals to 3 places.
- Multiply and divide larger numbers with formal methods.
- Use order of operations.
- Understand negative numbers.
- Add, subtract, compare, and convert related fractions and decimals.
- Solve fraction/decimal/percentage quantity problems.
- Use missing numbers in equations and generate pattern rules.

App scope:
- Addition, subtraction, multiplication, division.
- Numbers up to 10,000.
- Whole-number arithmetic only in the current game logic.

Recommended app checks:
- Talent mode is the best place for richer structure such as 3-term expressions.
- If order-of-operations questions are introduced later, Year 6 is the safest first target.

## App Difficulty Model

Important:
- These difficulty labels are app-specific.
- They are not official NZ curriculum labels.

### Easy

Use when the goal is fluency and confidence.

Characteristics:
- Standard format is preferred: `A + B = ?`
- No missing operand by default
- Simpler number sizes for the year
- Minimal regrouping or borrowing
- Avoid multi-step expressions

### Medium

Use when the goal is normal year-level practice.

Characteristics:
- Mostly standard format
- Around 10% of addition/subtraction questions may use missing-number format
- Slightly more demanding number combinations
- Usually one meaningful carry/borrow where appropriate for the year
- Still single-step

Examples:
- `31 + 22 = ?`
- `45 - 18 = ?`
- occasional `21 + ? = 34`

### Hard

Use when the goal is stronger reasoning and less pattern memorisation.

Characteristics:
- More regrouping and borrowing
- Missing-number format appears more often than medium
- Larger numbers inside the year range
- May use less familiar factor pairs or divisor structures
- Still should remain solvable by the intended year level

Examples:
- `? + 49 = 74`
- `84 - ? = 17`

### Talent

Use when the goal is extension, not acceleration into completely different curriculum content.

Characteristics:
- Can include short 3-term whole-number expressions
- Can combine `+` and `-` in one expression
- Can use higher reasoning load and more varied unknown placement
- Must still respect the year's overall arithmetic scope and avoid impossible or misleading notation

Examples:
- `24 + 16 + 30 = ?`
- `48 + 7 - 33 = ?`
- `43 - 23 + 18 = ?`

Guardrails:
- Only use 3-term expressions where they still feel age-appropriate.
- Keep answers as non-negative whole numbers.
- Avoid introducing formal algebra symbols beyond `?`.

## Implementation Checklist for This App

### General

- Answers must be non-negative whole numbers.
- Mixed test must only use operations listed for that year in `YEAR_CONFIG`.
- Question generation must stay within the year's numeric range.
- Results and analytics must use the exact completed test result, not a stale history entry.
- Difficulty should affect structure and reasoning load, not just bigger numbers.

### Addition

- Easy should mostly use direct totals.
- Medium should mostly stay direct, with only a small number of unknown-position questions.
- Hard can increase unknown-position questions.
- Talent can introduce 3-term addition or mixed `+/-` expressions.

### Subtraction

- Never produce negative answers.
- For easier modes, keep subtraction direct more often than not.
- Unknown-position subtraction should appear later and more often in higher difficulty.
- For Year 1, subtraction is intentionally disabled in the app even though the official guidance includes early subtraction ideas.

### Multiplication

- Keep factors aligned with the year's intent.
- Introductory multiplication should appear before routine division.
- Harder modes should vary factor placement and familiarity, not just increase raw size.

### Division

- Division must divide evenly in the current app unless the product explicitly changes that rule later.
- Do not show division for years where the app scope excludes it.

## Known Product Simplifications vs Official Guidance

These are intentional product choices unless changed in a future release:

- Year 1 app scope is addition-only, even though the official Year 1 guidance includes early subtraction and simple missing-number statements.
- Year 2 app scope excludes multiplication and division, even though official guidance introduces grouping and skip-counting ideas.
- Year 3 app scope excludes division, even though official guidance includes multiplication/division fact development.
- Years 4-6 app logic currently focuses on whole-number arithmetic and does not yet cover the wider official fraction, decimal, percentage, measurement, geometry, statistics, and probability content.

## When To Update This Document

Update this file whenever:

- a year-level operation set changes
- a numeric range changes
- a difficulty rule changes
- a new question structure is added
- the app adds decimals, fractions, percentages, word problems, or order of operations
- official NZ Ministry guidance changes in a way that affects app scope
