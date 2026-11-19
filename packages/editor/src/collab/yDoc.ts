import { getSchema, JSONContent } from '@tiptap/core'
import type { Schema } from '@tiptap/pm/model'
import {
  prosemirrorJSONToYXmlFragment,
  yXmlFragmentToProsemirror,
} from '@tiptap/y-tiptap'
import type { Doc } from 'yjs'
import { getExtensions } from '../extensions'
import { isEmptyJson } from '../markdown/isEmptyJson'
import { jsonToMd, mdToJson } from '../markdown/manager'

// Name of the XmlFragment bound to the editor by the Collaboration extension
const fragmentName = 'default'

let schema: Schema | undefined

function getEditorSchema(): Schema {
  if (!schema) schema = getSchema(getExtensions({ collaboration: true }))
  return schema
}

// Write markdown into the editor fragment of a Yjs document (headless)
export function setYDocMarkdown(doc: Doc, markdown: string) {
  prosemirrorJSONToYXmlFragment(
    getEditorSchema(),
    mdToJson(markdown),
    doc.getXmlFragment(fragmentName)
  )
}

// Read the editor fragment of a Yjs document as markdown (headless).
// Returns an empty string for a document with only empty paragraphs.
export function getYDocMarkdown(doc: Doc): string {
  const node = yXmlFragmentToProsemirror(
    getEditorSchema(),
    doc.getXmlFragment(fragmentName)
  )
  const json = node.toJSON() as JSONContent
  return isEmptyJson(json) ? '' : jsonToMd(json)
}
