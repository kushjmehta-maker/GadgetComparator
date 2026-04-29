# AI GADGET ADVISOR — UX/UI DESIGN SPECIFICATION

## 1. DESIGN PRINCIPLES

1. **Decision-first:** Every screen exists to move the user toward a purchase decision
2. **Progressive disclosure:** Show the answer first, details on demand
3. **Trust through transparency:** Show how scores are calculated, not just the result
4. **Speed over completeness:** Fast partial results beat slow perfect results
5. **Mobile-first:** 70%+ of Indian users browse on mobile

---

## 2. DESIGN SYSTEM

### Color Palette
```
Primary:       #6366F1 (Indigo-500) — Trust, intelligence
Primary Dark:  #4338CA (Indigo-700) — Headers, emphasis
Secondary:     #10B981 (Emerald-500) — Best pick, positive scores
Warning:       #F59E0B (Amber-500) — Caution flags, inflated specs
Danger:        #EF4444 (Red-500) — Dealbreakers, fails constraints
Background:    #F8FAFC (Slate-50) — Clean, minimal
Surface:       #FFFFFF — Cards
Text Primary:  #0F172A (Slate-900)
Text Secondary: #64748B (Slate-500)
```

### Typography
```
Headings: Inter (700) — Clean, modern, great on screens
Body: Inter (400/500)
Mono: JetBrains Mono — For spec values, scores
```

### Spacing & Layout
- Max content width: 1200px
- Card border radius: 12px
- Standard padding: 16px mobile, 24px desktop
- Section spacing: 48px

---

## 3. PAGE FLOW

```
Landing Page → Chat Input → Loading (Streaming) → Results Page → Product Detail
     │                                                    │
     │                                                    ├→ Share Comparison
     │                                                    ├→ Modify Query
     │                                                    └→ Affiliate Click
     │
     └→ Browse Categories → Category Page → Discovery Mode
```

---

## 4. PAGE SPECIFICATIONS

### 4.1 Landing Page

**Purpose:** Explain the product in 5 seconds, get user to first query in 15 seconds.

**Layout:**
```
┌─────────────────────────────────────┐
│  Logo    [Browse] [How it Works]    │  ← Minimal nav
├─────────────────────────────────────┤
│                                     │
│  "Find your perfect gadget          │
│   in 30 seconds"                    │  ← Headline
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔍 "Best projector under    │    │  ← Chat input (prominent)
│  │     ₹20K for Netflix..."    │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Projectors] [Phones] [Watches]    │  ← Quick category pills
│  [Laptops] [Earbuds] [More]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Example queries:                   │
│  • "Compare OnePlus 13 vs S25"     │
│  • "Best smartwatch for running"   │
│  • "Gaming laptop under ₹80K"     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  How it works:                      │
│  1. Tell us what you need           │
│  2. AI analyzes 1000s of products   │
│  3. Get your perfect match          │
│                                     │
├─────────────────────────────────────┤
│  Recent comparisons (social proof)  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │comp│ │comp│ │comp│ │comp│      │
│  └────┘ └────┘ └────┘ └────┘      │
└─────────────────────────────────────┘
```

**Key Interactions:**
- Chat input is autofocused on page load (desktop)
- Category pills pre-fill the input with "Best {category} for..."
- Example queries are clickable → immediately trigger search
- Enter key or click submits the query

### 4.2 Chat / Query Input

**Two modes of input:**

**Mode A (Compare):** User enters product names/URLs
```
┌─────────────────────────────────────┐
│ Compare Products                     │
│                                     │
│ ┌─────────────────────────────┐     │
│ │ + Add product name or URL   │     │
│ └─────────────────────────────┘     │
│                                     │
│ Product 1: EGate Duster 5X Pro  ✕  │
│ Product 2: Wzatco Yuva GO       ✕  │
│ Product 3: Crossbeats Lumex     ✕  │
│                                     │
│  "What matters most to you?"        │
│  ┌─────────────────────────────┐    │
│  │ Netflix in bedroom, budget   │    │
│  │ isn't the main concern...   │    │
│  └─────────────────────────────┘    │
│                                     │
│         [Compare Now →]             │
└─────────────────────────────────────┘
```

**Mode B (Discover):** Conversational input
```
┌─────────────────────────────────────┐
│                                     │
│ ┌─────────────────────────────┐     │
│ │ Best projector under ₹20K   │     │
│ │ for Netflix in my bedroom.  │     │
│ │ Need auto-focus and good    │     │
│ │ speakers.                   │     │
│ └─────────────────────────────┘     │
│                                     │
│         [Find Products →]           │
│                                     │
│  Or try: [Compare specific models]  │
└─────────────────────────────────────┘
```

**Optional Guided Input** (for users who don't know what to type):
```
┌─────────────────────────────────────┐
│ Let's find your perfect projector   │
│                                     │
│ Budget:                             │
│ [Under ₹10K] [₹10-20K] [₹20-30K] │
│ [₹30-50K] [₹50K+] [Flexible]      │
│                                     │
│ Primary use:                        │
│ [Movies/Netflix] [Gaming]           │
│ [Presentations] [Outdoor]           │
│                                     │
│ Room size:                          │
│ [Small bedroom] [Living room]       │
│ [Office/Conference] [Outdoor]       │
│                                     │
│ Must-haves: (select all that apply) │
│ [Auto-focus] [Netflix certified]    │
│ [Good speakers] [Portable]          │
│ [4K] [Low noise]                    │
│                                     │
│         [Find Best Match →]         │
└─────────────────────────────────────┘
```

### 4.3 Loading / Streaming State

**Purpose:** Keep user engaged while AI processes (3-8 seconds)

```
┌─────────────────────────────────────┐
│                                     │
│  Understanding your needs...   ✓    │
│  ├─ Category: Projectors            │
│  ├─ Budget: ₹10,000 – ₹20,000     │
│  └─ Use: Netflix, Bedroom           │
│                                     │
│  Analyzing 47 projectors...   ⟳    │
│  ├─ Checking specs ████████░░ 80%   │
│  └─ Verifying claims...             │
│                                     │
│  Scoring & ranking...         ○     │
│  Generating explanation...    ○     │
│                                     │
└─────────────────────────────────────┘
```

- Each step appears progressively via SSE
- Checkmarks appear as steps complete
- Parsed intent is shown so user can verify understanding
- Total target time: under 8 seconds

### 4.4 Results Page

**The most critical page.** This is where the decision happens.

```
┌─────────────────────────────────────┐
│ ← Back    "Projector under ₹20K"   │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏆 BEST FOR YOU                 │ │
│ │                                 │ │
│ │ ┌─────┐  Crossbeats Lumex Flix │ │
│ │ │ img │  ₹13,799              │ │
│ │ └─────┘  Score: 92/100        │ │
│ │                                 │ │
│ │ "Best overall for Netflix in   │ │
│ │  a bedroom. 1080p with         │ │
│ │  certified streaming, auto-    │ │
│ │  focus, and 10W speakers at    │ │
│ │  a mid-range price."          │ │
│ │                                 │ │
│ │ [Buy on Amazon →] [Flipkart →]│ │
│ └─────────────────────────────────┘ │
│                                     │
├── FULL RANKING ─────────────────────┤
│                                     │
│ #1 Crossbeats Lumex Flix    92/100  │
│    ₹13,799  ████████████████████░  │
│    ✅ Netflix ✅ Auto-focus ✅ 10W  │
│                                     │
│ #2 Wzatco Yuva Vibe         87/100  │
│    ₹13,790  ███████████████████░░  │
│    ✅ Netflix ✅ Full Auto  ⚠️ 5W   │
│                                     │
│ #3 EGate Duster 5X Pro      84/100  │
│    ₹25,000  ████████████████░░░░  │
│    ✅ Netflix ✅ Best build ⚠️ Over │
│    budget                           │
│                                     │
│ #4 Wzatco Yuva GO           61/100  │
│    ₹8,000   ████████████░░░░░░░░  │
│    ❌ 720p  ❌ No Netflix  ⚠️ Buggy│
│                                     │
├── DETAILED COMPARISON ──────────────┤
│                                     │
│ ┌──────────┬──────┬──────┬──────┐  │
│ │ Feature  │ #1   │ #2   │ #3   │  │
│ ├──────────┼──────┼──────┼──────┤  │
│ │ Price    │₹13.8K│₹13.8K│₹25K  │  │
│ │Resolution│1080p │1080p │1080p │  │
│ │Brightness│16Klm*│14Klm*│500ISO│  │
│ │Netflix   │ ✅   │ ✅   │ ✅   │  │
│ │AutoFocus │ Auto │ Full │ Full │  │
│ │Speakers  │ 10W  │ 5W   │ 10W  │  │
│ │WiFi      │ WiFi6│ WiFi6│ WiFi6│  │
│ └──────────┴──────┴──────┴──────┘  │
│                                     │
│ * Claimed lumens — likely inflated  │
│   See verified brightness scores    │
│                                     │
├── WHY THIS RANKING ─────────────────┤
│                                     │
│ "The Crossbeats Lumex Flix edges    │
│  out the Wzatco Yuva Vibe on       │
│  speaker quality (10W vs 5W) —     │
│  important for bedroom Netflix     │
│  without external speakers. Both   │
│  have certified Netflix at nearly  │
│  identical prices. The EGate is    │
│  technically superior but costs    │
│  almost 2x your budget. The Yuva  │
│  GO at ₹8K is tempting but its    │
│  720p resolution and lack of      │
│  Netflix certification make it a   │
│  poor fit for your use case."      │
│                                     │
├── ACTIONS ──────────────────────────┤
│                                     │
│ [Share Comparison] [Modify Query]   │
│ [Set Price Alert] [Save for Later]  │
│                                     │
└─────────────────────────────────────┘
```

### 4.5 Product Detail Page

```
┌─────────────────────────────────────┐
│ ← Back to Results                   │
├─────────────────────────────────────┤
│                                     │
│ ┌────────┐  Crossbeats Lumex Flix  │
│ │        │  ₹13,799               │
│ │  img   │  Score: 92/100         │
│ │        │  ⭐ Best for: Netflix   │
│ └────────┘                         │
│                                     │
│ [Buy on Amazon] [Buy on Flipkart]  │
│                                     │
├── SCORE BREAKDOWN ──────────────────┤
│                                     │
│ Resolution    ████████████████ 0.90 │
│ Netflix       ████████████████ 1.00 │
│ Auto Focus    ██████████████░ 0.70  │
│ Speakers      ████████████████ 0.85 │
│ Price Value   █████████████░░ 0.75  │
│ Brightness    ████████████░░░ 0.65  │
│                                     │
├── FULL SPECIFICATIONS ──────────────┤
│                                     │
│ Resolution:     1080p (Native)      │
│ Brightness:     16,000 lm (claimed) │
│                 ⚠️ Est. 400 ANSI    │
│ Netflix:        ✅ WideVine L1      │
│ Auto Focus:     ✅ Automatic        │
│ Auto Keystone:  ✅                  │
│ Speakers:       10W Built-in        │
│ OS:             WhaleOS / Android 13│
│ WiFi:           WiFi 6              │
│ HDMI:           ✅ HDMI ARC         │
│ Weight:         1.8 kg              │
│ Throw Ratio:    1.2:1               │
│                                     │
├── PRICE HISTORY ────────────────────┤
│                                     │
│  ₹16K ┤                            │
│  ₹15K ┤──╮                         │
│  ₹14K ┤  ╰──────╮                  │
│  ₹13K ┤         ╰───── Current     │
│       └──┬──┬──┬──┬──┬──          │
│        Jan Feb Mar Apr May          │
│                                     │
│  💡 Current price is near all-time │
│     low. Good time to buy.          │
│                                     │
├── SIMILAR PRODUCTS ─────────────────┤
│                                     │
│ ┌────┐ ┌────┐ ┌────┐               │
│ │alt1│ │alt2│ │alt3│               │
│ └────┘ └────┘ └────┘               │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. RESPONSIVE DESIGN

### Breakpoints
```
Mobile:  < 640px  (single column, stacked cards)
Tablet:  640–1024px (two-column comparison table)
Desktop: > 1024px (full layout, side-by-side)
```

### Mobile-Specific Adaptations
- Chat input becomes bottom-sheet on mobile
- Comparison table scrolls horizontally with sticky first column
- Product cards stack vertically
- Score bars remain readable at small sizes
- Affiliate buttons become full-width sticky footer

---

## 6. COMPONENT LIBRARY

### Core Components
```
<ChatInput />           — Main query input with auto-suggestions
<CategoryPills />       — Quick category selection
<StreamingLoader />     — Progressive loading state
<ProductCard />         — Product in ranking list
<HeroRecommendation />  — Top pick spotlight card
<ComparisonTable />     — Side-by-side spec table
<ScoreBar />            — Horizontal score visualization
<SpecRow />             — Individual spec with verification badge
<ExplanationPanel />    — AI-generated reasoning block
<PriceChart />          — Price history line chart
<AffiliateButton />     — Buy button with tracking
<ShareCard />           — Shareable comparison preview
<GuidedInput />         — Step-by-step requirement builder
<FeedbackWidget />      — "Was this helpful?" with rating
```

---

## 7. INTERACTION PATTERNS

### Query Refinement
After seeing results, user can:
- "Show me cheaper options" → re-runs with lower budget
- "What if I don't need Netflix?" → re-runs without constraint
- "Add Epson to the comparison" → adds product to existing set
- Click any feature in the table to learn what it means

### Spec Tooltips
Hovering/tapping a spec value shows:
- What this spec means in plain English
- How it was measured/verified
- Where this product sits relative to the category average
- Why it matters for the user's use case

### Trust Signals
- "Verified" badge on confirmed specs
- "⚠️ Claimed" warning on unverified/inflated specs
- "Based on {N} sources" label
- Confidence score visible in detailed view
- "How we scored this" expandable section

---

## 8. SEO & SHARING

### URL Structure
```
/                                    — Landing page
/compare/projectors/lumex-vs-yuva    — Comparison page (generated slug)
/discover/best-projector-under-20k   — Discovery result page
/product/crossbeats-lumex-flix       — Product detail page
/category/projectors                 — Category browse page
```

### Open Graph Tags (for social sharing)
```html
<meta property="og:title" content="Crossbeats Lumex vs Wzatco Yuva — AI Comparison" />
<meta property="og:description" content="AI scored: Lumex 92/100, Yuva 87/100. Best for Netflix in bedroom." />
<meta property="og:image" content="/api/og?products=lumex,yuva&scores=92,87" />
```

### Auto-Generated OG Image
Dynamic image showing:
- Product names
- Scores
- Winner badge
- Brand logo

---

## 9. ACCESSIBILITY

- All interactive elements keyboard-navigable
- ARIA labels on score visualizations
- Color not used as sole differentiator (icons + text too)
- Contrast ratio ≥ 4.5:1 for all text
- Screen reader friendly comparison tables
- Reduced motion option for animations

---

*Document Version: 1.0*
*Created: April 2026*
