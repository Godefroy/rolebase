import type {
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  NodeKey,
} from 'lexical'

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import {
  TweetNode as BaseTweetNode,
  type SerializedTweetNode,
} from '@rolebase/editor-legacy'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js'

type TweetComponentProps = Readonly<{
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  loadingComponent?: React.ReactNode | string
  nodeKey: NodeKey
  onError?: (error: string) => void
  onLoad?: () => void
  tweetID: string
}>

let isTwitterScriptLoading = true

function TweetComponent({
  className,
  format,
  loadingComponent,
  nodeKey,
  onError,
  onLoad,
  tweetID,
}: TweetComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const previousTweetIDRef = useRef<string>('')
  const [isTweetLoading, setIsTweetLoading] = useState(false)

  const createTweet = useCallback(async () => {
    try {
      // @ts-expect-error Twitter is attached to the window.
      await window.twttr.widgets.createTweet(tweetID, containerRef.current)

      setIsTweetLoading(false)
      isTwitterScriptLoading = false

      if (onLoad) {
        onLoad()
      }
    } catch (error) {
      if (onError) {
        onError(String(error))
      }
    }
  }, [onError, onLoad, tweetID])

  useEffect(() => {
    if (tweetID !== previousTweetIDRef.current) {
      setIsTweetLoading(true)

      if (isTwitterScriptLoading) {
        const script = document.createElement('script')
        script.src = WIDGET_SCRIPT_URL
        script.async = true
        document.body?.appendChild(script)
        script.onload = createTweet
        if (onError) {
          script.onerror = onError as any
        }
      } else {
        createTweet()
      }

      if (previousTweetIDRef) {
        previousTweetIDRef.current = tweetID
      }
    }
  }, [createTweet, onError, tweetID])

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      {isTweetLoading ? loadingComponent : null}
      <div
        style={{ display: 'inline-block', width: '550px' }}
        ref={containerRef}
      />
    </BlockWithAlignableContents>
  )
}

export class TweetNode extends BaseTweetNode {
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
    return super.exportJSON() as SerializedTweetNode
  }

  decorate(editor: LexicalEditor, config: EditorConfig) {
    const embedBlockTheme = config.theme.embedBlock || {}
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    }
    return (
      <TweetComponent
        className={className}
        format={this.__format}
        loadingComponent="Loading..."
        nodeKey={this.getKey()}
        tweetID={this.__id}
      />
    )
  }
}

export function $createTweetNode(tweetID: string): TweetNode {
  return new TweetNode(tweetID)
}

export { $isTweetNode, type SerializedTweetNode } from '@rolebase/editor-legacy'
