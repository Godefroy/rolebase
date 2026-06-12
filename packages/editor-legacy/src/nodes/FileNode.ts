import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'

import { $applyNodeReplacement, DecoratorNode } from 'lexical'

export interface FilePayload {
  url: string
  size: number
  name: string
  mime: string
  key?: NodeKey
}

export type SerializedFileNode = Spread<
  {
    url: string
    size: number
    name: string
    mime: string
    type: 'file'
    version: 1
  },
  SerializedLexicalNode
>

function convertFileElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLAnchorElement) {
    const name = domNode.getAttribute('data-lexical-file-name')
    if (!name) return null
    const url = domNode.getAttribute('href') || ''
    const size = parseInt(
      domNode.getAttribute('data-lexical-file-size') || '0',
      10
    )
    const mime = domNode.getAttribute('data-lexical-file-mime') || ''
    const node = $createFileNode({ url, size, name, mime })
    return { node }
  }
  return null
}

export class FileNode extends DecoratorNode<any> {
  __url: string
  __size: number
  __name: string
  __mime: string

  static getType(): string {
    return 'file'
  }

  static clone(node: FileNode): FileNode {
    return new FileNode(
      node.__url,
      node.__size,
      node.__name,
      node.__mime,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedFileNode): FileNode {
    const { url, size, name, mime } = serializedNode
    return $createFileNode({ url, size, name, mime })
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: () => ({
        conversion: convertFileElement,
        priority: 2,
      }),
    }
  }

  constructor(
    url: string,
    size: number,
    name: string,
    mime: string,
    key?: NodeKey
  ) {
    super(key)
    this.__url = url
    this.__size = size
    this.__name = name
    this.__mime = mime
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('a')
    element.setAttribute('href', this.__url)
    element.setAttribute('data-lexical-file-name', this.__name)
    element.setAttribute('data-lexical-file-size', this.__size.toString())
    element.setAttribute('data-lexical-file-mime', this.__mime)
    return { element }
  }

  exportJSON(): SerializedFileNode {
    return {
      url: this.__url,
      size: this.__size,
      name: this.__name,
      mime: this.__mime,
      type: 'file',
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.file
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): any {
    return null
  }
}

export function $createFileNode({
  url,
  size,
  name,
  mime,
  key,
}: FilePayload): FileNode {
  return $applyNodeReplacement(new FileNode(url, size, name, mime, key))
}

export function $isFileNode(
  node: LexicalNode | null | undefined
): node is FileNode {
  return node instanceof FileNode
}
