import type { Klass, LexicalNode } from 'lexical'

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { MarkNode } from '@lexical/mark'
import { OverflowNode } from '@lexical/overflow'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

import { CollapsibleContainerNode } from './CollapsibleContainerNode'
import { CollapsibleContentNode } from './CollapsibleContentNode'
import { CollapsibleTitleNode } from './CollapsibleTitleNode'
import { FigmaNode } from './FigmaNode'
import { FileNode } from './FileNode'
import { HorizontalRuleNode } from './HorizontalRuleNode'
import { ImageNode } from './ImageNode'
import { KeywordNode } from './KeywordNode'
import { MentionNode } from './MentionNode'
import { TweetNode } from './TweetNode'
import { YouTubeNode } from './YouTubeNode'

const nodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  ImageNode,
  FileNode,
  MentionNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
]

export default nodes
