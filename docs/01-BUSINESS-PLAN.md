# AI GADGET ADVISOR — BUSINESS PLAN & STRATEGY

## 1. EXECUTIVE SUMMARY

AI Gadget Advisor is a personalized decision engine for tech purchases. Unlike static comparison sites (91mobiles, Gadgets360, GSMArena), it understands *why* a user wants a product and delivers ranked, explained recommendations tailored to their specific needs, budget, and use case.

**One-liner:** "We don't compare products. We make decisions."

**Target Launch:** India-first (Amazon.in, Flipkart, Croma)
**Stack:** Next.js + Supabase + Vercel + Claude API
**MVP Timeline:** 6 weeks
**Bootstrap Budget:** ₹0–40,000 ($0–500)

---

## 2. VISION & MISSION

**Vision:** Become the default decision engine for tech purchases globally.

**Mission:** Replace endless tab-switching and spec-sheet paralysis with a single intelligent recommendation that explains *why* this product is best *for you*.

---

## 3. PROBLEM STATEMENT

### The Current User Journey (Broken)
1. User decides they need a projector (or phone, smartwatch, etc.)
2. Opens Google → reads 5 "best of" articles (all affiliate-driven, biased)
3. Opens Amazon → overwhelmed by 200+ options with inflated specs
4. Opens 91mobiles → compares 3 products side-by-side (no personalization)
5. Opens YouTube → watches 4 review videos (45 min wasted)
6. Opens Reddit → asks strangers for advice
7. Still unsure → either buys wrong product or delays purchase

**Total time wasted:** 3–8 hours per purchase decision
**Core problem:** Too much data, zero decision intelligence

### Pain Points
- **Spec inflation:** Chinese projectors claim "16,000 lumens" (actually 400 ANSI)
- **No context:** 91mobiles shows specs but doesn't know if you need Netflix certification
- **Review fatigue:** YouTube reviews are 15 min each and rarely address YOUR use case
- **Budget blindness:** Comparison sites don't optimize for value-per-rupee
- **No trust signal:** Users can't tell which specs actually matter for their use case

---

## 4. TARGET USERS

### Primary Personas

**Persona 1: "The Researcher" (35%)**
- Age: 25–40, tech-aware but not expert
- Behavior: Already has 2–3 products shortlisted, wants definitive comparison
- Need: "Tell me which of these 3 projectors is best for my living room"
- Mode: Compare Known Products (Mode A)

**Persona 2: "The Explorer" (45%)**
- Age: 20–45, knows what they need but not what exists
- Behavior: Has requirements but no specific products in mind
- Need: "Best projector under ₹20K for Netflix in bedroom"
- Mode: Discover Best Product (Mode B)

**Persona 3: "The Gifter" (15%)**
- Age: 25–50, buying for someone else
- Behavior: Minimal domain knowledge, high trust requirement
- Need: "Best smartwatch for my dad who's 60 and has diabetes"
- Mode: Discover (Mode B) with heavy explanation

**Persona 4: "The Upgrader" (5%)**
- Age: 20–35, tech enthusiast
- Behavior: Knows specs, wants validation and edge-case analysis
- Need: "Should I upgrade from OnePlus 12 to 13? I use the camera a lot"
- Mode: Compare (Mode A) with deep analysis

### Target Categories (Phase 1 — MVP)
1. Projectors (low competition, high confusion, good margins)
2. Smartphones (highest volume, most data available)
3. Smartwatches / Smart Rings
4. Laptops
5. TWS Earbuds

### Phase 2 Expansion
6. Tablets
7. Power Banks / Chargers
8. Smart Home (speakers, cameras, lights)
9. Gaming peripherals
10. Monitors

---

## 5. COMPETITIVE ANALYSIS

| Feature | 91mobiles | Gadgets360 | GSMArena | AI Gadget Advisor |
|---------|-----------|------------|----------|-------------------|
| Side-by-side specs | ✅ | ✅ | ✅ | ✅ |
| Personalized ranking | ❌ | ❌ | ❌ | ✅ |
| Natural language input | ❌ | ❌ | ❌ | ✅ |
| Use-case aware scoring | ❌ | ❌ | ❌ | ✅ |
| Spec verification | ❌ | ❌ | Partial | ✅ |
| Decision explanation | ❌ | ❌ | ❌ | ✅ |
| Budget optimization | ❌ | ❌ | ❌ | ✅ |
| Real-time pricing | ❌ | ❌ | ❌ | ✅ |
| Conversational UI | ❌ | ❌ | ❌ | ✅ |

### Why Existing Players Won't Copy This Easily
- 91mobiles/Gadgets360 revenue model is affiliate + display ads → they show ALL products, not the best one
- Their business model conflicts with honest recommendations
- They have no LLM infrastructure or scoring engine
- Their data is editorial, not structured for computation

---

## 6. PRODUCT MODES

### Mode A: Compare Known Products
**Input:** User provides product names, links, or model numbers
**Process:**
1. Parse product identifiers
2. Fetch/scrape specs from multiple sources
3. Normalize specs (handle misleading claims)
4. Generate personalized weights based on user context
5. Score and rank
6. Generate explanation

**Output:** Ranked comparison table + winner + explanation of tradeoffs

### Mode B: Discover Best Products
**Input:** Natural language requirements
- "Best projector under ₹15K for Netflix and gaming"
- "Smartwatch for running with GPS, budget ₹10K"
- "Phone for my mom, good camera, easy to use, under ₹20K"

**Process:**
1. Parse intent → structured query (category, budget, use cases, constraints)
2. Search product database for matching candidates
3. Score against user-specific weights
4. Return top 3–5 with explanations

**Output:** Curated shortlist + best pick + why each made/missed the cut

---

## 7. BUSINESS MODEL & REVENUE

### Phase 1: Affiliate Revenue (Month 1–6)
- Amazon Associates India (up to 9% commission)
- Flipkart Affiliate (up to 12% commission)
- Croma affiliate program
- Average order value: ₹15,000–25,000
- Commission per conversion: ₹500–2,500
- Target: 100 conversions/month by month 6 = ₹50K–2.5L/month

### Phase 2: Sponsored Placements (Month 6–12)
- Brands pay for "featured" placement (clearly labeled)
- Does NOT affect scoring — shown as separate "Sponsored Pick" section
- Pricing: ₹5,000–25,000/month per category per brand

### Phase 3: API / B2B SaaS (Month 12+)
- License the scoring engine to:
  - E-commerce platforms wanting "smart compare"
  - Corporate IT procurement teams
  - Review websites wanting AI-powered recommendations
- Pricing: ₹50,000–5L/month based on API calls

### Phase 4: Premium Users (Month 12+)
- Free: 5 comparisons/day, top 3 results
- Premium (₹99/month): Unlimited, full ranking, price alerts, price history
- Premium (₹999/year): Everything + API access for personal use

### Revenue Projections (Conservative)

| Month | MAU | Conversions | Affiliate Rev | Other Rev | Total |
|-------|-----|-------------|---------------|-----------|-------|
| 3 | 5K | 50 | ₹50K | ₹0 | ₹50K |
| 6 | 25K | 250 | ₹3.75L | ₹50K | ₹4.25L |
| 12 | 100K | 1,000 | ₹15L | ₹5L | ₹20L |
| 18 | 500K | 5,000 | ₹75L | ₹25L | ₹1Cr |

---

## 8. GO-TO-MARKET STRATEGY

### Channel 1: SEO (Primary — Month 1+)
- Target long-tail keywords:
  - "best projector under 15000 for netflix"
  - "oneplus 13 vs samsung s25 which is better for camera"
  - "best smartwatch for swimming under 10000"
- Each comparison generates a shareable URL → indexed page
- Auto-generate SEO-optimized titles and meta descriptions

### Channel 2: Content Marketing (Month 2+)
- YouTube Shorts / Instagram Reels showing the AI in action
- "I asked AI to pick the best projector under ₹20K — here's what happened"
- Reddit engagement in r/IndianGaming, r/india, r/gadgets

### Channel 3: Community & Word-of-Mouth (Month 1+)
- Share tool on ProductHunt India
- Engage in tech forums and Telegram groups
- Referral program: share comparison → earn premium days

### Channel 4: Partnerships (Month 6+)
- Tech YouTubers embed our widget in descriptions
- Blog partnerships for affiliate revenue sharing
- WhatsApp/Telegram bot for instant recommendations

---

## 9. MOAT & DEFENSIBILITY

**What is NOT the moat:**
- UI (copyable in weeks)
- Scraping (anyone can do it)
- LLM access (commodity)

**What IS the moat:**
1. **Decision Intelligence:** Proprietary scoring + normalization system that handles spec inflation, edge cases, and category-specific logic
2. **User Behavior Data:** Every click, comparison, and purchase feeds back into the ranking model
3. **Spec Verification Database:** Curated database of verified specs (vs. manufacturer claims)
4. **Category Expertise:** Deep normalization rules per category (projector lumens ≠ phone battery)
5. **Network Effects:** More users → better recommendations → more users

---

## 10. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scraping blocked by Amazon/Flipkart | High | Use official APIs where available; fallback to cached data; build partnerships |
| LLM costs spike with scale | Medium | Cache common queries; use smaller models for simple tasks; batch processing |
| Spec data quality issues | High | Multi-source verification; community corrections; confidence scores |
| Low initial traffic | Medium | SEO-first strategy; content marketing; community engagement |
| Affiliate program changes | Medium | Diversify revenue streams early; direct brand partnerships |
| Competitor copies the idea | Low | Speed of execution; data moat; user trust |

---

## 11. KEY METRICS

### North Star Metric
**Decision Confidence Score:** % of users who click "Buy" on the recommended product without further research

### Supporting Metrics
- **Time to Decision:** Seconds from query to click (target: < 60s)
- **NDCG@5:** Ranking quality (target: > 0.85)
- **Conversion Rate:** Visitors → affiliate clicks (target: 8–12%)
- **Return Rate:** Users who come back for next purchase (target: 40%+)
- **NPS:** Net Promoter Score (target: 50+)

---

## 12. MVP TIMELINE (6 WEEKS)

### Week 1–2: Foundation
- [ ] Next.js app scaffold with Vercel deployment
- [ ] Supabase database setup with product schema
- [ ] Chat-based input UI
- [ ] Basic intent parsing with Claude API
- [ ] Seed data: 50 products across 2 categories (projectors + phones)

### Week 3–4: Core Engine
- [ ] Product scraping pipeline (Amazon.in, Flipkart)
- [ ] Spec normalization engine
- [ ] LLM-powered weight generation
- [ ] Scoring algorithm implementation
- [ ] Results page with comparison table

### Week 5: Intelligence Layer
- [ ] Explanation generation
- [ ] Spec verification flagging
- [ ] Price tracking integration
- [ ] Mode A (compare) and Mode B (discover) flows

### Week 6: Polish & Launch
- [ ] SEO optimization
- [ ] Mobile responsive design
- [ ] Error handling and edge cases
- [ ] Analytics and event tracking
- [ ] Affiliate link integration
- [ ] Deploy to production

---

*Document Version: 1.0*
*Created: April 2026*
*Author: AI Gadget Advisor Team*
