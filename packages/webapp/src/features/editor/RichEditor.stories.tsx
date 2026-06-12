import { Box, Button } from '@chakra-ui/react'
import '@rolebase/editor/src/react/styles.css'
import {
  EditorHandle,
  MentionEntities,
  Mentionable,
  RichEditor,
} from '@rolebase/editor/react'
import { Meta, StoryObj } from '@storybook/react'
import React, { useRef, useState } from 'react'
import { decorators } from 'src/stories'
import '../editor/editorTheme.css'
import EditorContainer from './components/EditorContainer'

const mentionables: Mentionable[] = [
  { id: '1', name: 'Alice Aubry', entity: MentionEntities.Member },
  { id: '2', name: 'Bob Bernard', entity: MentionEntities.Member },
  { id: '3', name: 'Chloé Carlier', entity: MentionEntities.Member },
]

const defaultValue = [
  '# Hello',
  '',
  'This is **markdown** with a [@Alice Aubry](rolebase://member/1) mention.',
  '',
  '- [ ] A task',
  '- [x] Done',
].join('\n')

const meta: Meta<typeof RichEditor> = {
  title: 'RichEditor',
  component: RichEditor,
  decorators,
}

export default meta
type Story = StoryObj<typeof RichEditor>

const fakeUpload = async (file: File) => URL.createObjectURL(file)

export const Simple: Story = {
  render: () => {
    const ref = useRef<EditorHandle>(null)
    const [output, setOutput] = useState('')
    return (
      <Box p={5}>
        <EditorContainer>
          <RichEditor
            ref={ref}
            value={defaultValue}
            placeholder="Type / for commands…"
            mentionables={mentionables}
            onUpload={fakeUpload}
          />
        </EditorContainer>
        <Button mt={3} onClick={() => setOutput(ref.current?.getValue() ?? '')}>
          Get markdown
        </Button>
        <Box as="pre" mt={3} p={3} fontSize="sm" bg="blackAlpha.50">
          {output}
        </Box>
      </Box>
    )
  },
}

export const ReadOnly: Story = {
  render: () => (
    <Box p={5}>
      <RichEditor value={defaultValue} readOnly />
    </Box>
  ),
}
