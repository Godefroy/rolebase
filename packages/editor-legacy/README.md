# @rolebase/editor

Headless Lexical editor utilities for Rolebase. Provides node definitions, markdown transformers, and a JSON-to-Markdown conversion function usable in any environment (browser or Node.js).

## Usage

### Convert Lexical JSON to Markdown

```ts
import { exportToMarkdown } from '@rolebase/editor-legacy'

const markdown = exportToMarkdown(lexicalJsonString)
```

### Use nodes and transformers

```ts
import { nodes, markdownTransformers } from '@rolebase/editor-legacy'
```

## Architecture

This package contains the **headless** (non-React) parts of the editor:

- **Nodes**: Lexical node definitions for custom types (Mention, Image, File, Tweet, YouTube, Figma, Collapsible, HorizontalRule, Keyword). Decorator nodes have a no-op `decorate()` method.
- **Transformers**: Markdown import/export transformers (table, image, tweet, emoji, links, horizontal rule).
- **exportToMarkdown**: Creates a headless Lexical editor, parses JSON state, and exports to Markdown.

The webapp (`packages/webapp/src/features/editor`) extends the decorator nodes with React `decorate()` implementations for rendering in the browser.
