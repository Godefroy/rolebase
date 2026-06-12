/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import React from 'react'

import { markdownTransformers } from '@rolebase/editor-legacy'

export default function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={markdownTransformers} />
}
