import { Extension } from '@tiptap/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { EmojiItem } from '../emojiList'

interface EmojiSuggestionOptions {
  suggestion: Partial<SuggestionOptions<EmojiItem>>
}

// Suggests emojis when typing ":name" and inserts them as plain
// unicode text (no dedicated node, so markdown stays clean)
export const EmojiSuggestion = Extension.create<EmojiSuggestionOptions>({
  name: 'emojiSuggestion',

  addProseMirrorPlugins() {
    return [
      Suggestion<EmojiItem>({
        editor: this.editor,
        char: ':',
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, `${props.emoji} `)
            .run()
        },
        ...this.options.suggestion,
      }),
    ]
  },

  addOptions() {
    return {
      suggestion: {},
    }
  },
})
