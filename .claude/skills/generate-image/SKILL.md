---
name: generate-image
description: Generate an image using Google Nano Banana Pro (Imagen). For blog thumbnails, illustrations, diagrams, infographics. Adapted to the Rolebase brand (purple #9870F0, warm cream backgrounds, warm gray scale).
user_invocable: true
arguments:
  - name: prompt
    description: "Description of the image to generate"
    required: true
  - name: output
    description: "Output file path relative to website/ (e.g. src/content/blog/my-post/thumbnail.jpg)"
    required: true
  - name: size
    description: "Image size WxH (default: 1920x1080)"
    required: false
---

# Generate Image

Generate an image using Google Nano Banana Pro (Gemini image generation) styled for the Rolebase brand.

Two modes:
- **Illustration** (default): no text, conceptual editorial style. For thumbnails, hero images, metaphors.
- **Infographic** (`--infographic`): renders text, numbers, labels. For breakdowns, comparisons, numbered steps, decision matrices.

The script automatically injects Rolebase brand guidelines into every prompt:
- Warm cream backgrounds (#FDF6EA)
- Primary purple accent (#9870F0)
- Secondary warm orange (#FB9803)
- Warm gray neutrals (hue ~31, slightly orange-tinted)
- Clean, slightly rounded sans-serif aesthetic (Basier Circle vibe)
- Friendly, human-centric, collaboration-oriented mood

## Usage

Always run from the `website/` folder:

```bash
cd website

# Illustration (default — no text)
npx tsx scripts/generate-image.ts "<prompt>" <output-path> [WxH]

# Infographic (text labels and numbers rendered as written in the prompt)
npx tsx scripts/generate-image.ts "<prompt>" <output-path> [WxH] --infographic
```

Examples:
```bash
# Blog thumbnail (1200x630, conceptual)
npx tsx scripts/generate-image.ts "A modern isometric scene of two teams handing off a project..." src/content/blog/my-post/thumbnail.jpg 1200x630

# Numbered-steps infographic
npx tsx scripts/generate-image.ts "Four numbered cards in a horizontal row, each showing a step of a handover..." src/content/blog/my-post/steps.jpg 1600x900 --infographic

# Square format
npx tsx scripts/generate-image.ts "An icon..." src/assets/icon.png 1080x1080
```

## When to use each mode

Use `--infographic` when:
- The content is data-driven (numbers, %, ranking)
- A comparison would be more impactful as visual than tabular
- A breakdown (steps, components, phases)
- A decision matrix with labels

Default (illustration without text) when:
- Abstract or metaphorical concept
- Blog thumbnail (legible at 300px — text never fits)
- Mood/atmosphere visual

## Prompt writing tips

- Be specific about composition, perspective, and spatial layout
- Mention "isometric" or "bird's eye view" for clean tech illustrations
- Describe contrast or duality if the article compares two approaches
- **Illustration mode**: no text (the script forbids it explicitly)
- **Infographic mode**: write the labels and numbers EXACTLY as they should appear (Nano Banana Pro reproduces text verbatim, French accents included). Specify the typeface (sans-serif), text color, and position
- Lean into Rolebase themes: roles, circles (org chart), governance, self-management, collaboration, peer feedback. Avoid corporate-pyramid imagery
- For people, prefer diverse, casual, modern professionals over stock-suited executives

## Shell quoting (IMPORTANT)

Prompts containing apostrophes or accents (`'`, `é`, `è`, `à`, `€`...) break inline shell quoting. Workaround:

```bash
# Write the prompt to a temp file first
cat > /tmp/prompt.txt <<'EOF'
Your prompt with d'apostrophes and accénts here
EOF

# Then call the script with the contents
PROMPT="$(cat /tmp/prompt.txt)" && npx tsx scripts/generate-image.ts "$PROMPT" src/content/blog/my-post/image.jpg 1600x900 --infographic

# Clean up
rm /tmp/prompt.txt
```

## Wiring the image into a blog post

After generation, reference the image in the MDX frontmatter:

```yaml
---
title: '...'
image: './thumbnail.jpg'
---
```

Or inline in the body using markdown syntax:

```markdown
![Alt text](./thumbnail.jpg)
```

If the image replaces an existing one, delete the old file from the content folder.

## Requirements

- `GOOGLE_AI_API_KEY` must be set in `website/.env` or in the monorepo root `.env` (the script checks both, in that order)
