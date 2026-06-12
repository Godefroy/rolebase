import { Editor, Extension, Range } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { SlashCommandItem } from '../slashItems'

interface SlashCommandOptions {
  suggestion: Partial<SuggestionOptions<SlashCommandItem>>
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {},
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem>({
        pluginKey: new PluginKey('slashCommand'),
        editor: this.editor,
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor
          range: Range
          props: SlashCommandItem
        }) => {
          editor.chain().focus().deleteRange(range).run()
          props.run(editor)
        },
        ...this.options.suggestion,
      }),
    ]
  },
})
