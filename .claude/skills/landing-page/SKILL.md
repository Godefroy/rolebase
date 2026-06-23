---
name: landing-page
description: Create or improve a high-converting SaaS landing page (homepage, solution/product page, or feature page). Use when the user asks to design, write, audit, optimize, or improve the conversion rate of a marketing/landing page. Applies evidence-based CRO principles (hero, copy, social proof, CTA, friction, speed). Generic to any SaaS — not tied to one product.
user_invocable: true
arguments:
  - name: target
    description: "Path to the page to create/improve, or a short description of the page (e.g. 'homepage', 'pricing page', 'the AI-notes solution page')"
    required: false
---

# Landing Page (SaaS conversion)

Create a new SaaS landing page, or improve an existing one, so it converts more visitors into signups/demos/trials. This skill is **product-agnostic**: it encodes how high-converting SaaS pages are built, not any one company's content. Adapt every example to the actual product you are working on.

The methodology rests on a verified evidence base (eye-tracking, page-speed, benchmark studies) in `references/conversion-principles.md`, and an actionable audit scorecard in `references/audit-checklist.md`. **Read both reference files before drafting or auditing** — they hold the numbers, citations, and the line between proven facts and best-practice heuristics. Do not invent conversion statistics; only cite the ones in the principles file (several popular stats were fact-checked out for being unsupported).

## The one rule above all others

**Clarity beats cleverness.** A visitor decides in under a second whether your page is for them. If they cannot tell *what the product does, who it is for, and why it is better* from the first screen, no amount of persuasion, animation, or social proof recovers that. Optimize relentlessly for instant comprehension first, persuasion second.

## Workflow

### 1. Understand the product and the visitor (always do this first)

You cannot write a converting page from generic knowledge. Gather:

- **What it does**, in one concrete sentence a non-expert understands.
- **Who it is for** (the specific segment this page targets — one page, one primary audience).
- **The core pain** it removes and the **outcome/transformation** it delivers (not the feature list — the result the user gets).
- **Differentiation**: why this over the alternatives (including "do nothing" / spreadsheets / status quo).
- **Proof assets available**: customer logos, testimonials with names/titles, quantified results, ratings/awards, user counts, security/compliance badges.
- **Primary conversion action** (signup, free trial, book demo, contact) and any secondary action.
- **Objections** that stop this audience from converting (price, switching cost, trust, learning curve, data security).

When improving an existing product's page, mine the real source of truth (the app, docs, existing pages, customer quotes) rather than guessing. When a fact is missing and material (e.g. there are no real testimonials, or the primary CTA is ambiguous), **ask the user** rather than fabricating it.

### 2a. If IMPROVING an existing page — audit first

1. Read the current page end to end.
2. Score it against `references/audit-checklist.md`. Note every gap with its section.
3. Produce a **prioritized diagnosis**: the 3-7 highest-leverage problems, ordered by likely conversion impact and ease of fix. Lead with the above-the-fold/hero issues — that is where most conversion is won or lost.
4. Only then propose and apply changes. Preserve the page's voice, brand, and tech stack/components; change substance, not style for style's sake.

### 2b. If CREATING a new page — draft against the blueprint

Follow the section blueprint below, writing each section to its job. Reuse the project's existing layout components and design system rather than inventing markup.

### 3. Apply the conversion principles

Write/rewrite each section using `references/conversion-principles.md`. The condensed essentials:

- **Hero / above the fold** carries the load. It must answer, in order: *What is it? Who is it for? Why is it better? What do I do next?* Dominant, benefit-led headline (outcome, not category); one-line clarifying subheadline; one primary CTA with action-specific microcopy; a hero visual that shows the product or outcome (real UI > stock art); and an early trust signal. Put the value proposition top-left where the eye lands first.
- **Copy**: simple, concrete, second-person ("you"). Short sentences. Lead with the benefit, then name the feature that delivers it. Cut jargon and adjectives. Specifics ("set up in 5 minutes", real numbers) beat superlatives ("the best", "powerful").
- **Structure** answers the visitor's questions in the order they ask them: hook → proof → problem → how it works → benefits/features → deeper proof → objections/FAQ → final CTA. Maintain a strong CTA cadence; repeat the primary action at natural decision points (after the hero, after value is established, at the end).
- **Social proof** placed next to claims and CTAs: logos, named testimonials, quantified outcomes, ratings/awards, counts. Specific and attributed beats vague and anonymous.
- **CTA**: one primary action per page, visually dominant, repeated. Microcopy states the outcome and reduces risk ("Start free — no credit card", "Get my demo"). Reduce perceived risk near every CTA (free, no card, cancel anytime, GDPR/security).
- **Friction**: remove every non-essential step and form field; ask only for what you truly need now. Each removed obstacle between intent and action lifts conversion.
- **Objections/FAQ**: surface the real reasons people hesitate and answer them plainly (pricing, security/GDPR, switching, integrations, support, who it's for).
- **Performance & mobile** are conversion features, not afterthoughts: speed and a clean mobile layout directly move the rate. Verify the page is fast and that the hero, headline, and primary CTA work on a phone.

### 4. Review

Self-check against `references/audit-checklist.md`. Confirm: the 5-second test passes (a stranger could state what it is, who it's for, and what to do next), the primary CTA is unmistakable and repeated, every claim near a CTA has proof, copy is concrete and second-person, and the page is fast and mobile-clean. Present the diagnosis + changes (or the draft) to the user for review.

## Guardrails

- **Never fabricate proof.** No fake testimonials, logos, numbers, awards, or customer counts. If proof is weak, recommend obtaining it; do not invent it.
- **Never invent statistics** about conversion. Cite only the verified figures in the principles file, and frame heuristics as heuristics.
- **One page, one primary audience, one primary action.** Resist the urge to serve everyone; competing CTAs reduce conversion.
- **Respect the existing stack and brand.** Match the project's components, tone, i18n, and styling conventions. This skill changes *what* the page says and how it is structured, not the framework it is built on.
- **Honesty over hype.** Overclaiming erodes the trust that drives conversion. Persuade with clarity and proof, not pressure.
