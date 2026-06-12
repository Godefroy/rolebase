import type { NodeKey } from 'lexical'

import {
  ImageNode as BaseImageNode,
  type ImagePayload,
  type SerializedImageNode,
} from '@rolebase/editor-legacy'
import { $applyNodeReplacement } from 'lexical'
import React, { Suspense } from 'react'

const ImageComponent = React.lazy(
  // @ts-ignore
  () => import('./ImageComponent')
)

export class ImageNode extends BaseImageNode {
  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { height, width, src, alt } = serializedNode
    return $createImageNode({ src, alt, height, width })
  }

  exportJSON(): SerializedImageNode {
    return super.exportJSON()
  }

  decorate(): React.ReactNode {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__alt}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          resizable={true}
        />
      </Suspense>
    )
  }
}

export function $createImageNode({
  height,
  src,
  width,
  alt,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, alt, width, height, key))
}

export { $isImageNode, type ImagePayload, type SerializedImageNode } from '@rolebase/editor-legacy'
