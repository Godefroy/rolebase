/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Center } from '@chakra-ui/react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { TextNode } from 'lexical'
import throttle from 'lodash.throttle'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { MemberIcon } from 'src/icons'
import { $createMentionNode, MentionEntities } from '@rolebase/editor-legacy'

export interface Mentionable {
  name: string
  entity: MentionEntities
  id: string
}

const TRIGGERS = '@'
const VALID_CHARS = '.*'
const LENGTH_LIMIT = 20

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '(' +
    VALID_CHARS +
    '){0,' +
    LENGTH_LIMIT +
    '})$'
)

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5

function useMentionableSearch(
  mentionables: Mentionable[],
  query: string | null
) {
  const [results, setResults] = useState<Mentionable[]>([])

  const updateThrottle = useMemo(
    () =>
      throttle(
        (query: string) => {
          const results = mentionables.filter((mention) =>
            mention.name.toLowerCase().includes(query.toLowerCase())
          )
          setResults(results)
        },
        300,
        { leading: false }
      ),
    [mentionables]
  )

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    updateThrottle(query)
  }, [updateThrottle, query])

  return results
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number
): QueryMatch | null {
  const match = AtSignMentionsRegex.exec(text)
  if (match === null) return null

  // The strategy ignores leading whitespace but we need to know it's
  // length to add it to the leadOffset
  const maybeLeadingWhitespace = match[1]

  const matchingString = match[3]
  if (!matchingString || matchingString.length < minMatchLength) {
    return null
  }
  return {
    leadOffset: match.index + maybeLeadingWhitespace.length,
    matchingString,
    replaceableString: match[2],
  }
}

class MentionTypeaheadOption extends TypeaheadOption {
  name: string
  entity: MentionEntities
  id: string

  constructor({ name, entity, id }: Mentionable) {
    super(id)
    this.name = name
    this.entity = entity
    this.id = id
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  option: MentionTypeaheadOption
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={`item ${isSelected ? 'selected' : ''}`}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.entity === MentionEntities.Member && (
        <Center mr={2}>
          <MemberIcon size={20} />
        </Center>
      )}
      <span className="text">{option.name}</span>
    </li>
  )
}

interface MentionPluginProps {
  mentionables: Mentionable[]
}

export default function MentionsPlugin({ mentionables }: MentionPluginProps) {
  const [editor] = useLexicalComposerContext()

  const [queryString, setQueryString] = useState<string | null>(null)

  const results = useMentionableSearch(mentionables, queryString)

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const options = useMemo(
    () =>
      results
        .map((result) => new MentionTypeaheadOption(result))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  )

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.entity,
          selectedOption.id,
          selectedOption.name
        )
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        mentionNode.select()
        closeMenu()
      })
    },
    [editor]
  )

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = checkForAtSignMentions(text, 1)
      const slashMatch = checkForSlashTriggerMatch(text, editor)
      return !slashMatch && mentionMatch ? mentionMatch : null
    },
    [checkForSlashTriggerMatch, editor]
  )

  if (!editor.isEditable()) return null

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i)
                        selectOptionAndCleanUp(option)
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i)
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  )
}
