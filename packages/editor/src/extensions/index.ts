import { AnyExtension } from '@tiptap/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { Details, DetailsContent, DetailsSummary } from './Details'
import { File } from './File'
import { Mention } from './Mention'
import { Youtube } from './Youtube'

const lowlight = createLowlight(common)

// Extensions shared between the webapp editor and headless usage (server,
// markdown conversions). React-specific extensions (collaboration, drag
// handle, suggestions UI) are added in src/react.
export function getExtensions(): AnyExtension[] {
  return [
    StarterKit.configure({
      codeBlock: false,
      link: {
        openOnClick: false,
      },
    }),
    CodeBlockLowlight.configure({ lowlight }),
    TableKit.configure({
      table: { resizable: false },
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Image,
    Mention,
    File,
    Details.configure({ persist: true }),
    DetailsSummary,
    DetailsContent,
    Youtube.configure({ nocookie: true }),
    Markdown.configure({
      markedOptions: { gfm: true },
    }),
  ]
}
