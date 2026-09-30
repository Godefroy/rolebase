# Rolebase · Motion reel

A 24-second, 1080p60 motion reel about Rolebase, written as code: every frame is a pure function of time, so it renders identically in any order.

This folder has no `package.json` on purpose: it stays out of the npm workspaces and the turbo build. It reuses Playwright from `website/node_modules` (run `npm install` in `website/` first) and needs `ffmpeg` and `cwebp`.

- **Picture**: `reel.js` draws each scene on a canvas (brand colors, Basier Circle, logo paths extracted from the website by `extract.mjs`). Each frame averages sub-frames over a 180° shutter (8 samples, up to 40 on fast moves) for real motion blur.
- **Text**: every on-screen string lives in `STRINGS` at the top of `reel.js`, one entry per language. Add a language there, then render it.
- **Sound**: `synth.mjs` synthesizes the whole soundtrack at 120 BPM (one beat is 30 frames), cued on the same timeline.

## Commands

```bash
node render.mjs fr                       # full render to out/rolebase-reel-fr.mp4 (en by default)
node render.mjs fr preview 1.2,7.5,20.4  # single frames (in seconds) to preview/fr/
```

## Website copy

Each homepage (`/en/`, `/fr/`) serves a web encode in its language, not the master: `website/public/video/rolebase-reel-<lang>-v<N>.mp4` and its poster `rolebase-reel-<lang>-v<N>.webp` (the final lockup frame).

```bash
ffmpeg -i out/rolebase-reel-<lang>.mp4 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart ../../website/public/video/rolebase-reel-<lang>-v<N>.mp4
ffmpeg -ss 23.5 -i out/rolebase-reel-<lang>.mp4 -frames:v 1 -vf scale=1280:-1 /tmp/poster.png && cwebp -q 82 /tmp/poster.png -o ../../website/public/video/rolebase-reel-<lang>-v<N>.webp
```

Files there are cached as immutable: a new render gets the next `v<N>` and the old files are deleted, never overwritten.
