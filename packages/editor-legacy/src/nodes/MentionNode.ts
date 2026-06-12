/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Spread } from 'lexical'

import {
  $applyNodeReplacement,
  TextNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
} from 'lexical'

export enum MentionEntities {
  Member = 'Member',
}

export type SerializedMentionNode = Spread<
  {
    entity: MentionEntities
    id: string
    type: 'mention'
    version: 1
  },
  SerializedTextNode
>

export class MentionNode extends TextNode {
  __entity: MentionEntities
  __id: string

  static getType(): string {
    return 'mention'
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__entity, node.__id, node.__text, node.__key)
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.entity,
      serializedNode.id,
      serializedNode.text
    )
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  constructor(
    entity: MentionEntities,
    id: string,
    text: string,
    key?: NodeKey
  ) {
    super(text, key)
    this.__entity = entity
    this.__id = id
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      entity: this.__entity,
      id: this.__id,
      type: 'mention',
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    dom.className = 'mention'
    return dom
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute('data-lexical-mention-entity', this.__entity)
    element.setAttribute('data-lexical-mention-id', this.__id)
    element.textContent = this.__text
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        const entity = domNode.getAttribute(
          'data-lexical-mention-entity'
        ) as MentionEntities | null
        const id = domNode.getAttribute('data-lexical-mention-id')
        if (!entity || !id) {
          return null
        }
        return {
          conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
            const textContent = domNode.textContent

            if (textContent !== null) {
              const node = $createMentionNode(entity, id, textContent)
              return {
                node,
              }
            }

            return null
          },
          priority: 1,
        }
      },
    }
  }

  isTextEntity(): true {
    return true
  }
}

export function $createMentionNode(
  entity: MentionEntities,
  id: string,
  text: string
): MentionNode {
  const mentionNode = new MentionNode(entity, id, text)
  mentionNode.setMode('segmented').toggleDirectionless()
  return $applyNodeReplacement(mentionNode)
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode
}
