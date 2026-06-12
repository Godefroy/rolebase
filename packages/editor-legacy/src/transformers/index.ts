/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createLinkNode, LinkNode } from '@lexical/link'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ElementTransformer,
  TRANSFORMERS,
  TextMatchTransformer,
  Transformer,
} from '@lexical/markdown'
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'
import {
  $createParagraphNode,
  $createTextNode,
  $isParagraphNode,
  $isTextNode,
  LexicalNode,
} from 'lexical'
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from '../nodes/ImageNode'
import {
  $createTweetNode,
  $isTweetNode,
  TweetNode,
} from '../nodes/TweetNode'
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '../nodes/HorizontalRuleNode'
import emojiList from './emoji-list'

// Simple links with chevrons: <https://example.com>
const SIMPLE_LINK: TextMatchTransformer = {
  dependencies: [LinkNode],
  export: () => null,
  importRegExp: /<(https:\/\/[^>]+)>/,
  regExp: /<(https:\/\/[^>]+)>$/,
  replace: (textNode, match) => {
    const [, url] = match
    const linkNode = $createLinkNode(url)
    const linkTextNode = $createTextNode(url)
    linkTextNode.setFormat(textNode.getFormat())
    linkNode.append(linkTextNode)
    textNode.replace(linkNode)
  },
  trigger: '>',
  type: 'text-match',
}

// Remove backslashes that can appear in old values of the editor
// using outline/rich-markdown-editor
const EOL_SLASH: TextMatchTransformer = {
  dependencies: [],
  regExp: /^\\$/,
  importRegExp: /^\\$/,
  export: () => null,
  replace: (textNode) => {
    textNode.replace($createParagraphNode())
  },
  trigger: '\\',
  type: 'text-match',
}

// Emojis
const EMOJI: TextMatchTransformer = {
  dependencies: [],
  regExp: /:([a-z0-9_]+):/,
  importRegExp: /:([a-z0-9_]+):/,
  export: () => null,
  replace: (textNode, match) => {
    const emoji = emojiList.find((emoji) => emoji.aliases.includes(match[1]))
      ?.emoji
    if (emoji) {
      textNode.replace($createTextNode(emoji))
    }
  },
  trigger: ':',
  type: 'text-match',
}

const HR: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? '***' : null
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode()

    // TODO: Get rid of isImport flag
    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line)
    } else {
      parentNode.insertBefore(line)
    }
  },
  type: 'element',
}

const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null
    }

    return `![${node.getAltText()}](${node.getSrc()})`
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, alt, src] = match
    const imageNode = $createImageNode({
      src,
      alt,
    })
    textNode.replace(imageNode)
  },
  trigger: ')',
  type: 'text-match',
}

const TWEET: ElementTransformer = {
  dependencies: [TweetNode],
  export: (node) => {
    if (!$isTweetNode(node)) {
      return null
    }

    return `<tweet id="${node.getId()}" />`
  },
  regExp: /<tweet id="([^"]+?)"\s?\/>\s?$/,
  replace: (textNode, _1, match) => {
    const [, id] = match
    const tweetNode = $createTweetNode(id)
    textNode.replace(tweetNode)
  },
  type: 'element',
}

// Very primitive table setup
const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/
const TABLE_ROW_DIVIDER_REG_EXP = /^(?:\|)[- |]+(?:\|)\s?$/

const TABLE: ElementTransformer = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: LexicalNode) => {
    if (!$isTableNode(node)) {
      return null
    }

    const output: string[] = []

    for (const row of node.getChildren()) {
      const rowOutput = []
      if (!$isTableRowNode(row)) {
        continue
      }

      let isHeaderRow = false
      for (const cell of row.getChildren()) {
        // It's TableCellNode so it's just to make flow happy
        if ($isTableCellNode(cell)) {
          rowOutput.push(
            $convertToMarkdownString(markdownTransformers, cell).replace(
              /\n/g,
              '\\n'
            )
          )
          if (cell.__headerState === TableCellHeaderStates.ROW) {
            isHeaderRow = true
          }
        }
      }

      output.push(`| ${rowOutput.join(' | ')} |`)
      if (isHeaderRow) {
        output.push(`| ${rowOutput.map((_) => '---').join(' | ')} |`)
      }
    }

    return output.join('\n')
  },
  regExp: TABLE_ROW_REG_EXP,
  replace: (parentNode, _1, match) => {
    // Header row
    if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
      const table = parentNode.getPreviousSibling()
      if (!table || !$isTableNode(table)) {
        return
      }

      const rows = table.getChildren()
      const lastRow = rows[rows.length - 1]
      if (!lastRow || !$isTableRowNode(lastRow)) {
        return
      }

      // Add header state to row cells
      lastRow.getChildren().forEach((cell) => {
        if (!$isTableCellNode(cell)) {
          return
        }
        cell.toggleHeaderStyle(TableCellHeaderStates.ROW)
      })

      // Remove line
      parentNode.remove()
      return
    }

    const matchCells = mapToTableCells(match[0])

    if (matchCells == null) {
      return
    }

    const rows = [matchCells]
    let sibling = parentNode.getPreviousSibling()
    let maxCells = matchCells.length

    while (sibling) {
      if (!$isParagraphNode(sibling)) {
        break
      }

      if (sibling.getChildrenSize() !== 1) {
        break
      }

      const firstChild = sibling.getFirstChild()

      if (!$isTextNode(firstChild)) {
        break
      }

      const cells = mapToTableCells(firstChild.getTextContent())

      if (cells == null) {
        break
      }

      maxCells = Math.max(maxCells, cells.length)
      rows.unshift(cells)
      const previousSibling = sibling.getPreviousSibling()
      sibling.remove()
      sibling = previousSibling
    }

    const table = $createTableNode()

    for (const cells of rows) {
      const tableRow = $createTableRowNode()
      table.append(tableRow)

      for (let i = 0; i < maxCells; i++) {
        tableRow.append(i < cells.length ? cells[i] : createTableCell(''))
      }
    }

    const previousSibling = parentNode.getPreviousSibling()
    if (
      $isTableNode(previousSibling) &&
      getTableColumnsSize(previousSibling) === maxCells
    ) {
      previousSibling.append(...table.getChildren())
      parentNode.remove()
    } else {
      parentNode.replace(table)
    }
  },
  type: 'element',
}

function getTableColumnsSize(table: TableNode) {
  const row = table.getFirstChild()
  return $isTableRowNode(row) ? row.getChildrenSize() : 0
}

const createTableCell = (textContent: string): TableCellNode => {
  textContent = textContent.replace(/\\n/g, '\n')
  const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
  $convertFromMarkdownString(textContent, markdownTransformers, cell)
  return cell
}

const mapToTableCells = (textContent: string): Array<TableCellNode> | null => {
  const match = textContent.match(TABLE_ROW_REG_EXP)
  if (!match || !match[1]) {
    return null
  }
  return match[1].split('|').map((text) => createTableCell(text))
}

export const markdownTransformers: Array<Transformer> = [
  SIMPLE_LINK,
  TABLE,
  EOL_SLASH,
  EMOJI,
  HR,
  IMAGE,
  TWEET,
  CHECK_LIST,
  ...TRANSFORMERS,
]
