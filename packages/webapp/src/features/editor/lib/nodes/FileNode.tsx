import {
  FileNode as BaseFileNode,
  type FilePayload,
  type SerializedFileNode,
} from '@rolebase/editor-legacy'
import { $applyNodeReplacement } from 'lexical'
import React, { Suspense } from 'react'
import FileComponent from './FileComponent'

export class FileNode extends BaseFileNode {
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

  exportJSON(): SerializedFileNode {
    return super.exportJSON()
  }

  decorate(): React.ReactNode {
    return (
      <Suspense fallback={null}>
        <FileComponent
          url={this.__url}
          size={this.__size}
          name={this.__name}
          mime={this.__mime}
          nodeKey={this.getKey()}
        />
      </Suspense>
    )
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

export { $isFileNode, type FilePayload, type SerializedFileNode } from '@rolebase/editor-legacy'
