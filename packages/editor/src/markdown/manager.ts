import { JSONContent, resolveExtensions } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'
import { getExtensions } from '../extensions'

let manager: MarkdownManager | undefined

// Headless markdown manager, usable on the server (no DOM needed)
export function getMarkdownManager(): MarkdownManager {
  if (!manager) {
    manager = new MarkdownManager({
      extensions: resolveExtensions(getExtensions()),
      markedOptions: { gfm: true },
    })
  }
  return manager
}

// Parse a markdown string into a Tiptap JSON document
export function mdToJson(markdown: string): JSONContent {
  return getMarkdownManager().parse(markdown)
}

// Serialize a Tiptap JSON document to a markdown string
export function jsonToMd(json: JSONContent): string {
  return getMarkdownManager().serialize(json)
}
