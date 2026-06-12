import { createHeadlessEditor } from '@lexical/headless'
import { $convertToMarkdownString } from '@lexical/markdown'
import nodes from './nodes'
import { markdownTransformers } from './transformers'

export function exportToMarkdown(value: string) {
  // If value is already a markdown string, return it
  if (value.length === 0 || value[0] !== '{') {
    return value
  }

  // Instantiate editor
  const editor = createHeadlessEditor({
    nodes: [...nodes],
    onError: () => {},
  })

  // Set editor state
  try {
    const state = JSON.parse(value)
    // Empty document (Lexical refuses to parse a root without children)
    if (state?.root?.children?.length === 0) {
      return ''
    }
    editor.setEditorState(editor.parseEditorState(state))
  } catch (e) {
    return value
  }

  // Export markdown
  return editor
    .getEditorState()
    .read(() => $convertToMarkdownString(markdownTransformers))
}
