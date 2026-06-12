import { Editor } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { SuggestionProps } from '@tiptap/suggestion'
import { SuggestionMenuHandle } from './ui/SuggestionMenu'

// Position a popup element under the text cursor, flipping
// above when there is not enough space below
function positionPopup(popup: HTMLElement, rect: DOMRect | null | undefined) {
  if (!rect) return
  const { offsetHeight, offsetWidth } = popup
  const top =
    rect.bottom + offsetHeight > window.innerHeight
      ? rect.top - offsetHeight - 4
      : rect.bottom + 4
  const left = Math.min(rect.left, window.innerWidth - offsetWidth - 8)
  popup.style.top = `${top}px`
  popup.style.left = `${left}px`
}

// Build the `render` function of a Tiptap Suggestion plugin from a
// React component (which must expose onKeyDown through its ref)
export function createSuggestionRender<Item, Props extends SuggestionProps<Item>>(
  component: React.ComponentType<any>,
  editor: () => Editor | null
) {
  return () => {
    let renderer: ReactRenderer<SuggestionMenuHandle> | undefined
    let popup: HTMLDivElement | undefined

    const destroy = () => {
      renderer?.destroy()
      popup?.remove()
      renderer = undefined
      popup = undefined
    }

    return {
      onStart: (props: Props) => {
        const currentEditor = editor()
        if (!currentEditor) return
        renderer = new ReactRenderer(component, {
          props,
          editor: currentEditor,
        })
        popup = document.createElement('div')
        popup.className = 'editor-popup'
        popup.appendChild(renderer.element)
        document.body.appendChild(popup)
        positionPopup(popup, props.clientRect?.() as DOMRect | undefined)
      },
      onUpdate: (props: Props) => {
        renderer?.updateProps(props)
        if (popup) {
          positionPopup(popup, props.clientRect?.() as DOMRect | undefined)
        }
      },
      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          destroy()
          return true
        }
        return renderer?.ref?.onKeyDown(props) ?? false
      },
      onExit: destroy,
    }
  }
}
