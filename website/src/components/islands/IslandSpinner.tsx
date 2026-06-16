// Dependency-free loading spinner for island fallbacks. It renders before the
// heavy (Chakra-based) island chunk is loaded, so it must not pull Chakra in —
// hence a plain SVG rather than the webapp's <Loading> component. Positioned to
// fill its (relatively positioned) container.
export default function IslandSpinner() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7c3aed',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        width="28"
        height="28"
        className="island-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="3"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <style>{`.island-spin{animation:island-spin .9s linear infinite}@keyframes island-spin{to{transform:rotate(360deg)}}`}</style>
      </svg>
    </div>
  )
}
