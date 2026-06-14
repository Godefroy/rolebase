// Briefly highlight an element with a fading background, to draw attention to
// it for a few seconds. Reusable on any element.
export function highlightElement(el: HTMLElement | null | undefined) {
  if (!el) return
  // Quick fade-in to a soft yellow (subtle on both light and dark)
  el.style.transition = 'background-color 0.2s ease'
  el.style.backgroundColor = 'rgba(236, 201, 75, 0.2)'
  window.setTimeout(() => {
    // Shorter hold, then a slower fade-out
    el.style.transition = 'background-color 1.6s ease'
    el.style.backgroundColor = ''
    window.setTimeout(() => {
      el.style.transition = ''
    }, 1700)
  }, 1400)
}
