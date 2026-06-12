/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ElementFormatType,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical'

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode'

export type SerializedFigmaNode = Spread<
  {
    documentID: string
    type: 'figma'
    version: 1
  },
  SerializedDecoratorBlockNode
>

export class FigmaNode extends DecoratorBlockNode {
  __id: string

  static getType(): string {
    return 'figma'
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__id, node.__format, node.__key)
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    const node = $createFigmaNode(serializedNode.documentID)
    node.setFormat(serializedNode.format)
    return node
  }

  exportJSON(): SerializedFigmaNode {
    return {
      ...super.exportJSON(),
      documentID: this.__id,
      type: 'figma',
      version: 1,
    }
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key)
    this.__id = id
  }

  updateDOM(): false {
    return false
  }

  getId(): string {
    return this.__id
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://www.figma.com/file/${this.__id}`
  }

  decorate(_editor: any, _config: any): any {
    return null
  }

  isInline(): false {
    return false
  }
}

export function $createFigmaNode(documentID: string): FigmaNode {
  return new FigmaNode(documentID)
}

export function $isFigmaNode(
  node: FigmaNode | LexicalNode | null | undefined
): node is FigmaNode {
  return node instanceof FigmaNode
}
