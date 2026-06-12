import {
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Meta, StoryObj } from '@storybook/react'
import { readFile } from '@utils/readFile'
import { nanoid } from 'nanoid'
import React, { useRef, useState } from 'react'
import { FiArrowDown, FiArrowUp, FiCheckSquare, FiList } from 'react-icons/fi'
import { decorators } from '../../../stories'
import { DUMMY_MARKDOWN } from './dummies/dummy-markdown'
import DUMMY_USERNAMES from './dummies/dummy-usernames.json'
import DUMMY_VALUE from './dummies/dummy-value.json'
import { MentionEntities } from '@rolebase/editor-legacy'
import { EditorHandle } from './plugins/EditorRefPlugin'
import { Mentionable } from './plugins/MentionsPlugin'
import Editor, { RichEditorProps } from './RichEditor'

// Dummy values
const dummyValueString = JSON.stringify(DUMMY_VALUE)
const dummyMentionables = DUMMY_USERNAMES.map(
  (username): Mentionable => ({
    id: nanoid(6),
    name: username,
    entity: MentionEntities.Member,
  })
)
const placeholder = 'Enter some text...'

function getDummyUsername() {
  return DUMMY_USERNAMES[Math.floor(Math.random() * DUMMY_USERNAMES.length)]
}

export default {
  title: 'RichEditor',
  component: Editor,
  decorators,
} as Meta<typeof Editor>

const Template: StoryObj<typeof Editor> = {
  render: (args) => {
    return (
      <Editor mentionables={dummyMentionables} onUpload={onUpload} {...args} />
    )
  },
}

export const Placeholder = {
  ...Template,
  args: {
    placeholder,
  },
}

export const Autofocus = {
  ...Template,
  args: {
    autoFocus: true,
  },
}

export const MinHeight = {
  ...Template,
  args: {
    minH: '4em',
  },
}

export const MaxHeight = {
  ...Template,
  args: {
    maxH: '200px',
    value: dummyValueString,
  },
}

export const Readonly = {
  ...Template,
  args: {
    readOnly: true,
    value: dummyValueString,
  },
}

export const ReadonlyEmpty = {
  ...Template,
  args: {
    readOnly: true,
    placeholder,
    value: '',
  },
}

export const Markdown: StoryObj<typeof Editor> = {
  render: (args) => {
    const ref = useRef<EditorHandle>(null)
    const [result, setResult] = useState('')

    return (
      <>
        <Editor ref={ref} {...args} />

        <ButtonGroup size="sm" my={2}>
          <Button
            leftIcon={<FiArrowDown />}
            onClick={() =>
              ref.current && setResult(ref.current?.exportMarkdown())
            }
          >
            Get
          </Button>
          <Button
            leftIcon={<FiArrowUp />}
            onClick={() => ref.current?.importMarkdown(result)}
          >
            Set
          </Button>
        </ButtonGroup>

        <Textarea value={result} onChange={(e) => setResult(e.target.value)} />
      </>
    )
  },
  args: {
    value: DUMMY_MARKDOWN,
  },
}

export const Collab = {
  ...Template,
  args: {
    id: 'storybook-rich-editor',
    collaboration: true,
    username: getDummyUsername(),
  },
}

export const CollabMarkdown = {
  ...Template,
  args: {
    id: 'storybook-rich-editor-markdown',
    value: DUMMY_MARKDOWN,
    collaboration: true,
    username: getDummyUsername(),
  },
}

export const Multiple: StoryObj<typeof Editor> = {
  render: (args) => {
    const props: RichEditorProps = {
      maxH: '200px',
      mentionables: dummyMentionables,
      onUpload,
      ...args,
    }

    return (
      <VStack align="stretch">
        <Editor value="Editor 1" {...props} username={getDummyUsername()} />
        <Editor value="Editor 2" {...props} username={getDummyUsername()} />
        <Editor value="Editor 3" {...props} username={getDummyUsername()} />
      </VStack>
    )
  },
}

export const MultipleCollab = {
  ...Multiple,
  args: {
    id: 'storybook-rich-editor-markdown',
    collaboration: true,
  },
}

export const EditorRef: StoryObj<typeof Editor> = {
  render: (args) => {
    const ref = useRef<EditorHandle>(null)
    const [result, setResult] = useState('')

    return (
      <>
        <Editor
          ref={ref}
          value={dummyValueString}
          maxH="300px"
          mentionables={dummyMentionables}
          onUpload={onUpload}
          {...args}
        />

        <ButtonGroup size="sm" my={2}>
          <Button
            leftIcon={<FiArrowDown />}
            onClick={() => ref.current && setResult(ref.current?.getValue())}
          >
            Get
          </Button>
          <Button
            leftIcon={<FiArrowUp />}
            onClick={() => ref.current?.setValue(result)}
          >
            Set
          </Button>
          <Button
            leftIcon={<FiList />}
            onClick={() => ref.current?.addBulletList()}
          >
            Add Bullet
          </Button>
          <Button
            leftIcon={<FiCheckSquare />}
            onClick={() => ref.current?.addCheckboxList()}
          >
            Add Checkbox
          </Button>
        </ButtonGroup>

        <Textarea value={result} onChange={(e) => setResult(e.target.value)} />
      </>
    )
  },
}

export const InModal: StoryObj<typeof Editor> = {
  render: (args) => {
    const modal = useDisclosure()
    return (
      <>
        <Button onClick={modal.onOpen}>Open Modal</Button>
        <Modal size="xl" isOpen={modal.isOpen} onClose={modal.onOpen}>
          <ModalOverlay />
          <ModalContent>
            <Editor
              value={dummyValueString}
              mentionables={dummyMentionables}
              onUpload={onUpload}
              {...args}
            />
          </ModalContent>
        </Modal>
      </>
    )
  },
}

// Mock file upload
const onUpload = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 400)) // Simulate a newtork delay
  const url = await readFile(file)
  if (!url) throw new Error('Failed to read file')
  return url
}
