/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementFormatType,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical'

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode'

function convertTweetElement(
  domNode: HTMLDivElement
): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-tweet-id')
  if (id) {
    const node = $createTweetNode(id)
    return { node }
  }
  return null
}

export type SerializedTweetNode = Spread<
  {
    id: string
    type: 'tweet'
    version: 1
  },
  SerializedDecoratorBlockNode
>

export class TweetNode extends DecoratorBlockNode {
  __id: string

  static getType(): string {
    return 'tweet'
  }

  static clone(node: TweetNode): TweetNode {
    return new TweetNode(node.__id, node.__format, node.__key)
  }

  static importJSON(serializedNode: SerializedTweetNode): TweetNode {
    const node = $createTweetNode(serializedNode.id)
    node.setFormat(serializedNode.format)
    return node
  }

  exportJSON(): SerializedTweetNode {
    return {
      ...super.exportJSON(),
      id: this.getId(),
      type: 'tweet',
      version: 1,
    }
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-tweet-id')) {
          return null
        }
        return {
          conversion: convertTweetElement,
          priority: 2,
        }
      },
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute('data-lexical-tweet-id', this.__id)
    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key)
    this.__id = id
  }

  getId(): string {
    return this.__id
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://twitter.com/i/web/status/${this.__id}`
  }

  decorate(_editor: any, _config: any): any {
    return null
  }

  isInline(): false {
    return false
  }
}

export function $createTweetNode(tweetID: string): TweetNode {
  return new TweetNode(tweetID)
}

export function $isTweetNode(
  node: TweetNode | LexicalNode | null | undefined
): node is TweetNode {
  return node instanceof TweetNode
}
