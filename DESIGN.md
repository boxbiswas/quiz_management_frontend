# Design System — "Warm Glass" (v2)
Light, warm, professional theme with glassmorphism and soft 3D depth. Built for React + Tailwind CSS.

> **v2 changelog:** The first pass (see screenshot A) read as a generic bootstrap-style form — visible hard borders on the card and inputs, square-ish button, icon-cluttered fields, tight spacing. v2 tightens the spec so every page lands closer to screenshot B: borderless elevated cards, tinted borderless inputs, pill buttons, generous whitespace, editorial type. Section 4, 6, and the new Section 10 ("Anti-Patterns") are the load-bearing changes — read those first.

---

## 1. Design Philosophy

Warm neutrals instead of stark white. Depth comes from layered translucency, soft shadow, and generous negative space — **never from visible borders**. Every surface feels like frosted glass floating a few millimeters above the one behind it. Accent color is used sparingly, as a signal (active state, primary action, focus) rather than decoration.

The single biggest tell between "AI-generated form" and "professional product" is whether elevation comes from a **border** (cheap, flat, default-HTML-feeling) or from **shadow + subtle tint** (soft, floating, expensive-feeling). This system defaults to shadow-based elevation everywhere. Borders are the exception, not the rule.

---

## 2. Color Tokens

| Token | Hex | Use |
|---|---|---|
| `warm-50` | `#FBF8F3` | App background |
| `warm-100` | `#F3EDE3` | Section background / glass tint base |
| `warm-200` | `#E8DFCF` | Dividers only — not card borders |
| `warm-300` | `#D8C9AE` | Muted borders, disabled states |
| `ink-900` | `#2B2622` | Primary text |
| `ink-700` | `#5B534A` | Secondary text |
| `ink-500` | `#8A8074` | Tertiary text, placeholders, eyebrow labels |
| `amber-500` | `#C8842A` | Primary accent (buttons, links, focus) |
| `amber-600` | `#A96B1E` | Accent hover/active |
| `amber-100` | `#F3E2C4` | Accent tint (badges, highlights) |
| `amber-50` | `#FBF0DE` | Input fill tint |
| `sage-500` | `#7A8B6F` | Success / positive |
| `clay-500` | `#B5654A` | Warning / destructive-adjacent |
| `rose-500` | `#C0605E` | Error |
| `glass-white` | `rgba(255,255,255,0.55)` | Glass surface fill |
| `glass-border` | `rgba(255,255,255,0.65)` | Glass edge highlight |

### Tailwind config

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: { 50: '#FBF8F3', 100: '#F3EDE3', 200: '#E8DFCF', 300: '#D8C9AE' },
        ink: { 900: '#2B2622', 700: '#5B534A', 500: '#8A8074' },
        amber: { 50: '#FBF0DE', 100: '#F3E2C4', 500: '#C8842A', 600: '#A96B1E' },
        sage: { 500: '#7A8B6F' },
        clay: { 500: '#B5654A' },
        rose: { 500: '#C0605E' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backdropBlur: { xs: '2px', glass: '16px' },
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(43,38,34,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
        'glass-md': '0 8px 24px rgba(43,38,34,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg': '0 20px 48px rgba(43,38,34,0.14), inset 0 1px 0 rgba(255,255,255,0.6)',
        'card': '0 1px 2px rgba(43,38,34,0.04), 0 12px 32px -8px rgba(43,38,34,0.12)',
        'card-hover': '0 4px 10px rgba(43,38,34,0.08), 0 20px 40px -10px rgba(43,38,34,0.16)',
        'raised': '0 1px 2px rgba(43,38,34,0.08), 0 4px 12px rgba(43,38,34,0.06)',
        'raised-hover': '0 4px 10px rgba(43,38,34,0.12), 0 10px 24px rgba(43,38,34,0.10)',
        'pressed': 'inset 0 2px 4px rgba(43,38,34,0.12)',
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
    },
  },
}
```

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

---

## 3. Typography

| Role | Family | Weight | Tailwind classes |
|---|---|---|---|
| Eyebrow / kicker | IBM Plex Mono | 500 | `font-mono text-xs uppercase tracking-[0.15em] text-ink-500` |
| Display / H1 | Fraunces | 600 | `font-display font-semibold text-3xl md:text-4xl tracking-tight text-ink-900` |
| H2 | Fraunces | 500 | `font-display font-medium text-2xl text-ink-900` |
| H3 | Inter | 600 | `font-body font-semibold text-lg text-ink-900` |
| Body | Inter | 400 | `font-body text-base text-ink-700 leading-relaxed` |
| Field label | IBM Plex Mono | 500 | `font-mono text-[11px] uppercase tracking-wider text-ink-500` |

**Editorial pairing rule:** any card that represents a "moment" (auth, empty state, confirmation, onboarding step) gets an **eyebrow + Fraunces heading** pair, not just a heading alone. This one addition does more for perceived polish than any color or shadow change — see Section 10.

Fraunces gives warmth and a professional-editorial feel for headings; Inter keeps body copy clean and legible; Plex Mono adds a technical accent for labels, metadata, and numbers.

---

## 4. Glass Effect Utilities

Base glass card:

```jsx
<div className="
  bg-white/55 backdrop-blur-glass backdrop-saturate-150
  rounded-xl2 shadow-glass-md
">
  {/* content */}
</div>
```

Layered glass (modals / floating panels):

```jsx
<div className="
  bg-white/65 backdrop-blur-2xl backdrop-saturate-150
  rounded-xl2 shadow-glass-lg
">
  {/* content */}
</div>
```

**Rules of thumb:**
- Always pair `backdrop-blur` with a semi-transparent background — blur alone does nothing on an opaque fill.
- Add `backdrop-saturate-150` so colors behind the glass stay vivid instead of washing out.
- **Do not add a visible `border` to sell the glass edge.** Use shadow's `inset 0 1px 0 rgba(255,255,255,0.6)` (already baked into `shadow-glass-*`) for the light-catching edge instead. A real `border` reads as a UI outline, not a glass rim, and is the #1 cause of the "cheap form" look.
- If an edge genuinely needs definition (e.g. an input on a busy background), use `ring-1 ring-black/[0.04]` — a near-invisible 4% black ring — never `border-warm-200` at full opacity on a foreground card.
- Never stack more than 2 levels of glass. Deepest layer = solid `warm-50` background, then one glass layer, then optionally one small glass element (badge/tooltip) on top.

---

## 5. 3D / Elevation System

Depth is expressed through **shadow + subtle scale**, not rotation, skew, or borders.

| Level | Use case | Classes |
|---|---|---|
| 0 — Flat | Page background, static sections | `shadow-none` |
| 1 — Raised | List items, inline cards | `shadow-raised` |
| 2 — Floating card | Auth cards, feature cards, modals-lite | `shadow-card` |
| 3 — Hover | Interactive card on hover | `hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200` |
| 4 — Glass float | Dropdowns, popovers, toasts | `shadow-glass-lg` |
| Pressed | Active/clicked buttons | `active:shadow-pressed active:translate-y-0` |

Example interactive card:

```jsx
<div className="
  bg-warm-50 rounded-xl2
  shadow-card hover:shadow-card-hover hover:-translate-y-0.5
  transition-all duration-200 ease-out
  p-6
">
  <h3 className="font-body font-semibold text-ink-900">Card title</h3>
  <p className="font-body text-sm text-ink-700 mt-1">Supporting text.</p>
</div>
```

Optional hero tilt-on-hover (use on at most one element per page):

```jsx
<div
  className="transition-transform duration-300 ease-out will-change-transform"
  style={{ transformStyle: 'preserve-3d' }}
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - r.top - r.height / 2) / 14;
    const y = (e.clientX - r.left - r.width / 2) / -14;
    e.currentTarget.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`;
  }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'; }}
>
  {/* hero card content */}
</div>
```

---

## 6. Core Components

### Primary button — pill, not box
Full rounding, no border, no icon by default. Flat until hover, then lifts.

```jsx
<button className="
  bg-amber-500 hover:bg-amber-600 active:scale-[0.98]
  text-white font-body font-medium text-sm
  px-6 py-3.5 rounded-full
  shadow-none hover:shadow-raised-hover
  transition-all duration-150
">
  Sign in
</button>
```

### Secondary (glass) button
```jsx
<button className="
  bg-white/50 backdrop-blur-glass hover:bg-white/70
  text-ink-900 font-body font-medium text-sm
  px-6 py-3.5 rounded-full
  shadow-glass-sm transition-all duration-150
">
  Cancel
</button>
```

### Input field — tinted, borderless
Fill with a faint warm/amber tint instead of white+gray-border. No leading icons unless the icon is load-bearing (e.g. a search field) — decorative mail/lock icons are what make forms look templated.

```jsx
<div className="space-y-1.5">
  <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
    Email
  </label>
  <input
    type="email"
    className="
      w-full bg-amber-50/60
      rounded-xl px-4 py-3.5
      font-body text-sm text-ink-900 placeholder:text-ink-500
      outline-none ring-1 ring-black/[0.03]
      focus:ring-2 focus:ring-amber-500/40 focus:bg-white
      transition-all duration-150
    "
    placeholder="you@example.com"
  />
</div>
```

### Badge / pill
```jsx
<span className="
  inline-flex items-center gap-1.5
  bg-amber-100 text-amber-600
  font-mono text-xs uppercase tracking-wider
  px-2.5 py-1 rounded-full
">
  Active
</span>
```

### Header Navigation (Sticky)
App Name: **QuizVerse**

```jsx
<header className="
  sticky top-0 z-50
  bg-warm-50/80 backdrop-blur-glass backdrop-saturate-150
">
  <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-display font-semibold text-lg shadow-raised">
        Q
      </div>
      <span className="font-display font-semibold text-xl text-ink-900 tracking-tight">
        QuizVerse
      </span>
    </div>

    <nav className="hidden md:flex items-center gap-1">
      <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-warm-100/50 transition-colors">
        Dashboard
      </a>
      <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-ink-900 bg-warm-200/50 transition-colors">
        Quizzes
      </a>
      <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-warm-100/50 transition-colors">
        History
      </a>
      <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-warm-100/50 transition-colors">
        Leaderboard
      </a>
    </nav>

    <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xs rounded-full py-1 pr-4 pl-1.5 shadow-glass-sm hover:shadow-raised-hover hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-medium text-sm">
        I
      </div>
      <span className="text-sm font-medium text-ink-700">{'{ logged-in user name }'}</span>
    </div>

  </div>
</header>
```

---

## 7. Layout & Spacing

- Base spacing unit: `4px` (Tailwind default scale).
- Section padding: `py-16 md:py-24 px-6 md:px-12`.
- Max content width: `max-w-6xl mx-auto`.
- Card radius: `rounded-xl2` (20px) default, `rounded-xl3` (28px) for hero/auth cards; `rounded-full` for buttons/pills; `rounded-xl` (12px) for inputs.
- Card padding: never below `p-8` for a standalone card (auth, empty state). Cramped padding is the second biggest "cheap form" signal after borders.
- Background: faint warm radial gradient behind glass sections for depth:

```jsx
<div className="min-h-screen bg-warm-50 bg-[radial-gradient(circle_at_20%_-10%,rgba(200,132,42,0.08),transparent_50%)]">
```

---

## 8. Motion

- Standard transition: `transition-all duration-200 ease-out`.
- Hover lift: `hover:-translate-y-0.5`.
- Press feedback: `active:scale-[0.98]`.
- Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9. Accessibility Notes

- Maintain minimum 4.5:1 contrast for body text (`ink-900` / `ink-700` on `warm-50` both pass).
- Always add a visible focus ring: `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-50`.
- Because inputs no longer have a resting border, focus and hover states must be unmistakable — always pair the tint fill with a `ring-2 ring-amber-500/40` (or stronger) on focus.
- Glass surfaces reduce contrast — never place body text smaller than 14px directly on a glass background without a solid inner panel.

---

## 10. Reference Pattern: Auth / Form Card

This is the canonical shape every login, signup, and single-form page should follow. It's what separates screenshot B from screenshot A.

```jsx
<div className="min-h-screen bg-warm-50 bg-[radial-gradient(circle_at_20%_-10%,rgba(200,132,42,0.08),transparent_50%)] flex items-center justify-center px-6">
  <div className="w-full max-w-md bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl3 shadow-glass-lg p-10">

    <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-500 mb-2">
      QuizVerse Access
    </p>
    <h1 className="font-display font-semibold text-3xl text-ink-900 tracking-tight mb-8">
      Welcome back
    </h1>

    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Email</label>
        <input
          type="email"
          className="w-full bg-amber-50/60 rounded-xl px-4 py-3.5 font-body text-sm text-ink-900 placeholder:text-ink-500 outline-none ring-1 ring-black/[0.03] focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all duration-150"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Password</label>
        <input
          type="password"
          className="w-full bg-amber-50/60 rounded-xl px-4 py-3.5 font-body text-sm text-ink-900 outline-none ring-1 ring-black/[0.03] focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all duration-150"
        />
      </div>

      <button className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm py-3.5 rounded-full transition-all duration-150 mt-2">
        Sign in
      </button>

      <div className="flex items-center justify-between text-sm pt-1">
        <a href="#" className="text-ink-500 hover:text-ink-700 transition-colors">Forgot password?</a>
        <a href="#" className="text-amber-500 hover:text-amber-600 font-medium transition-colors">Create an account</a>
      </div>
    </div>

  </div>
</div>
```

Notes on why this works:
- Card has **zero border** — elevation is entirely `shadow-glass-lg` against the radial-gradient background.
- Eyebrow + serif heading replaces a generic "Welcome Back" body-font heading — instantly more editorial.
- Inputs are tinted fills (`amber-50/60`), not white boxes with gray outlines — they read as part of the card, not stamped-on form controls.
- Button is a full pill, `w-full`, no icon, no heavy shadow at rest — restraint reads as confidence.
- Links replace a plain button/footer row — lighter footprint, clear hierarchy (secondary link left, primary link right in accent color).

---

## 11. Anti-Patterns — Do Not Do These

Check every generated screen against this list before shipping it:

- ❌ `border border-warm-200` (or any visible border) on a card, modal, or input at rest. → Use `shadow-card` / `shadow-glass-md` and, if edge definition is truly needed, `ring-1 ring-black/[0.03]`.
- ❌ Square or barely-rounded (`rounded-lg`) primary CTA buttons. → `rounded-full` pills for primary actions.
- ❌ Decorative leading icons in every input (mail icon, lock icon) "because it looks like a form." → Only add an icon when it's functional (search, currency prefix).
- ❌ White (`bg-white`) input fields with a gray border. → Tinted fill (`bg-amber-50/60` or `bg-warm-100/60`), borderless, ring-on-focus only.
- ❌ Card padding under `p-8` on standalone/hero cards. → Generous padding (`p-8` to `p-12`) is part of the "premium" signal.
- ❌ A plain sans-serif heading with no eyebrow label on auth/empty-state/onboarding screens. → Pair `font-mono uppercase` eyebrow + `font-display` serif heading.
- ❌ Heavy resting shadow on buttons (`shadow-raised` at rest). → Flat at rest, shadow appears on hover only, for a lighter feel.
- ❌ More than one accent color competing for attention on a single screen (e.g. orange button + orange link + orange badge all at once with no hierarchy). → Reserve full-saturation `amber-500` for the single primary action; use `amber-600`/text-links for secondary emphasis.