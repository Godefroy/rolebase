import { Editor } from '@tiptap/core'

export type UploadFn = (file: File) => Promise<string>

// Open the native file picker
export function pickFile(accept?: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    if (accept) input.accept = accept
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.click()
  })
}

// Upload a file and insert it as an image or file attachment
export async function uploadAndInsert(
  editor: Editor,
  file: File,
  upload: UploadFn,
  position?: number
) {
  const url = await upload(file)
  if (!url) return
  const node = file.type.startsWith('image/')
    ? { type: 'image', attrs: { src: url, alt: file.name } }
    : {
        type: 'file',
        attrs: { url, name: file.name, size: file.size, mime: file.type },
      }
  if (position !== undefined) {
    editor.chain().focus().insertContentAt(position, node).run()
  } else {
    editor.chain().focus().insertContent(node).run()
  }
}
