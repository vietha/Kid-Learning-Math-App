// ============================================================
// CONFIGURATION
// ============================================================

const YEAR_CONFIG = {
  1: { max: 10,    ops: ['add'],                      label: 'Year 1', age: '5–6'  },
  2: { max: 20,    ops: ['add', 'sub'],               label: 'Year 2', age: '6–7'  },
  3: { max: 100,   ops: ['add', 'sub', 'mul'],        label: 'Year 3', age: '7–8'  },
  4: { max: 100,   ops: ['add', 'sub', 'mul', 'div'], label: 'Year 4', age: '8–9'  },
  5: { max: 1000,  ops: ['add', 'sub', 'mul', 'div'], label: 'Year 5', age: '9–10' },
  6: { max: 10000, ops: ['add', 'sub', 'mul', 'div'], label: 'Year 6', age: '10–11'}
};


const OP_SYMBOLS = { add: '+', sub: '−', mul: '×', div: '÷' };
const OP_NAMES   = { add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division' };

const CORRECT_MSGS = [
  'Amazing!', 'Brilliant!', 'Super!', 'Great job!',
  'Fantastic!', 'Excellent!', 'Spot on!', 'Wow!',
  'Keep it up!', 'You rock!'
];

const WRONG_MSGS = [
  'Nice try!', 'Keep going!', 'Almost!', "You've got this!",
  "Don't give up!", 'Try again next time!', 'So close!'
];

const ENCOURAGE_MSGS = [
  "You're doing great! 🌟", "Keep going, superstar! ⭐",
  "Almost there! 💪", "You're on fire! 🔥", "Math hero! 🦸",
  "Brilliant work! 🎉", "Challenge accepted! 💡", "You can do it! 🚀"
];

// ============================================================
// RANDOM HELPERS
// ============================================================

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// DIFFICULTY HELPERS
// ============================================================

// How many digit positions produce a carry when adding a + b
function carryCount(a, b) {
  let count = 0, carry = 0, x = a, y = b;
  do {
    const s = (x % 10) + (y % 10) + carry;
    carry = s >= 10 ? 1 : 0;
    if (carry) count++;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  } while (x > 0 || y > 0);
  return count;
}

// How many digit positions require a borrow when computing a − b (a >= b)
function borrowCount(a, b) {
  let count = 0, borrow = 0, x = a, y = b;
  do {
    const d = (x % 10) - (y % 10) - borrow;
    borrow = d < 0 ? 1 : 0;
    if (borrow) count++;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  } while (x > 0 || y > 0);
  return count;
}

// Return a random multiplication/division factor appropriate for the difficulty.
// Factors are grouped by how cognitively demanding their times-tables are:
//   easy   → ×2, ×5, ×10  (skip-counting friendly)
//   medium → ×3, ×4, ×6
//   hard   → ×7, ×8, ×9
//   talent → ×11, ×12
// Falls back to the next easier pool if the year level can't support the target.
function pickFactor(year, difficulty) {
  const { max } = YEAR_CONFIG[year];
  const maxF = year === 3 ? 5 : Math.min(12, Math.floor(Math.sqrt(max)));
  const POOLS = { easy: [2, 5, 10], medium: [3, 4, 6], hard: [7, 8, 9], talent: [11, 12] };
  for (const d of [difficulty, 'hard', 'medium', 'easy']) {
    const pool = (POOLS[d] || []).filter(f => f >= 2 && f <= maxF);
    if (pool.length) return randFrom(pool);
  }
  return 2;
}

// Rejection-sample (a, b) pairs until one satisfies the difficulty predicate.
// Falls back through easier difficulties if the target is impossible for this year range.
function samplePair(gen, predicates, difficulty) {
  const order = { easy: ['easy'], medium: ['medium', 'easy'], hard: ['hard', 'medium', 'easy'], talent: ['talent', 'hard', 'medium', 'easy'] };
  for (const d of (order[difficulty] || ['medium', 'easy'])) {
    const check = predicates[d];
    if (!check) continue;
    for (let i = 0; i < 120; i++) {
      const p = gen();
      if (check(p.a, p.b)) return p;
    }
  }
  return gen(); // last resort — any valid pair
}

function chanceForMissingOperand(difficulty) {
  switch (difficulty) {
    case 'medium': return 0.10;
    case 'hard':   return 0.35;
    case 'talent': return 0.55;
    default:       return 0;
  }
}

function buildAddQuestion(a, b, difficulty) {
  const total = a + b;
  const standard = `${a} ${OP_SYMBOLS.add} ${b} = ?`;
  if (Math.random() >= chanceForMissingOperand(difficulty)) {
    return { text: standard, answer: total, key: `add:${standard}:${total}` };
  }
  const variants = [`${a} ${OP_SYMBOLS.add} ? = ${total}`, `? ${OP_SYMBOLS.add} ${b} = ${total}`];
  const text = randFrom(variants);
  const answer =
    text === `${a} ${OP_SYMBOLS.add} ? = ${total}` ? b :
    text === `? ${OP_SYMBOLS.add} ${b} = ${total}` ? a :
    total;
  return { text, answer, key: `add:${text}:${answer}` };
}

function buildSubQuestion(a, b, difficulty) {
  const diff = a - b;
  const standard = `${a} ${OP_SYMBOLS.sub} ${b} = ?`;
  if (Math.random() >= chanceForMissingOperand(difficulty)) {
    return { text: standard, answer: diff, key: `sub:${standard}:${diff}` };
  }
  const variants = [`${a} ${OP_SYMBOLS.sub} ? = ${diff}`, `? ${OP_SYMBOLS.sub} ${b} = ${diff}`];
  const text = randFrom(variants);
  const answer =
    text === `${a} ${OP_SYMBOLS.sub} ? = ${diff}` ? b :
    text === `? ${OP_SYMBOLS.sub} ${b} = ${diff}` ? a :
    diff;
  return { text, answer, key: `sub:${text}:${answer}` };
}

function buildTalentExpressionQuestion(year, op) {
  const { max } = YEAR_CONFIG[year];

  if (op === 'add') {
    for (let i = 0; i < 100; i++) {
      const a = randInt(2, Math.max(3, Math.floor(max * 0.5)));
      const b = randInt(1, Math.max(2, Math.floor(max * 0.4)));
      const canUsePlusPlus = a + b + 1 <= max;
      const canUsePlusMinus = a + b - 1 >= 0;
      const allowMinus = year >= 2;
      const usePlusMinus = allowMinus && canUsePlusMinus && (!canUsePlusPlus || Math.random() < 0.5);

      if (usePlusMinus) {
        const c = randInt(1, a + b - 1);
        const result = a + b - c;
        if (result >= 0 && result <= max) {
          return {
            a, b, c, op, answer: result,
            text: `${a} ${OP_SYMBOLS.add} ${b} ${OP_SYMBOLS.sub} ${c} = ?`,
            key: `addmix:${a}:${b}:${c}:${result}`
          };
        }
      }

      const cMax = Math.max(1, max - a - b);
      const c = randInt(1, cMax);
      const total = a + b + c;
      if (total <= max) {
        return {
          a, b, c, op, answer: total,
          text: `${a} ${OP_SYMBOLS.add} ${b} ${OP_SYMBOLS.add} ${c} = ?`,
          key: `add3:${a}:${b}:${c}:${total}`
        };
      }
    }
  }

  if (op === 'sub') {
    for (let i = 0; i < 120; i++) {
      const a = randInt(3, max);
      const b = randInt(1, a - 1);
      const c = randInt(1, Math.max(1, max - a + b));
      const addThenSub = a - b + c;
      if (addThenSub >= 0 && addThenSub <= max) {
        return {
          a, b, c, op, answer: addThenSub,
          text: `${a} ${OP_SYMBOLS.sub} ${b} ${OP_SYMBOLS.add} ${c} = ?`,
          key: `submix:${a}:${b}:${c}:${addThenSub}`
        };
      }
      const subThenSub = a - b - c;
      if (subThenSub >= 0) {
        return {
          a, b, c, op, answer: subThenSub,
          text: `${a} ${OP_SYMBOLS.sub} ${b} ${OP_SYMBOLS.sub} ${c} = ?`,
          key: `sub3:${a}:${b}:${c}:${subThenSub}`
        };
      }
    }
  }

  return null;
}

// ============================================================
// QUESTION GENERATION
// ============================================================

function generateQuestion(year, op, difficulty = 'medium') {
  const { max } = YEAR_CONFIG[year];
  const effectiveDifficulty = (year === 1 && (op === 'add' || op === 'sub')) ? 'easy' : difficulty;
  let a, b, answer;

  switch (op) {

    // ── Addition ──────────────────────────────────────────────
    // Easy:   no carrying at any digit  (12 + 14 = 26)
    // Medium: exactly 1 carry           (15 + 17 = 32)
    // Hard:   1 carry, both ≥ 10        (47 + 35 = 82)
    // Talent: 2+ carries                (86 + 75 = 161)
    case 'add': {
      if (difficulty === 'talent') {
        const talentQ = buildTalentExpressionQuestion(year, 'add');
        if (talentQ) return talentQ;
      }
      const { a: ra, b: rb } = samplePair(
        () => { const a = randInt(1, max - 1); return { a, b: randInt(1, max - a) }; },
        {
          easy:   (a, b) => carryCount(a, b) === 0,
          medium: (a, b) => carryCount(a, b) === 1,
          hard:   (a, b) => carryCount(a, b) === 1 && a >= 10 && b >= 10,
          talent: (a, b) => carryCount(a, b) >= 2,
        },
        effectiveDifficulty
      );
      a = ra; b = rb;
      const q = buildAddQuestion(a, b, effectiveDifficulty);
      answer = q.answer;
      return { a, b, op, answer, text: q.text, key: q.key };
      break;
    }

    // ── Subtraction ───────────────────────────────────────────
    // Easy:   no borrowing              (29 − 12 = 17)
    // Medium: exactly 1 borrow          (26 − 17 =  9)
    // Hard:   1 borrow, both ≥ 10       (54 − 28 = 26)
    // Talent: 2+ borrows                (304 − 187 = 117)
    case 'sub': {
      if (difficulty === 'talent') {
        const talentQ = buildTalentExpressionQuestion(year, 'sub');
        if (talentQ) return talentQ;
      }
      const { a: ra, b: rb } = samplePair(
        () => { const a = randInt(2, max); return { a, b: randInt(1, a - 1) }; },
        {
          easy:   (a, b) => borrowCount(a, b) === 0,
          medium: (a, b) => borrowCount(a, b) === 1,
          hard:   (a, b) => borrowCount(a, b) === 1 && a >= 10 && b >= 10,
          talent: (a, b) => borrowCount(a, b) >= 2,
        },
        effectiveDifficulty
      );
      a = ra; b = rb;
      const q = buildSubQuestion(a, b, effectiveDifficulty);
      answer = q.answer;
      return { a, b, op, answer, text: q.text, key: q.key };
      break;
    }

    // ── Multiplication ────────────────────────────────────────
    // Difficulty is determined by which times-table is used (see pickFactor).
    case 'mul': {
      const maxF = year === 3 ? 5 : Math.min(12, Math.floor(Math.sqrt(max)));
      const fa   = pickFactor(year, difficulty);
      const fbMax = Math.min(maxF, Math.floor((max - 1) / fa));
      const fb   = fbMax >= 1 ? randInt(1, fbMax) : 1;
      // Randomly swap factors so the "hard" one isn't always on the left
      [a, b] = Math.random() < 0.5 ? [fa, fb] : [fb, fa];
      answer = a * b;
      break;
    }

    // ── Division ──────────────────────────────────────────────
    // Difficulty determined by the divisor (same pools as multiplication).
    case 'div': {
      b = pickFactor(year, difficulty);              // divisor
      const maxQ = Math.floor((max - 1) / b);
      const q    = maxQ >= 1 ? randInt(1, maxQ) : 1;
      a      = b * q;                               // dividend — always exactly divisible
      answer = q;
      break;
    }

    default:
      throw new Error('Unknown operation: ' + op);
  }

  return { a, b, op, answer, text: `${a} ${OP_SYMBOLS[op]} ${b} = ?`, key: `${a}${op}${b}` };
}

// ============================================================
// SESSION
// ============================================================

class MathSession {
  // prebuilt: array of question objects (review mode — skips generation)
  // difficulty: 'easy' | 'medium' | 'hard' | 'talent' (only used for generated sessions)
  constructor(year, op, count = 10, prebuilt = null, difficulty = 'medium') {
    this.year       = year;
    this.op         = op;
    this.difficulty = difficulty;
    this.questions  = [];
    this.current    = 0;
    this.answers    = [];
    this._usedKeys  = new Set();

    if (prebuilt && prebuilt.length > 0) {
      this.questions = prebuilt;
      this.count     = prebuilt.length;
    } else {
      this.count = count;
      this._build();
    }
  }

  _build() {
    const ops = this.op === 'mixed' ? YEAR_CONFIG[this.year].ops : [this.op];
    let attempts = 0;
    while (this.questions.length < this.count && attempts < 300) {
      const op = randFrom(ops);
      const q  = generateQuestion(this.year, op, this.difficulty);
      if (!this._usedKeys.has(q.key)) {
        this._usedKeys.add(q.key);
        this.questions.push(q);
      }
      attempts++;
    }
    // Fall back to allow repeats if we can't fill all unique slots (very rare)
    while (this.questions.length < this.count) {
      const op = randFrom(ops);
      this.questions.push(generateQuestion(this.year, op, this.difficulty));
    }
  }

  get currentQuestion() { return this.questions[this.current] || null; }
  get isFinished()      { return this.current >= this.count; }

  submitAnswer(given) {
    const q = this.currentQuestion;
    if (!q) return null;
    const correct = Number(given) === q.answer;
    const result = { correct, given: Number(given), expected: q.answer, question: q };
    this.answers.push(result);
    this.current++;
    return result;
  }

  get score()      { return this.answers.filter(a => a.correct).length; }
  get percentage() { return this.answers.length ? Math.round((this.score / this.answers.length) * 100) : 0; }
  get stars()      { const p = this.percentage; return p >= 80 ? 3 : p >= 50 ? 2 : 1; }
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================

class CountdownTimer {
  constructor(seconds, onTick, onExpire) {
    this.total     = seconds;
    this.remaining = seconds;
    this.onTick    = onTick;
    this.onExpire  = onExpire;
    this._id       = null;
  }

  start() {
    this.stop();
    this._id = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) { this.stop(); this.onExpire(); }
    }, 1000);
  }

  stop()  { clearInterval(this._id); this._id = null; }
  reset() { this.stop(); this.remaining = this.total; this.onTick(this.remaining); }
}

// ============================================================
// ACCOUNTS
// ============================================================

const AVATAR_COLORS = ['#FF6B35','#26de81','#45AAF2','#a55eea','#FF9F43','#FC5C65','#10AC84','#0652DD'];
const AVATAR_ICONS = ['🦊', '🐶', '🐱', '🦄', '🐼', '🐸', '🐯', '🐨', '🐵', '🐰', '🦁', '🐻'];

const Accounts = {
  _key: 'mathapp_accounts',

  getAll() {
    try {
      const v = localStorage.getItem(this._key);
      return v ? JSON.parse(v).map((acct, i) => ({
        ...acct,
        color: acct.color || AVATAR_COLORS[i % AVATAR_COLORS.length],
        avatar: acct.avatar || AVATAR_ICONS[i % AVATAR_ICONS.length]
      })) : [];
    }
    catch { return []; }
  },

  _save(list) { localStorage.setItem(this._key, JSON.stringify(list)); },

  // Find account by name (case-insensitive)
  find(name) {
    return this.getAll().find(a => a.name.toLowerCase() === (name || '').toLowerCase()) || null;
  },

  // Returns true if name already exists
  exists(name) { return !!this.find(name); },

  create(name, age, avatar = null) {
    const list  = this.getAll();
    const color = AVATAR_COLORS[list.length % AVATAR_COLORS.length];
    const icon  = avatar || AVATAR_ICONS[list.length % AVATAR_ICONS.length];
    const acct  = { name: name.trim(), age: Number(age), color, avatar: icon, createdAt: new Date().toISOString() };
    list.push(acct);
    this._save(list);
    return acct;
  },

  update(name, updates) {
    const list = this.getAll();
    const idx = list.findIndex(a => a.name.toLowerCase() === (name || '').toLowerCase());
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this._save(list);
    return list[idx];
  },

  remove(name) {
    this._save(this.getAll().filter(a => a.name.toLowerCase() !== name.toLowerCase()));
    // Wipe all data stored under this user's namespace
    const prefix = `mathapp_u_${name.toLowerCase()}_`;
    Object.keys(localStorage).filter(k => k.startsWith(prefix)).forEach(k => localStorage.removeItem(k));
  },

  login(name)   { localStorage.setItem('mathapp_session', name); },
  logout()      { localStorage.removeItem('mathapp_session'); },
  currentUser() { return localStorage.getItem('mathapp_session') || null; },
  currentAccount() { return this.find(this.currentUser()); },
  isLoggedIn()  { return !!this.currentUser(); }
};

function requireLogin() {
  if (!Accounts.isLoggedIn()) {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

// ============================================================
// SETTINGS  (per-user, namespaced)
// ============================================================

const Settings = {
  _defaults: {
    practiceCount: 10,
    testCount:     10,
    timerSeconds:  60,
    soundEnabled:  true,
    difficulty:    'medium'
  },
  _k(key) {
    const u = Accounts.currentUser();
    return u ? `mathapp_u_${u.toLowerCase()}_cfg_${key}` : `mathapp_cfg_${key}`;
  },
  get(key) {
    const v = localStorage.getItem(this._k(key));
    return v !== null ? JSON.parse(v) : this._defaults[key];
  },
  set(key, value) { localStorage.setItem(this._k(key), JSON.stringify(value)); }
};

// ============================================================
// LOCAL STORAGE  (per-user, namespaced)
// ============================================================

const Storage = {
  _k(key) {
    const u = Accounts.currentUser();
    return u ? `mathapp_u_${u.toLowerCase()}_${key}` : `mathapp_${key}`;
  },
  getPlayerName() {
    return Accounts.currentUser() || localStorage.getItem('mathapp_player_name') || '';
  },
  setPlayerName(name) {
    // Logged-in players use their account name; guests persist a lightweight local name.
    if (Accounts.currentUser()) return;
    if (name) localStorage.setItem('mathapp_player_name', name);
    else localStorage.removeItem('mathapp_player_name');
  },

  getBestScore(year, mode) {
    const v = localStorage.getItem(this._k(`best_${year}_${mode}`));
    if (v === null) return null;
    try {
      const parsed = JSON.parse(v);
      if (parsed && typeof parsed === 'object' && Number.isFinite(parsed.pct)) {
        return parsed;
      }
    } catch (_) {}
    const legacyScore = Number(v);
    if (!Number.isFinite(legacyScore)) return null;
    return { score: legacyScore, total: 10, pct: Math.round((legacyScore / 10) * 100) };
  },
  setBestScore(year, mode, score, total = 10) {
    const key     = this._k(`best_${year}_${mode}`);
    const current = this.getBestScore(year, mode);
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const next = { score, total, pct };
    if (current === null || pct > current.pct || (pct === current.pct && score > current.score)) {
      localStorage.setItem(key, JSON.stringify(next));
      return true;
    }
    return false;
  },
  // Wrong questions (review feature)
  setWrongQuestions(q) { localStorage.setItem(this._k('review'), JSON.stringify(q)); },
  getWrongQuestions()  { try { const v = localStorage.getItem(this._k('review')); return v ? JSON.parse(v) : []; } catch { return []; } },
  clearWrongQuestions(){ localStorage.removeItem(this._k('review')); },
  // Test history — newest first, capped at 200
  saveTestResult(result) {
    const h = this.getTestHistory();
    h.unshift(result);
    if (h.length > 200) h.length = 200;
    try { localStorage.setItem(this._k('history'), JSON.stringify(h)); } catch (_) {}
  },
  getTestHistory() {
    try { const v = localStorage.getItem(this._k('history')); return v ? JSON.parse(v) : []; }
    catch { return []; }
  },
  clearTestHistory() { localStorage.removeItem(this._k('history')); },
  saveActivity(entry) {
    const h = this.getActivityHistory();
    h.unshift(entry);
    if (h.length > 400) h.length = 400;
    try { localStorage.setItem(this._k('activity_history'), JSON.stringify(h)); } catch (_) {}
  },
  getActivityHistory() {
    try { const v = localStorage.getItem(this._k('activity_history')); return v ? JSON.parse(v) : []; }
    catch { return []; }
  },
  clearActivityHistory() { localStorage.removeItem(this._k('activity_history')); }
};

// ============================================================
// URL HELPERS
// ============================================================

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    year:  p.has('year')  ? Number(p.get('year'))  : null,
    op:    p.get('op')    || null,
    score: p.has('score') ? Number(p.get('score')) : null,
    total: p.has('total') ? Number(p.get('total')) : null,
    mode:  p.get('mode')  || null,
    stars: p.has('stars') ? Number(p.get('stars')) : null,
    best:  p.has('best')  ? Number(p.get('best'))  : 0,
    time:  p.has('time')  ? Number(p.get('time'))  : null,
    resultId: p.has('resultId') ? Number(p.get('resultId')) : null,
  };
}

function buildURL(page, params) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) p.set(k, String(v));
  }
  const qs = p.toString();
  return qs ? `${page}?${qs}` : page;
}

// ============================================================
// AUDIO  (Web Audio API — silent if not supported)
// ============================================================

let _audioCtx = null;

function _ctx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function _tone(freq, dur, type = 'sine', vol = 0.28) {
  try {
    const ctx  = _ctx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (_) { /* audio unavailable */ }
}

function playSound(type) {
  if (!Settings.get('soundEnabled')) return;
  switch (type) {
    case 'correct':
      _tone(523, 0.10); setTimeout(() => _tone(659, 0.10), 100); setTimeout(() => _tone(784, 0.20), 200);
      break;
    case 'wrong':
      _tone(200, 0.30, 'sawtooth', 0.18);
      break;
    case 'complete':
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => _tone(f, 0.18), i * 120));
      break;
    case 'tick':
      _tone(900, 0.05, 'square', 0.08);
      break;
    case 'numpad':
      _tone(440, 0.05, 'sine', 0.12);
      break;
  }
}

// ============================================================
// ANALYTICS HELPERS
// ============================================================

// Break session answers down by operation: { add: {correct,total}, ... }
function computeOpBreakdown(answers) {
  const b = {};
  for (const a of answers) {
    const op = a.question.op;
    if (!b[op]) b[op] = { correct: 0, total: 0 };
    b[op].total++;
    if (a.correct) b[op].correct++;
  }
  return b;
}

// Aggregate across the full history array and return summary analytics.
function computeHistoryAnalytics(history) {
  if (!history.length) return null;
  const ops = {};
  let scoreSum = 0, bestPct = 0, timeSum = 0, timeCount = 0;

  for (const t of history) {
    scoreSum += t.pct;
    bestPct = Math.max(bestPct, t.pct);
    if (t.timeTaken > 0) { timeSum += t.timeTaken; timeCount++; }
    for (const [op, data] of Object.entries(t.opBreakdown || {})) {
      if (!ops[op]) ops[op] = { correct: 0, total: 0 };
      ops[op].correct += data.correct;
      ops[op].total   += data.total;
    }
  }

  const opAccuracy = {};
  for (const [op, { correct, total }] of Object.entries(ops)) {
    if (total > 0) opAccuracy[op] = { pct: Math.round(correct / total * 100), correct, total };
  }

  // Only rank operations that have at least 2 attempts so stats are meaningful
  const ranked = Object.entries(opAccuracy)
    .filter(([, d]) => d.total >= 2)
    .sort(([, a], [, b]) => b.pct - a.pct);

  return {
    totalTests: history.length,
    avgPct:     Math.round(scoreSum / history.length),
    bestPct,
    avgTime:    timeCount > 0 ? Math.round(timeSum / timeCount) : null,
    opAccuracy,
    strongest:  ranked[0]                    || null,  // [op, {pct,correct,total}]
    weakest:    ranked[ranked.length - 1]    || null
  };
}

function filterActivityByDays(activity, days) {
  if (!days) return activity;
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  return activity.filter(item => {
    const time = Date.parse(item.date || '');
    return Number.isFinite(time) && time >= cutoff;
  });
}

function localDateKey(dateLike) {
  const d = new Date(dateLike);
  if (!Number.isFinite(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildActivityChartData(activity, days = 14, type = 'both') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let resolvedDays = days;
  if (!resolvedDays) {
    const dated = activity
      .map(item => Date.parse(item.date || ''))
      .filter(time => Number.isFinite(time))
      .sort((a, b) => a - b);
    if (!dated.length) return [];
    const oldest = new Date(dated[0]);
    oldest.setHours(0, 0, 0, 0);
    resolvedDays = Math.max(1, Math.round((today - oldest) / (24 * 60 * 60 * 1000)) + 1);
  }
  const buckets = [];
  for (let i = resolvedDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.push({
      key: localDateKey(d),
      label: d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' }),
      practice: 0,
      test: 0,
      total: 0
    });
  }
  const byKey = Object.fromEntries(buckets.map(b => [b.key, b]));
  for (const item of activity) {
    const key = localDateKey(item.date);
    const bucket = byKey[key];
    if (!bucket) continue;
    if (item.kind === 'test') bucket.test++;
    else bucket.practice++;
    if (type === 'practice') bucket.total = bucket.practice;
    else if (type === 'test') bucket.total = bucket.test;
    else bucket.total = bucket.practice + bucket.test;
  }
  return buckets;
}

function formatTime(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (_) { return iso; }
}

// ============================================================
// CONFETTI  (canvas-based, used on results.html)
// ============================================================

function launchConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FF6B35','#26de81','#45AAF2','#a55eea','#FFD700','#FC5C65','#FFA07A','#10AC84'];
  const particles = Array.from({ length: 130 }, () => ({
    x:        Math.random() * canvas.width,
    y:        Math.random() * -canvas.height * 0.5,
    w:        randInt(8, 16),
    h:        randInt(4, 10),
    color:    randFrom(colors),
    rot:      Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.18,
    vx:       (Math.random() - 0.5) * 4,
    vy:       randInt(2, 6),
    alpha:    1
  }));

  let frame;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height * 0.75) p.alpha -= 0.018;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    if (alive) frame = requestAnimationFrame(draw);
  })();
}
