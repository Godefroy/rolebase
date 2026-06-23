# Landing Page Audit Checklist (scorecard)

Use this to audit an existing SaaS landing page, or to QA a new draft. Score each item Pass / Partial / Fail and note the fix. Weight findings by section: **above-the-fold issues outrank everything else** because most visitors decide there. Rationale and citations for every item live in `conversion-principles.md`.

## A. The 5-second test (do this first, before scoring)

Show only the first screen for 5 seconds, then ask (yourself or a real stranger):
- [ ] Can they say **what the product is**?
- [ ] Can they say **who it is for**?
- [ ] Can they say **why it's better / the main benefit**?
- [ ] Can they say **what to do next**?

If any answer is no, that is the #1 priority — fix the hero before anything else.

## B. Hero / above the fold

- [ ] Headline leads with a **benefit/outcome**, not a category or feature, and is the dominant visual element.
- [ ] Value proposition is **upper-left / top** where attention lands first.
- [ ] Subheadline adds concrete what/how/who in plain language.
- [ ] Exactly **one primary CTA**, visually dominant, with **action+outcome microcopy** (not "Submit"/"Learn more").
- [ ] A **risk reducer** sits near the CTA (no card / free / cancel anytime / fast setup).
- [ ] Hero visual shows the **real product or outcome** (UI, demo, video), not abstract stock art.
- [ ] An **early trust signal** is visible (logos / rating / count) above or just below the fold.
- [ ] No jargon, no clever-but-unclear wordplay, no competing headlines.

## C. Copy quality

- [ ] Written in the **second person** ("you").
- [ ] **Benefit stated before feature** throughout.
- [ ] **Concrete and specific** (numbers, real outcomes) rather than superlatives/adjectives.
- [ ] Simple, scannable: short sentences, headings, bold, bullets — a scanner gets the gist.
- [ ] Uses the **customer's language** for the problem, not internal vocabulary.

## D. Structure & flow

- [ ] Sections answer the visitor's questions in a logical order (hook → proof → problem → how it works → benefits → deeper proof → objections → final CTA).
- [ ] **Proof sits next to the claims** it supports.
- [ ] **CTA cadence**: primary action repeated at natural decision points (after hero, after value, at end).
- [ ] One **primary action** across the whole page; secondary actions are visually subordinate.
- [ ] A strong **final CTA** restates the value proposition and the ask.

## E. Social proof & trust

- [ ] Customer **logos** present (recognizable if possible).
- [ ] **Testimonials are attributed** (name/role/company/photo) and **specific** (concrete result), not anonymous praise.
- [ ] At least one **quantified outcome / case study**.
- [ ] **Ratings/awards** and/or **user/customer counts** shown.
- [ ] **Security/compliance** signals present where relevant (SOC 2, GDPR, SSO, data residency).
- [ ] All proof is **real** — no fabricated logos, quotes, or numbers.

## F. CTA & conversion mechanics

- [ ] Primary CTA is **unmistakable and consistent** in color/style across the page.
- [ ] Microcopy communicates **value + reduces risk** at the point of action.
- [ ] The **next step is obvious** and low-commitment (free/trial/demo) where possible.

## G. Friction

- [ ] Signup/contact form asks **only for what is needed now**; everything else deferred to onboarding.
- [ ] **Frictionless entry** offered (free plan, no card, SSO/social login, or interactive demo before signup).
- [ ] Distractions trimmed on conversion-focused pages (no competing exits pulling from the primary action).
- [ ] Low cognitive load: few choices, clear labels, obvious path.

## H. Objections / FAQ

- [ ] The **real objections** for this audience are surfaced and answered (price, security, switching cost, integrations, support, "is it for me?").
- [ ] FAQ answers are plain and honest, not evasive.

## I. Performance & mobile

- [ ] Page loads **fast** (target well under ~3s; hero renders quickly). Measure with Lighthouse / Core Web Vitals.
- [ ] Images are **optimized** (compressed, right-sized, lazy-loaded below the fold).
- [ ] On **mobile**, the headline + value proposition + primary CTA are visible without zoom.
- [ ] Single-column, tap-friendly, no horizontal scroll, legible text.

## J. Honesty & focus (disqualifiers)

- [ ] No fabricated proof or invented statistics anywhere.
- [ ] No fake urgency/scarcity.
- [ ] Page serves **one primary audience** and **one primary action** — not trying to be everything to everyone.

---

### Output format for an audit

After scoring, deliver:
1. **Verdict** — one line on the page's biggest conversion leak.
2. **5-second test result** — pass/fail with what's missing.
3. **Prioritized fixes** — 3–7 items, highest-leverage first, each: *problem → why it costs conversions → concrete fix*.
4. **Quick wins vs. bigger bets** — separate the cheap high-impact edits from structural changes.
