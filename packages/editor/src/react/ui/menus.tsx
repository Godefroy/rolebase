import { SuggestionProps } from '@tiptap/suggestion'
import React, { forwardRef } from 'react'
import { FiUser } from 'react-icons/fi'
import { Mentionable } from '../../extensions/Mention'
import { EmojiItem } from '../emojiList'
import { SlashCommandItem } from '../slashItems'
import SuggestionMenu, { SuggestionMenuHandle } from './SuggestionMenu'

export const SlashMenu = forwardRef<
  SuggestionMenuHandle,
  SuggestionProps<SlashCommandItem>
>(function SlashMenu(props, ref) {
  return (
    <SuggestionMenu
      ref={ref}
      items={props.items.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
      }))}
      onSelect={(index) => props.command(props.items[index])}
    />
  )
})

export const MentionMenu = forwardRef<
  SuggestionMenuHandle,
  SuggestionProps<Mentionable>
>(function MentionMenu(props, ref) {
  return (
    <SuggestionMenu
      ref={ref}
      items={props.items.map((item) => ({
        key: item.id,
        label: item.name,
        icon: <FiUser />,
      }))}
      onSelect={(index) => props.command(props.items[index])}
    />
  )
})

export const EmojiMenu = forwardRef<
  SuggestionMenuHandle,
  SuggestionProps<EmojiItem>
>(function EmojiMenu(props, ref) {
  return (
    <SuggestionMenu
      ref={ref}
      items={props.items.map((item) => ({
        key: item.id,
        label: `:${item.id}:`,
        icon: <span className="editor-menu-icon-text">{item.emoji}</span>,
      }))}
      onSelect={(index) => props.command(props.items[index])}
    />
  )
})
