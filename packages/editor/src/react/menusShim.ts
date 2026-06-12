import { Editor } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { ComponentType, ReactNode } from 'react'
// The "/menus" subpath of @tiptap/react only resolves its types with the
// "Bundler" module resolution. The webapp still typechecks with "Node"
// resolution, so we silence the resolution error and re-type the
// component minimally below. Vite resolves the import at runtime.
// @ts-ignore
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'

export interface BubbleMenuProps {
  editor: Editor
  shouldShow?: (props: {
    editor: Editor
    state: EditorState
    from: number
    to: number
  }) => boolean
  updateDelay?: number
  children: ReactNode
}

export const BubbleMenu = TiptapBubbleMenu as ComponentType<BubbleMenuProps>
