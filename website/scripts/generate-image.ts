import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";

const ROOT = resolve(import.meta.dirname, "..");

// Load .env from website/ first, then fall back to monorepo root (../)
function loadEnv(path: string) {
  if (!existsSync(path)) return false;
  const envContent = readFileSync(path, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    let value = trimmed.slice(eqIndex + 1);
    if (value.startsWith('"') && value.endsWith('"'))
      value = value.slice(1, -1);
    process.env[key] ??= value;
  }
  return true;
}

loadEnv(resolve(ROOT, ".env"));
loadEnv(resolve(ROOT, "..", ".env"));

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.error("Missing GOOGLE_AI_API_KEY in .env (checked website/.env and monorepo root .env)");
  process.exit(1);
}

const args = process.argv.slice(2);
const infographicIdx = args.indexOf("--infographic");
const isInfographic = infographicIdx !== -1;
if (isInfographic) args.splice(infographicIdx, 1);

const avatarIdx = args.indexOf("--avatar");
const isAvatar = avatarIdx !== -1;
if (isAvatar) args.splice(avatarIdx, 1);

const prompt = args[0];
const outputPath = args[1];
// Avatars default to a square; everything else to a 16:9 landscape.
const size = args[2] ?? (isAvatar ? "512x512" : "1920x1080");

if (!prompt || !outputPath) {
  console.error(
    "Usage: tsx scripts/generate-image.ts <prompt> <output-path> [WxH] [--infographic | --avatar]"
  );
  console.error(
    'Example: tsx scripts/generate-image.ts "A modern office..." src/content/blog/my-post/thumbnail.jpg 1920x1080'
  );
  console.error(
    'With --infographic, text labels and numbers in the prompt are rendered (no "no text" constraint).'
  );
  console.error(
    'With --avatar, generates a uniform flat-vector head-and-shoulders portrait; the prompt only needs to describe the person.'
  );
  process.exit(1);
}

const [width, height] = size.split("x").map(Number);
const ratio = width > height ? "landscape" : width < height ? "portrait" : "square";

// Rolebase brand palette:
// - Warm cream background (#FDF6EA)
// - Primary purple (#9870F0) as the dominant brand accent
// - Orange (#FB9803) as a secondary accent for highlights
// - Warm grays (slightly orange-tinted, hue ~31)
// - Clean sans-serif typography (Basier Circle vibe)
const brandGuidelines = `Visual style: warm, modern, professional editorial. Background tones in soft warm cream (#FDF6EA) or off-white. Primary accent color is purple #9870F0 (Rolebase brand). Secondary accent is warm orange #FB9803 used sparingly. Use warm gray neutrals (slightly orange-tinted) rather than cool blue grays. Clean, geometric, slightly rounded sans-serif aesthetic. Friendly and human-centric, evoking collaboration, organization, and self-management.`;

// Avatar mode: a strict, self-contained style so a whole set of portraits
// matches perfectly (same art style, framing, zoom and background). It does NOT
// use the editorial brand guidelines above — those add scene/context and break
// uniformity. The caller's prompt only describes the person (hair, skin, etc.).
const avatarGuidelines = `Flat 2D vector avatar illustration. Bold clean shapes, soft flat shading, simple modern cartoon-vector style. NOT realistic, NOT photographic, NOT 3D, NOT rendered. A single character, head-and-shoulders portrait, centered and filling the entire square frame edge to edge, with both shoulders and the upper chest clearly visible and the shoulders touching the bottom edge; the head sits in the upper-middle and is not oversized. Plain flat single solid pale background (soft warm cream #FDF6EA or a light neutral) with a subtle hint of Rolebase purple #9870F0. Absolutely no circular crop, no round frame, no border, no badge, no vignette, no desk, no props, no scene — just the character on a flat background. Keep composition, zoom, lighting and art style identical so every avatar in the set matches.`;

const fullPrompt = isAvatar
  ? `Generate a flat vector avatar illustration. No text, no watermark, no UI elements. Size: ${width}x${height} (${ratio}). ${avatarGuidelines}

${prompt}`
  : isInfographic
    ? `Generate a clean, modern, professional editorial infographic. Size: ${width}x${height} (${ratio}). ${brandGuidelines} Text labels and numbers must be rendered EXACTLY as written in the prompt — no garbled characters, no placeholder text, perfectly legible sans-serif typography, correct French diacritics. No watermark, no UI chrome.

${prompt}`
    : `Generate a photorealistic illustration. The image should be clean, modern, and professional. No text, no watermark, no UI elements. Size: ${width}x${height} (${ratio}). ${brandGuidelines}

${prompt}`;

const mode = isAvatar ? "avatar" : isInfographic ? "infographic" : "illustration";
console.log(`Generating ${mode} with Nano Banana Pro...`);
console.log(`Size: ${width}x${height} (${ratio})`);
console.log(`Prompt: ${prompt.slice(0, 100)}...`);

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`,
  {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  }
);

if (!res.ok) {
  const error = await res.text();
  console.error(`API error ${res.status}: ${error}`);
  process.exit(1);
}

const data = await res.json();
const parts = data.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p: any) => p.inlineData);

if (!imagePart) {
  console.error("No image in response");
  console.error(
    "Response text:",
    parts
      .filter((p: any) => p.text)
      .map((p: any) => p.text)
      .join("\n")
  );
  process.exit(1);
}

const buffer = Buffer.from(imagePart.inlineData.data, "base64");
const absOutput = resolve(ROOT, outputPath);
mkdirSync(dirname(absOutput), { recursive: true });
writeFileSync(absOutput, buffer);
console.log(`Saved: ${outputPath} (${Math.round(buffer.length / 1024)} KB)`);
