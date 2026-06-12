import type {
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  NodeKey,
} from 'lexical'

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import {
  FigmaNode as BaseFigmaNode,
  type SerializedFigmaNode,
} from '@rolebase/editor-legacy'
import React from 'react'

type FigmaComponentProps = Readonly<{
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  nodeKey: NodeKey
  documentID: string
}>

function FigmaComponent({
  className,
  format,
  nodeKey,
  documentID,
}: FigmaComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <iframe
        width="560"
        height="315"
        src={`https://www.figma.com/embed?embed_host=lexical&url=\
        https://www.figma.com/file/${documentID}`}
        allowFullScreen={true}
      />
    </BlockWithAlignableContents>
  )
}

export class FigmaNode extends BaseFigmaNode {
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
    return super.exportJSON() as SerializedFigmaNode
  }

  decorate(_editor: LexicalEditor, config: EditorConfig) {
    const embedBlockTheme = config.theme.embedBlock || {}
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    }
    return (
      <FigmaComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        documentID={this.__id}
      />
    )
  }
}

export function $createFigmaNode(documentID: string): FigmaNode {
  return new FigmaNode(documentID)
}

export { $isFigmaNode, type SerializedFigmaNode } from '@rolebase/editor-legacy'
