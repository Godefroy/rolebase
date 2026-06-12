import { $convertFromMarkdownString } from '@lexical/markdown'
import { InitialEditorStateType } from '@lexical/react/LexicalComposer'
import { markdownTransformers } from '@rolebase/editor-legacy'

export function fixInitialState(
  value?: InitialEditorStateType
): InitialEditorStateType | undefined {
  if (!value) return undefined

  // Markdown
  if (typeof value === 'string' && value[0] !== '{') {
    return () => $convertFromMarkdownString(value, markdownTransformers)
  }

  // Other types: EditorState, string, function

  // Handle possible errors in JSON
  try {
    if (typeof value === 'string') {
      const state = JSON.parse(value)
      if (!state?.root?.children?.length) {
        throw new Error('Empty children in state')
      }
    }
  } catch (error) {
    console.warn(error)
    return undefined
  }

  return value
}
