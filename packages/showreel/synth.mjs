// Soundtrack synthesized to match the reel timeline (120 BPM, beat = 0.5s).
import fs from 'fs'
const SR = 44100, DUR = 24, N = Math.ceil(SR * DUR)
const L = new Float32Array(N), R = new Float32Array(N)
const VL = new Float32Array(N), VR = new Float32Array(N) // reverb send
const TAU = Math.PI * 2
const mf = m => 440 * Math.pow(2, (m - 69) / 12)
let seed = 1
const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1 }
function put(i, v, pan = 0, send = 0) {
  if (i < 0 || i >= N) return
  const l = v * Math.min(1, 1 - pan), r = v * Math.min(1, 1 + pan)
  L[i] += l; R[i] += r; VL[i] += l * send; VR[i] += r * send
}
const S = t => Math.round(t * SR)

function kick(t, a = 1) {
  let ph = 0
  for (let i = 0; i < SR * .45; i++) {
    const x = i / SR, f = 45 + 110 * Math.exp(-x * 28)
    ph += TAU * f / SR
    put(S(t) + i, a * .9 * Math.sin(ph) * Math.exp(-x * 7) + (i < 90 ? a * .3 * noise() * (1 - i / 90) : 0))
  }
}
function boom(t, a = 1) {
  let ph = 0
  for (let i = 0; i < SR * 1.6; i++) {
    const x = i / SR, f = 32 + 90 * Math.exp(-x * 14)
    ph += TAU * f / SR
    put(S(t) + i, a * Math.sin(ph) * Math.exp(-x * 2.6), 0, .1)
  }
  let lp = 0
  for (let i = 0; i < SR * .5; i++) { lp += .08 * (noise() - lp); put(S(t) + i, a * 1.2 * lp * Math.exp(-i / SR * 9), 0, .4) }
}
function clap(t, a = 1) {
  let hp = 0, prev = 0
  for (let i = 0; i < SR * .3; i++) {
    const x = i / SR, n = noise(); hp = .7 * (hp + n - prev); prev = n
    const env = (x < .03 ? (Math.floor(x / .01) % 2 ? .6 : 1) : 1) * Math.exp(-x * 18)
    put(S(t) + i, a * .35 * hp * env, 0, .35)
  }
}
function hat(t, a = 1, len = .05, pan = .2) {
  let prev = 0
  for (let i = 0; i < SR * len * 3; i++) {
    const n = noise(), h = n - prev; prev = n
    put(S(t) + i, a * .12 * h * Math.exp(-i / SR / len * 3), pan, .1)
  }
}
function tone(t, f, dur, a = .2, pan = 0, send = .5, shape = 'tri', dec = 6) {
  let ph = 0
  for (let i = 0; i < SR * dur; i++) {
    const x = i / SR; ph += f / SR
    const p = ph % 1
    let v = shape === 'sine' ? Math.sin(TAU * p) : shape === 'tri' ? 1 - 4 * Math.abs(p - .5) : 2 * p - 1
    v += .3 * Math.sin(TAU * p * 2) * Math.exp(-x * 20)
    put(S(t) + i, a * v * Math.min(1, x / .004) * Math.exp(-x * dec), pan, send)
  }
}
function bell(t, f, a = .15, pan = 0) { tone(t, f, 1.6, a, pan, .7, 'sine', 3); tone(t, f * 2.01, 1.0, a * .4, pan, .7, 'sine', 5); tone(t, f * 3.98, .5, a * .15, pan, .7, 'sine', 8) }
function pop(t, f0 = 500, f1 = 1300, a = .3) {
  let ph = 0
  for (let i = 0; i < SR * .12; i++) {
    const x = i / SR, f = f0 + (f1 - f0) * Math.min(1, x / .05)
    ph += TAU * f / SR; put(S(t) + i, a * Math.sin(ph) * Math.exp(-x * 30), 0, .3)
  }
}
// band-passed noise sweep
function whoosh(t0, dur, a = .5, f0 = 300, f1 = 4000, pan0 = -.5, pan1 = .5, shape = 'swell') {
  let low = 0, band = 0
  for (let i = 0; i < SR * dur; i++) {
    const x = i / (SR * dur), fc = f0 * Math.pow(f1 / f0, x)
    const f = 2 * Math.sin(Math.PI * Math.min(fc, 12000) / SR)
    const hi = noise() - low - .5 * band; band += f * hi; low += f * band
    const env = shape === 'rise' ? Math.pow(x, 2.2) * (x > .97 ? (1 - x) / .03 : 1) : Math.sin(Math.PI * x) ** 2
    put(S(t0) + i, a * band * env, lerp(pan0, pan1, x), .5)
  }
}
const lerp = (a, b, t) => a + (b - a) * t
function saw(t0, dur, freqs, a = .08, cutoff = 1400, atk = .02, rel = .25, pan = 0, send = .5) {
  const oscs = freqs.flatMap(f => [f * .997, f, f * 1.003])
  const ph = oscs.map((_, k) => k * .37 % 1)
  let lp1 = 0, lp2 = 0
  const n = SR * (dur + rel), k = 1 - Math.exp(-TAU * cutoff / SR)
  for (let i = 0; i < n; i++) {
    const x = i / SR
    let v = 0
    for (let o = 0; o < oscs.length; o++) { ph[o] = (ph[o] + oscs[o] / SR) % 1; v += 2 * ph[o] - 1 }
    v /= oscs.length
    lp1 += k * (v - lp1); lp2 += k * (lp1 - lp2)
    const env = Math.min(1, x / atk) * (x > dur ? Math.exp(-(x - dur) / rel * 4) : 1)
    put(S(t0) + i, a * lp2 * env, pan, send)
  }
}
function bass(t, m, dur = .22, a = .32) {
  let ph = 0, lp = 0
  const f = mf(m)
  for (let i = 0; i < SR * dur; i++) {
    const x = i / SR; ph = (ph + f / SR) % 1
    const k = 1 - Math.exp(-TAU * (200 + 1400 * Math.exp(-x * 20)) / SR)
    lp += k * ((2 * ph - 1) - lp)
    put(S(t) + i, a * (lp + .6 * Math.sin(TAU * ph)) * Math.min(1, x / .003) * Math.min(1, (dur - x) / .02))
  }
}

const CH = { Dm: [62, 65, 69], Bb: [58, 62, 65], F: [60, 65, 69], C: [60, 64, 67] }
const ROOT = { Dm: 38, Bb: 34, F: 41, C: 36 }
const BARS = ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C', 'Dm', 'F']
const chordAt = t => BARS[Math.min(BARS.length - 1, Math.floor(t / 2))]

// ---- intro 0-4 ----
pop(.02, 300, 900, .35)
saw(0, 4, CH.Dm.map(mf), .05, 700, 1.2, .6)
boom(.5, .5); whoosh(.4, .7, .6, 400, 6000)
;[1.0, 1.5, 2.0].forEach((t, i) => { kick(t, 1); clap(t, .7); saw(t, .12, CH.Dm.map(m => mf(m + 12 * (i === 2))), .1, 3000, .005, .2) })
whoosh(2.18, .35, .35, 2000, 9000, .3, -.3)
whoosh(3.0, .5, .35, 600, 5000, -.6, .6)
whoosh(3.0, 1.0, .35, 200, 7000, 0, 0, 'rise')
// ---- groove 4-14 ----
for (let b = 8; b < 28; b++) {
  const t = b * .5
  if (t >= 7.0 && t < 8.0) continue
  kick(t, .95)
  hat(t + .25, 1, .06)
  if (t >= 8 && b % 2 === 1) clap(t, .5)
  const ch = chordAt(t)
  bass(t, ROOT[ch]); bass(t + .25, ROOT[ch] + (b % 4 === 3 ? 12 : 0), .2, .25)
}
for (let t = 4; t < 14; t += 2) saw(t, 1.9, CH[chordAt(t)].map(mf), .045, 900, .4, .3)
for (let t = 11.25; t < 13.5; t += .25) hat(t, .8, .02, -.4)
// org pops and landings
const PENTA = [65, 67, 69, 72, 74, 77, 79, 81, 84]
;[4.25, 4.43, 4.61, 4.79].forEach((t, i) => tone(t, mf([53, 57, 60, 65][i]), .5, .22, (i - 1.5) * .3, .4, 'tri', 7))
for (let i = 0; i < 23; i++) tone(4.9 + i * .055, mf(PENTA[i % 9] + (i >= 9 ? 12 : 0) * (i >= 18)), .25, .08, Math.sin(i) * .6, .5, 'sine', 14)
// zoom
whoosh(6.9, 1.1, .8, 150, 9000, -.4, .4, 'rise')
saw(7.0, 1.0, [mf(48), mf(55), mf(60)].map(f => f), .04, 2500, .8, .1)
boom(8.0, .6); clap(8.0, .5); whoosh(8.0, .5, .3, 5000, 800)
;[8.8, 9.3, 9.8].forEach((t, i) => bell(t, mf([81, 84, 86][i]), .12, .3))
whoosh(10.45, .6, .55, 300, 7000, .5, -.5, 'rise'); kick(11.0, 1)
bell(13.4, mf(89), .14); whoosh(13.4, .6, .55, 300, 8000, 0, 0, 'rise')
// ---- blitz 14-16.75 ----
const BLITZ = ['Bb', 'Bb', 'C', 'C', 'Dm', 'Dm']
BLITZ.forEach((c, k) => {
  const t = 14 + k * .5
  kick(t, 1.05); clap(t, .8); boom(t, .25)
  saw(t, .28, CH[c].map(m => mf(m + (k % 2) * 12)), .11, 3500, .004, .15, 0, .5)
  bass(t, ROOT[c], .45, .3)
  for (let s = 1; s < 4; s++) hat(t + s * .125, .7, .03, s % 2 ? .4 : -.4)
})
whoosh(15.9, .85, .6, 200, 10000, -.3, .3, 'rise')
whoosh(16.75, .6, .5, 5000, 150, 0, 0)
// ---- logo 17.5-20 ----
;[['Dm', 17.5], ['Bb', 18.0], ['C', 18.5]].forEach(([c, t], i) => {
  boom(t, .9 - i * .1); kick(t, 1)
  saw(t, .45, CH[c].map(mf).concat([mf(CH[c][0] + 12)]), .09, 2600, .005, .5, 0, .6)
  bass(t, ROOT[c], .45, .35)
})
;[19.0, 19.09, 19.18].forEach((t, i) => tone(t, mf([72, 76, 79][i]), .3, .12, (i - 1) * .4, .4, 'tri', 10))
for (let t = 19.0; t < 20; t += .5) { kick(t, .8); hat(t + .25, 1, .05) }
whoosh(19.6, .5, .4, 300, 6000, 0, 0, 'rise')
// ---- lockup 20-24 ----
boom(20.0, .7); kick(20.0, 1)
saw(20.0, 3.4, [41, 48, 57, 60, 65, 69].map(mf), .05, 1500, .15, .6)
for (let j = 0; j < 8; j++) tone(20.35 + j * .045, mf([65, 69, 72, 77, 81, 84, 89, 93][j]), .6, .07, (j / 7 - .5) * 1.2, .7, 'tri', 7)
whoosh(21.5, .5, .25, 1500, 8000, -.4, .4)
bell(22.1, mf(84), .16); bell(22.1, mf(77), .1, -.3)

// ---- reverb (Schroeder) ----
function reverb(inp, combs, aps) {
  const o = new Float32Array(N)
  for (const [d, g] of combs) {
    const b = new Float32Array(d); let idx = 0, lp = 0
    for (let i = 0; i < N; i++) { const y = b[idx]; lp = y * .6 + lp * .4; b[idx] = inp[i] + lp * g; idx = (idx + 1) % d; o[i] += y * .25 }
  }
  for (const [d, g] of aps) {
    const b = new Float32Array(d); let idx = 0
    for (let i = 0; i < N; i++) { const bv = b[idx], y = -o[i] + bv; b[idx] = o[i] + bv * g; idx = (idx + 1) % d; o[i] = y }
  }
  return o
}
const rl = reverb(VL, [[1557, .86], [1617, .86], [1491, .86], [1422, .86]], [[225, .5], [556, .5]])
const rr = reverb(VR, [[1581, .86], [1641, .86], [1515, .86], [1446, .86]], [[241, .5], [572, .5]])
let peak = 0
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (N - i) / (SR * 1.2))
  L[i] = Math.tanh((L[i] + rl[i] * .5) * 1.1) * fade; R[i] = Math.tanh((R[i] + rr[i] * .5) * 1.1) * fade
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
}
const g = .9 / peak, b = Buffer.alloc(44 + N * 4)
b.write('RIFF', 0); b.writeUInt32LE(36 + N * 4, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22)
b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) { b.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); b.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4) }
fs.mkdirSync(new URL('out', import.meta.url), { recursive: true })
fs.writeFileSync(new URL('out/audio.wav', import.meta.url), b)
console.log('audio ok, peak', peak.toFixed(2))
