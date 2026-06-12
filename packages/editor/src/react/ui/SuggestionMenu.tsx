import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

export interface SuggestionMenuItem {
  key: string
  label: string
  icon?: ReactNode
  description?: string
}

export interface SuggestionMenuHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface Props {
  items: SuggestionMenuItem[]
  onSelect(index: number): void
}

// Generic keyboard-navigable list used by slash menu,
// mentions and emoji suggestions
export default forwardRef<SuggestionMenuHandle, Props>(
  function SuggestionMenu({ items, onSelect }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((index) => (index + items.length - 1) % items.length)
          return true
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((index) => (index + 1) % items.length)
          return true
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          if (items[selectedIndex]) {
            onSelect(selectedIndex)
            return true
          }
        }
        return false
      },
    }))

    if (items.length === 0) return null

    return (
      <div className="editor-menu" role="listbox">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            role="option"
            aria-selected={index === selectedIndex}
            className={
              'editor-menu-item' + (index === selectedIndex ? ' selected' : '')
            }
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={(event) => {
              // Prevent editor blur
              event.preventDefault()
              onSelect(index)
            }}
          >
            {item.icon && <span className="editor-menu-icon">{item.icon}</span>}
            <span className="editor-menu-label">{item.label}</span>
            {item.description && (
              <span className="editor-menu-description">
                {item.description}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }
)
