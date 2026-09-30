// Rolebase showreel. Deterministic: every frame is a pure function of time.
const W = 1920, H = 1080, TAU = Math.PI * 2
const C = {
  cream: '#FDF6EA', paper: '#FFFDF8', ink: '#19160F', violet: '#9A65F6',
  lilac: '#D3A7E4', peach: '#FAA68C', yellow: '#FDED99', gray: '#6B5E51',
}
const out = document.getElementById('c').getContext('2d')
const buf = document.createElement('canvas'); buf.width = W; buf.height = H
const ctx = buf.getContext('2d')

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const P = (t, a, b) => clamp((t - a) / (b - a))
const E = {
  inOut3: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out3: t => 1 - Math.pow(1 - t, 3),
  in3: t => t * t * t,
  outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inExpo: t => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
  inOutExpo: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: (t, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  outElastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
}
const spring = (t, f = 2, z = .4) => {
  if (t <= 0) return 0
  const w = TAU * f
  return 1 - Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t)
}
function rng(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// ---------- camera shake ----------
const HITS = [
  [1.0, 9], [1.5, 9], [2.0, 13],
  [14.0, 10], [14.5, 10], [15.0, 10], [15.5, 10], [16.0, 10], [16.5, 14],
  [17.5, 30], [18.0, 22], [18.5, 26],
]
function shake(t) {
  let x = 0, y = 0
  for (const [h, a] of HITS) {
    const d = t - h
    if (d < 0 || d > .7) continue
    const k = a * Math.exp(-d * 9)
    x += k * Math.sin(d * 57 + h)
    y += k * Math.cos(d * 43 + h * 3)
  }
  return [x, y]
}
function cam(cx, cy, s, t) {
  const [sx, sy] = shake(t)
  ctx.setTransform(s, 0, 0, s, W / 2 + sx - cx * s, H / 2 + sy - cy * s)
}
function bg(color) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore()
}

// ---------- drawing helpers ----------
const LW = 4
function circ(x, y, r, fill, stroke = C.ink, lw = LW) {
  if (r <= 0) return
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU)
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke() }
}
function rr(x, y, w, h, r, fill, stroke, lw = 3) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r)
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke() }
}
function font(size, weight = 600, track = 0) {
  ctx.font = `${weight} ${size}px B`
  ctx.letterSpacing = track + 'px'
}
function text(str, x, y, size, color, weight = 600, align = 'center', base = 'middle', track = 0) {
  font(size, weight, track)
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base
  ctx.fillText(str, x, y)
}
function measure(str, size, weight = 600, track = 0) {
  font(size, weight, track)
  return ctx.measureText(str).width
}
// letter offsets for a centered word
function letters(str, size, weight = 600, track = 0) {
  font(size, weight, track)
  const total = ctx.measureText(str).width - track
  return [...str].map((ch, i) => ({ ch, x: ctx.measureText(str.slice(0, i)).width - total / 2 }))
}
const IMGS = []
function avatar(i, x, y, r, alpha = 1, lw = 3) {
  if (r <= 0 || alpha <= 0) return
  ctx.save(); ctx.globalAlpha *= alpha
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU)
  ctx.save(); ctx.clip(); ctx.drawImage(IMGS[i % IMGS.length], x - r, y - r, 2 * r, 2 * r); ctx.restore()
  ctx.lineWidth = lw; ctx.strokeStyle = C.ink; ctx.stroke()
  ctx.restore()
}
function checkMark(x, y, s, p, color, lw) {
  if (p <= 0) return
  const pts = [[-10, 1], [-3, 8], [11, -7]].map(([a, b]) => [x + a * s, y + b * s])
  const l1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1])
  const l2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1])
  let d = p * (l1 + l2)
  ctx.beginPath(); ctx.moveTo(...pts[0])
  if (d <= l1) ctx.lineTo(lerp(pts[0][0], pts[1][0], d / l1), lerp(pts[0][1], pts[1][1], d / l1))
  else {
    ctx.lineTo(...pts[1]); d -= l1
    ctx.lineTo(lerp(pts[1][0], pts[2][0], d / l2), lerp(pts[1][1], pts[2][1], d / l2))
  }
  ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
  ctx.lineCap = 'butt'
}

// ================= SCENE 1+2: chaos -> org chart -> zoom =================
const GROUPS = [
  { name: 'Product', x: -170, y: -90, r: 200, fill: C.lilac, roles: [
    { n: 'Designer', x: -80, y: -60, r: 70, m: 3 }, { n: 'Developer', x: 75, y: -55, r: 70, m: 3 }, { n: 'Product Owner', x: 0, y: 85, r: 70, m: 3 }] },
  { name: 'Sales', x: 190, y: -130, r: 150, fill: C.peach, roles: [
    { n: 'Account Exec', x: -60, y: -15, r: 60, m: 2 }, { n: 'Partnerships', x: 62, y: 22, r: 60, m: 2 }] },
  { name: 'Operations', x: 130, y: 200, r: 150, fill: C.yellow, roles: [
    { n: 'Finance', x: -60, y: -45, r: 52, m: 2 }, { n: 'Legal', x: 60, y: -45, r: 52, m: 2 }, { n: 'IT', x: 0, y: 60, r: 52, m: 2 }] },
  { name: 'People', x: -150, y: 250, r: 110, fill: C.violet, roles: [
    { n: 'Recruiting', x: -45, y: 0, r: 45, m: 2 }, { n: 'Care', x: 48, y: 0, r: 45, m: 2 }] },
]
const SLOTS = []
GROUPS.forEach((g, gi) => {
  g.pop = 4.25 + gi * .18
  g.roles.forEach((r, ri) => {
    r.wx = g.x + r.x; r.wy = g.y + r.y; r.pop = g.pop + .2 + ri * .07
    const ar = r.r * .2
    for (let k = 0; k < r.m; k++)
      SLOTS.push({ x: r.wx + (k - (r.m - 1) / 2) * ar * 2.3, y: r.wy + r.r * .28, r: ar, role: r })
  })
})
const DESIGNER = GROUPS[0].roles[0]
const PAL = [C.violet, C.peach, C.yellow, C.lilac]
const R1 = rng(11)
const DOTS = SLOTS.map((s, i) => ({
  slot: s, land: 4.9 + i * .055, a: R1() * TAU, dist: 300 + R1() * 560, r: 14 + R1() * 16,
  f1: .6 + R1() * 1.2, f2: .6 + R1() * 1.2, p1: R1() * TAU, p2: R1() * TAU, wx: 30 + R1() * 60, wy: 20 + R1() * 40,
  spin: (R1() - .5) * .5, color: PAL[i % 4], arc: (R1() - .5) * 240, img: i,
}))
const SPECKS = Array.from({ length: 36 }, (_, i) => ({
  a: R1() * TAU, dist: 500 + R1() * 700, r: 4 + R1() * 7, f1: .5 + R1(), f2: .5 + R1(), p1: R1() * TAU, p2: R1() * TAU,
  wx: 40 + R1() * 60, wy: 30 + R1() * 40, spin: (R1() - .5) * .6, color: PAL[(i + 1) % 4],
}))
function chaos(d, t) {
  const b = E.outExpo(P(t, .5, 1.5)), w = E.inOut3(P(t, .5, 1.8))
  const a = d.a + d.spin * Math.max(0, t - .5)
  return [Math.cos(a) * d.dist * b + w * Math.sin(t * d.f1 + d.p1) * d.wx,
    Math.sin(a) * d.dist * .58 * b + w * Math.cos(t * d.f2 + d.p2) * d.wy]
}
const Q_WORDS = ['Who', 'does', 'what?']
const Q_TIMES = [1.0, 1.5, 2.0]

function sceneOrg(t) {
  bg(C.cream)
  let s = 1 + .06 * E.inOut3(P(t, 3.5, 7.0)), cx = 0, cy = 0
  const z = P(t, 7.0, 8.0)
  if (z > 0) {
    const e = E.inOutExpo(z), s0 = 1.06, s1 = 19
    s = Math.exp(lerp(Math.log(s0), Math.log(s1), e))
    const k = (1 - s0 / s) / (1 - s0 / s1)
    cx = DESIGNER.wx * k; cy = DESIGNER.wy * k
  }
  cam(cx, cy, s, t)
  const dz = 1 - P(t, 7.1, 7.5)

  // root circle, drawn on
  if (t > 4.0) {
    const d = E.inOut3(P(t, 4.0, 4.55)), fa = E.out3(P(t, 4.2, 4.6))
    ctx.globalAlpha = fa; circ(0, 0, 430, C.paper, null); ctx.globalAlpha = 1
    ctx.beginPath(); ctx.arc(0, 0, 430, -Math.PI / 2, -Math.PI / 2 + TAU * d)
    ctx.lineWidth = LW; ctx.strokeStyle = C.ink; ctx.stroke()
  }
  for (const g of GROUPS) {
    const gs = spring(t - g.pop, 2.0, .42)
    if (gs <= 0) continue
    ctx.save(); ctx.translate(g.x, g.y); ctx.scale(gs, gs); circ(0, 0, g.r, g.fill); ctx.restore()
    const la = E.out3(P(t, g.pop + .25, g.pop + .5))
    if (la > 0) { ctx.globalAlpha = la; text(g.name, g.x, g.y - g.r + 34 + (1 - la) * 12, 26, C.ink, 600); ctx.globalAlpha = 1 }
    for (const r of g.roles) {
      const rs = spring(t - r.pop, 2.4, .42)
      if (rs <= 0) continue
      ctx.save(); ctx.translate(r.wx, r.wy); ctx.scale(rs, rs)
      circ(0, 0, r.r, C.paper)
      const a = (r === DESIGNER ? dz : 1) * E.out3(P(t, r.pop + .2, r.pop + .4))
      if (a > 0) { ctx.globalAlpha = a; text(r.n, 0, -r.r * .3, r.r * .2, C.ink, 500); ctx.globalAlpha = 1 }
      ctx.restore()
    }
  }

  // central seed dot and its burst
  if (t < .62) {
    const r = 44 * E.outElastic(P(t, .02, .45)) + 40 * P(t, .5, .62)
    ctx.globalAlpha = 1 - P(t, .5, .62); circ(0, 0, r, C.ink, null); ctx.globalAlpha = 1
  }
  const sw = P(t, .5, 1.1)
  if (sw > 0 && sw < 1) {
    ctx.globalAlpha = 1 - sw
    ctx.beginPath(); ctx.arc(0, 0, 40 + 900 * E.outExpo(sw), 0, TAU)
    ctx.lineWidth = 8 * (1 - sw); ctx.strokeStyle = C.ink; ctx.stroke(); ctx.globalAlpha = 1
  }
  // specks
  const sa = 1 - P(t, 2.8, 3.8)
  if (t > .5 && sa > 0) for (const d of SPECKS) {
    const [x, y] = chaos(d, t)
    ctx.globalAlpha = sa; circ(x, y, d.r * spring(t - .5, 3, .4), d.color, C.ink, 2); ctx.globalAlpha = 1
  }
  // people
  if (t > .5) DOTS.forEach((d, i) => {
    const pop = spring(t - .5 - i * .006, 3, .4)
    const fs = d.land - .8
    let [x, y] = chaos(d, t), r = d.r * pop
    if (t >= fs) {
      const p = E.inOut3(P(t, fs, d.land))
      const nx = -(d.slot.y - y), ny = d.slot.x - x, nl = Math.hypot(nx, ny) || 1
      const arc = Math.sin(p * Math.PI) * d.arc
      x = lerp(x, d.slot.x, p) + nx / nl * arc; y = lerp(y, d.slot.y, p) + ny / nl * arc
      r = lerp(d.r, d.slot.r, p)
    }
    const fade = d.slot.role === DESIGNER ? dz : 1
    if (fade <= 0) return
    ctx.globalAlpha = fade
    if (t >= d.land) {
      const tau = t - d.land
      r = d.slot.r * (1 + .3 * Math.exp(-tau * 9) * Math.sin(tau * 30))
      const ring = P(tau, 0, .4)
      if (ring < 1) {
        ctx.globalAlpha = fade * (1 - ring)
        ctx.beginPath(); ctx.arc(x, y, d.slot.r + 24 * E.out3(ring), 0, TAU)
        ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.globalAlpha = fade
      }
      circ(x, y, r, d.color, C.ink, 3)
      avatar(d.img, x, y, r, E.out3(P(tau, .02, .2)), 3)
    } else circ(x, y, r, d.color, C.ink, 3)
    ctx.globalAlpha = 1
  })

  // "Who does what?"
  if (t > .9 && t < 3.7) {
    const size = 180, gap = measure(' ', size)
    const ws = Q_WORDS.map(w => measure(w, size))
    const total = ws.reduce((a, b) => a + b, 0) + gap * 2
    let x = -total / 2
    const xs = ws.map(w => { const r = x; x += w + gap; return r })
    // marker behind "what?"
    const m0 = E.inOut3(P(t, 2.2, 2.5)), m1 = E.inOut3(P(t, 3.0, 3.3))
    if (m0 > 0 && m1 < 1) {
      const x0 = xs[2] - 16, w = ws[2] + 32
      rr(x0 + w * m1, 8, w * (m0 - m1), 62, 10, C.yellow, null)
    }
    ctx.save(); ctx.beginPath(); ctx.rect(-1200, -150, 2400, 250); ctx.clip()
    Q_WORDS.forEach((w, i) => {
      const lt = t - Q_TIMES[i]
      if (lt < 0) return
      const e = E.outExpo(P(lt, 0, .4)), sc = 1 + .6 * (1 - e)
      const ex = E.inExpo(P(t, 3.0 + i * .07, 3.45 + i * .07))
      ctx.save(); ctx.translate(xs[i] + ws[i] / 2, -ex * 260); ctx.scale(sc, sc)
      ctx.globalAlpha = P(lt, 0, .06)
      text(w, 0, 0, size, C.ink, 600, 'center', 'middle')
      ctx.restore()
    })
    ctx.restore()
  }
}

// ================= SCENE 3: role card =================
const X0 = -640
const ACC = ['Design user flows', 'Run weekly user tests', 'Own the design system']
function sceneCard(t) {
  bg(C.paper)
  cam(0, 0, 1 + .18 * (1 - E.outExpo(P(t, 8.0, 8.8))) + .03 * P(t, 8, 11), t)
  // pill
  const pa = E.outExpo(P(t, 8.05, 8.5))
  if (pa > 0) {
    ctx.save(); ctx.globalAlpha = pa; ctx.translate(X0 + (1 - pa) * -40, -300)
    const w = 58 + measure('Product', 30, 500) + 26
    rr(0, -30, w, 60, 30, C.lilac, C.ink, 3)
    circ(30, 0, 10, C.ink, null)
    text('Product', 52, 1, 30, C.ink, 500, 'left')
    ctx.restore()
  }
  // title
  const ta = E.outExpo(P(t, 8.1, 8.75))
  ctx.save(); ctx.beginPath(); ctx.rect(X0 - 20, -275, 1100, 190); ctx.clip()
  text('Designer', X0 - 6, -130 + (1 - ta) * 190, 150, C.ink, 600, 'left', 'alphabetic', -3)
  ctx.restore()
  // purpose
  const pu = E.outExpo(P(t, 8.3, 8.9))
  if (pu > 0) { ctx.globalAlpha = pu; text('Make every screen a joy to use.', X0 + (1 - pu) * 40, -40, 46, C.gray, 400, 'left', 'alphabetic'); ctx.globalAlpha = 1 }
  // accountabilities
  ACC.forEach((a, k) => {
    const s = 8.5 + .5 * k, y = 70 + k * 84
    const ap = P(t, s, s + .15), ax = E.outExpo(P(t, s, s + .5))
    if (ap <= 0) return
    ctx.save(); ctx.globalAlpha = ap; ctx.translate(-(1 - ax) * 70, 0)
    circ(X0 + 26, y, 26, C.paper, C.ink, 3)
    const c = s + .3, cs = spring(t - c, 3, .4)
    if (cs > 0) { circ(X0 + 26, y, 26 * cs, C.violet, C.ink, 3); checkMark(X0 + 26, y, 1.1, E.out3(P(t, c + .05, c + .25)), C.paper, 5) }
    text(a, X0 + 78, y + 2, 42, C.ink, 500, 'left')
    ctx.restore()
  })
  // members
  const AV = [[360, -110, 118, C.peach, 0], [560, -30, 98, C.yellow, 1], [400, 140, 86, C.violet, 2]]
  AV.forEach(([x, y, r, back, img], i) => {
    const s = spring(t - 8.45 - i * .15, 2.2, .38)
    if (s <= 0) return
    const fy = Math.sin(t * 2.2 + i * 1.7) * 7
    circ(x + 14, y + 14 + fy, r * s, back, C.ink, 4)
    circ(x, y + fy, r * s, C.paper, null)
    avatar(img, x, y + fy, r * s, 1, 5)
  })
  // wipe out
  const w1 = E.in3(P(t, 10.5, 10.93)), w2 = E.in3(P(t, 10.58, 11.0))
  if (w1 > 0) circ(X0 + 26, 238, 2700 * w1, C.violet, null)
  if (w2 > 0) circ(X0 + 26, 238, 2700 * w2, C.ink, null)
}

// ================= SCENE 4: meeting =================
const STEPS = ['Check-in', 'Threads', 'Decisions', 'Check-out']
const RING = { x: -400, y: 40, r: 240 }
function sceneMeet(t) {
  bg(C.ink)
  cam(0, 0, 1 + .12 * (1 - E.outExpo(P(t, 11, 11.7))) + .03 * P(t, 11, 14), t)
  // title
  const words = 'Meetings that end on time.'.split(' ')
  const size = 64, gap = measure(' ', size)
  const ws = words.map(w => measure(w, size))
  let x = -(ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1)) / 2
  ctx.save(); ctx.beginPath(); ctx.rect(-1000, -440, 2000, 120); ctx.clip()
  words.forEach((w, i) => {
    const e = E.outExpo(P(t, 11.1 + i * .05, 11.7 + i * .05))
    text(w, x, -380 + (1 - e) * 90, size, i >= 3 ? C.yellow : C.cream, 600, 'left')
    x += ws[i] + gap
  })
  ctx.restore()

  const p = E.inOut3(P(t, 11.3, 13.4)), q = p * 4
  const ri = E.outBack(P(t, 11.05, 11.6))
  // ring
  ctx.save(); ctx.translate(RING.x, RING.y)
  const pulse = 1 + .05 * Math.sin(Math.PI * P(t, 13.35, 13.55))
  ctx.scale(ri * pulse, ri * pulse)
  ctx.beginPath(); ctx.arc(0, 0, RING.r, 0, TAU); ctx.lineWidth = 30; ctx.strokeStyle = '#2E2922'; ctx.stroke()
  if (p > 0) {
    ctx.beginPath(); ctx.arc(0, 0, RING.r, -Math.PI / 2, -Math.PI / 2 + TAU * p)
    ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.lineCap = 'butt'
  }
  for (let k = 0; k < 4; k++) {
    const a = -Math.PI / 2 + TAU * k / 4
    circ(Math.cos(a) * RING.r, Math.sin(a) * RING.r, 6, q > k ? C.ink : C.cream, null)
  }
  const ka = -Math.PI / 2 + TAU * p
  circ(Math.cos(ka) * RING.r, Math.sin(ka) * RING.r, 22, C.cream, C.ink, 5)
  const secs = Math.round((1 - p) * 45 * 60)
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0')
  text(`${mm}:${ss}`, 0, -12, 108, C.cream, 600, 'center', 'middle', 2)
  text(p >= 1 ? 'Done' : STEPS[Math.min(3, Math.floor(q))], 0, 74, 36, C.lilac, 500)
  ctx.restore()

  // agenda
  STEPS.forEach((s, k) => {
    const y = RING.y + (k - 1.5) * 112, x0 = 40, w = 600
    const e = E.outExpo(P(t, 11.15 + k * .09, 11.75 + k * .09))
    if (e <= 0) return
    const on = clamp((q - k) * 8) * (1 - clamp((q - k - 1) * 8)), done = clamp((q - k - 1) * 8)
    ctx.save(); ctx.globalAlpha = P(t, 11.15 + k * .09, 11.3 + k * .09)
    ctx.translate(x0 + (1 - e) * 500 + w / 2, y); ctx.scale(1 + .04 * on, 1 + .04 * on); ctx.translate(-w / 2, 0)
    rr(0, -45, w, 90, 45, null, '#5B5248', 3)
    text(String(k + 1), 45, 0, 26, C.cream, 600); circ(45, 0, 24, null, C.cream, 3)
    text(s, 92, 2, 40, C.cream, 500, 'left')
    if (on > 0) {
      ctx.globalAlpha = on
      rr(0, -45, w, 90, 45, C.yellow, C.yellow, 3); circ(45, 0, 24, C.ink, null)
      text(String(k + 1), 45, 0, 26, C.yellow, 600); text(s, 92, 2, 40, C.ink, 600, 'left')
    }
    if (done > 0) {
      ctx.globalAlpha = done
      rr(0, -45, w, 90, 45, '#241F19', '#241F19', 3); circ(45, 0, 24 * spring(done * .5, 3, .4), C.yellow, null)
      checkMark(45, 0, 1, done, C.ink, 5); text(s, 92, 2, 40, '#8C8074', 500, 'left')
    }
    ctx.restore()
  })
  // flood
  const f = E.in3(P(t, 13.5, 14.0))
  if (f > 0) circ(RING.x, RING.y, 2700 * f, C.yellow, null)
}

// ================= SCENE 5: word blitz =================
const WORDS = [['Roles', C.yellow, C.ink], ['Org chart', C.violet, C.cream], ['Meetings', C.peach, C.ink],
  ['Decisions', C.ink, C.yellow], ['Tasks', C.lilac, C.ink], ['Autonomy', C.cream, C.violet]]
const ORIG = [[0, 0], [-760, 360], [760, -340], [-700, -380], [700, 380], [0, 0]]
const BSIZE = 250
function wordScale(k, t) { const s = 14 + .5 * k; return 1 + .07 * E.out3(P(t, s, s + .75)) }
function blitzLayer(k, t) {
  const [w, bgc, fg] = WORDS[k], s0 = 14 + .5 * k
  ctx.fillStyle = bgc; ctx.fillRect(-2000, -2000, 4000, 4000)
  const sw = P(t, s0, s0 + .55)
  if (sw > 0 && sw < 1) {
    ctx.globalAlpha = (1 - sw) * .6
    ctx.beginPath(); ctx.arc(0, 0, 200 + 900 * E.out3(sw), 0, TAU)
    ctx.lineWidth = 16 * (1 - sw); ctx.strokeStyle = fg; ctx.stroke(); ctx.globalAlpha = 1
  }
  ctx.save(); const sc = wordScale(k, t); ctx.scale(sc, sc)
  letters(w, BSIZE, 600, -4).forEach((l, j) => {
    const lt = t - s0 - .03 - j * .022
    if (lt <= 0) return
    const e = E.outBack(P(lt, 0, .38))
    ctx.save(); ctx.translate(l.x, 150 * (1 - e) + 8); ctx.rotate(.3 * (1 - e))
    ctx.globalAlpha = P(lt, 0, .07)
    text(l.ch, 0, 0, BSIZE, fg, 600, 'left', 'middle', -4)
    ctx.restore()
  })
  ctx.restore()
}
function sceneBlitz(t) {
  bg(C.yellow)
  cam(0, 0, 1, t)
  const k = clamp(Math.floor((t - 14) / .5), 0, 5)
  if (k === 0) return blitzLayer(0, t)
  blitzLayer(k - 1, t)
  const s = 14 + .5 * k, r = 2500 * E.outExpo(P(t, s - .04, s + .3))
  ctx.save(); ctx.beginPath(); ctx.arc(ORIG[k][0], ORIG[k][1], r, 0, TAU); ctx.clip()
  blitzLayer(k, t)
  ctx.restore()
}
const R2 = rng(5)
const FALL = [...'Autonomy'].map(() => ({ d: R2() * .12, rot: (R2() - .5) * 5, vx: (R2() - .5) * 300 }))
function fallingWord(t) {
  const sc = wordScale(5, 16.75)
  ctx.save(); ctx.scale(sc, sc)
  letters('Autonomy', BSIZE, 600, -4).forEach((l, j) => {
    const f = FALL[j], lt = Math.max(0, t - 16.75 - f.d)
    const y = 8 + .5 * 7000 * lt * lt - 260 * lt
    if (y > 900) return
    ctx.save(); ctx.translate(l.x + f.vx * lt, y); ctx.rotate(f.rot * lt * lt * 2)
    text(l.ch, 0, 0, BSIZE, C.violet, 600, 'left', 'middle', -4)
    ctx.restore()
  })
  ctx.restore()
}

// ================= SCENE 6+7: logo build and lockup =================
let ICONP, LOCKP, LOCK_ICON_BOX
const IMP = [17.5, 18.0, 18.5]
const LAYERS = [
  { paths: [0, 1, 2, 3, 9], px: 72.7, py: 120, hw: 69, color: C.lilac },
  { paths: [4, 5, 8], px: 80.8, py: 77.6, hw: 52, color: C.peach },
  { paths: [6, 7, 10], px: 71.8, py: 44.6, hw: 36, color: C.yellow },
]
const BIG = { s: 4.3, x: 0, y: 30 }
const LK = { k: 3.2, y: -80 }
const R3 = rng(23)
const DUST = IMP.map(() => Array.from({ length: 18 }, () => ({
  side: R3() < .5 ? -1 : 1, v: 450 + R3() * 700, vy: -(150 + R3() * 450), r: 6 + R3() * 10, life: .35 + R3() * .25, off: R3() * 20,
})))
function iconToScreen(lx, ly) { return [BIG.x + (lx - 72.7) * BIG.s, BIG.y + (ly - 61.6) * BIG.s] }
function drawLayerPaths(L) {
  for (const i of L.paths) {
    const p = ICONP[i]
    if (p.fill && p.fill !== 'none') { ctx.fillStyle = p.fill === 'white' ? '#FFFFFF' : p.fill; ctx.fill(p.path) }
    if (i < 8) { ctx.lineWidth = 1; ctx.strokeStyle = C.ink; ctx.stroke(p.path) }
  }
}
function layerState(i, t) {
  const I = IMP[i], fp = P(t, I - .42, I)
  let y = -1500 * (1 - fp * fp), sx = 1, sy = 1
  if (t < I) { sy = 1 + .16 * fp; sx = 1 - .07 * fp }
  else {
    const tau = t - I, sq = .24 * Math.exp(-tau * 7) * Math.cos(tau * 21)
    sy = 1 - sq; sx = 1 + sq * .6
  }
  for (let j = i + 1; j < 3; j++) {
    const tau = t - IMP[j]
    if (tau > 0) { const sq = .07 * Math.exp(-tau * 8) * Math.cos(tau * 22); sy -= sq; sx += sq * .5 }
  }
  const hop = k => 38 * Math.sin(Math.PI * P(t, 19.0 + k * .09, 19.32 + k * .09))
  y -= hop(i) - (i > 0 ? hop(i - 1) : 0)
  return { y, sx, sy, vis: t > I - .42 }
}
function sceneLogo(t) {
  bg(C.cream)
  cam(0, 0, 1 + .025 * E.inOut3(P(t, 20.5, 24)), t)
  // icon transform: big -> lockup
  const B = LOCK_ICON_BOX, k = LK.k
  const m = (B.h / 116.8) * k
  const lcx = (B.x + B.w / 2 - 167) * k, lcy = (B.y + B.h / 2 - 28) * k + LK.y
  const e = E.inOutExpo(P(t, 20.0, 20.75))
  const s = Math.exp(lerp(Math.log(BIG.s), Math.log(m), e))
  const cx = lerp(BIG.x, lcx, e), cy = lerp(BIG.y, lcy, e)
  // ground shadow + shockwaves
  const f0 = P(t, IMP[0] - .42, IMP[0])
  if (f0 > 0 && e < 1) {
    ctx.save(); ctx.globalAlpha = .13 * f0 * f0 * (1 - e)
    const [gx, gy] = iconToScreen(72.7, 121)
    ctx.beginPath(); ctx.ellipse(gx, gy, 69 * BIG.s * (.35 + .65 * f0 * f0), 11 * BIG.s, 0, 0, TAU)
    ctx.fillStyle = C.ink; ctx.fill(); ctx.restore()
  }
  LAYERS.forEach((L, i) => {
    const w = P(t, IMP[i], IMP[i] + .6)
    if (w <= 0 || w >= 1) return
    const [x, y] = iconToScreen(L.px, L.py - (i ? 5 : 0))
    ctx.save(); ctx.globalAlpha = 1 - w
    ctx.beginPath(); ctx.ellipse(x, y, L.hw * BIG.s * (1 + 1.4 * E.out3(w)), L.hw * BIG.s * .26 * (1 + 1.4 * E.out3(w)), 0, 0, TAU)
    ctx.lineWidth = 6 * (1 - w); ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore()
  })
  // layers, nested so upper ones ride the squash of lower ones
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-72.7, -61.6)
  LAYERS.forEach((L, i) => {
    const st = layerState(i, t)
    if (!st.vis) return
    ctx.translate(L.px, L.py + st.y / BIG.s); ctx.scale(st.sx, st.sy); ctx.translate(-L.px, -L.py)
    drawLayerPaths(L)
  })
  ctx.restore()
  // dust
  LAYERS.forEach((L, i) => DUST[i].forEach(d => {
    const tau = t - IMP[i]
    if (tau < 0 || tau > d.life) return
    const [x0, y0] = iconToScreen(L.px + d.side * (L.hw - 4), L.py - (i ? 5 : 0))
    const vx = d.v * d.side, dr = 1 - Math.exp(-tau * 5)
    const x = x0 + vx / 5 * dr + d.side * d.off, y = y0 + d.vy / 5 * dr + 380 * tau * tau
    circ(x, y, d.r * (1 - tau / d.life), L.color, C.ink, 2.5)
  }))
  // wordmark
  if (t > 20.2) {
    const order = LOCKP.slice(0, 8).map((p, i) => ({ ...p, i })).sort((a, b) => a.x0 - b.x0)
    ctx.save(); ctx.translate(-167 * k, -28 * k + LK.y); ctx.scale(k, k)
    ctx.beginPath(); ctx.rect(70, -20, 280, 72.5); ctx.clip()
    order.forEach((p, j) => {
      const le = E.outExpo(P(t, 20.35 + j * .045, 21.0 + j * .045))
      ctx.save(); ctx.translate(0, 62 * (1 - le)); ctx.fillStyle = C.ink; ctx.fill(p.path); ctx.restore()
    })
    ctx.restore()
  }
  // tagline with the marker callback
  if (t > 20.9) {
    const words = 'Clarify who does what.'.split(' '), size = 66, gap = measure(' ', size, 500)
    const ws = words.map(w => measure(w, size, 500))
    let x = -(ws.reduce((a, b) => a + b, 0) + gap * 3) / 2
    const xs = ws.map(w => { const r = x; x += w + gap; return r })
    const me = E.inOut3(P(t, 21.55, 21.95))
    if (me > 0) {
      const mx = xs[1] - 14, mw = measure('who does what', size, 500) + 28
      rr(mx, 146, mw * me, 50, 10, C.yellow, null)
    }
    ctx.save(); ctx.beginPath(); ctx.rect(-900, 70, 1800, 150); ctx.clip()
    words.forEach((w, i) => {
      const we = E.outExpo(P(t, 21.0 + i * .07, 21.6 + i * .07))
      text(w, xs[i], 140 + (1 - we) * 90, size, C.ink, 500, 'left')
    })
    ctx.restore()
  }
  const ue = E.outExpo(P(t, 22.1, 22.7))
  if (ue > 0) { ctx.globalAlpha = ue; text('rolebase.io', 0, 262 + (1 - ue) * 30, 40, C.violet, 600, 'center', 'middle', 1); ctx.globalAlpha = 1 }
}

// ---------- frame ----------
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1
  if (t < 8) sceneOrg(t)
  else if (t < 11) sceneCard(t)
  else if (t < 14) sceneMeet(t)
  else if (t < 16.75) sceneBlitz(t)
  else {
    sceneLogo(t)
    if (t < 17.8) { cam(0, 0, 1, t); fallingWord(t) }
  }
}
const SHUTTER = .5 / 60
const inAny = (t, rs) => rs.some(([a, b]) => t >= a && t <= b)
function samplesAt(t) {
  if (inAny(t, [[7.05, 8.0]])) return 40
  if (inAny(t, [[16.9, 18.7], [19.0, 19.5], [20.0, 20.8], [10.45, 11.1], [13.45, 14.1], [0.45, 0.8]])) return 16
  if (t >= 14 && t < 16.9) return 12
  return 8
}
window.renderFrame = t => {
  const n = samplesAt(t)
  for (let i = 0; i < n; i++) {
    draw(t + (i / n - .5) * SHUTTER)
    out.globalAlpha = 1 / (i + 1)
    out.drawImage(buf, 0, 0)
  }
  out.globalAlpha = 1
}

// ---------- boot ----------
;(async () => {
  await Promise.all([400, 500, 600].map(w => document.fonts.load(`${w} 100px B`)))
  const names = ['alice', 'bruno', 'camille', 'chloe', 'emma', 'tom']
  await Promise.all(names.map((n, i) => new Promise(res => {
    const im = new Image(); im.onload = res
    im.src = `../../website/public/demo-avatars/${n}.jpg`; IMGS[i] = im
  })))
  ICONP = ICON.map(p => ({ ...p, path: new Path2D(p.d) }))
  LOCKP = LOCK.map(p => ({ ...p, path: new Path2D(p.d), x0: parseFloat(p.d.slice(1)) }))
  // bbox of the lockup icon (paths 8+) via SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('style', 'position:absolute;left:-9999px'); document.body.appendChild(svg)
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); svg.appendChild(g)
  LOCK.slice(8).forEach(p => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'path'); e.setAttribute('d', p.d); g.appendChild(e) })
  const b = g.getBBox(); LOCK_ICON_BOX = { x: b.x, y: b.y, w: b.width, h: b.height }
  window.READY = true
  const qs = new URLSearchParams(location.search)
  if (qs.has('t')) renderFrame(parseFloat(qs.get('t')))
})()
