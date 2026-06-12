import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { FiDownload, FiFile, FiFileText, FiFilm, FiMusic } from 'react-icons/fi'

function formatSize(size: number): string {
  if (!size) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ mime }: { mime: string }) {
  if (mime.startsWith('video/')) return <FiFilm />
  if (mime.startsWith('audio/')) return <FiMusic />
  if (mime.startsWith('text/') || mime === 'application/pdf') {
    return <FiFileText />
  }
  return <FiFile />
}

export default function FileCard({ node }: NodeViewProps) {
  const { url, name, size, mime } = node.attrs

  return (
    <NodeViewWrapper as="span" className="editor-file-card" data-drag-handle>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        contentEditable={false}
        draggable={false}
      >
        <FileIcon mime={mime} />
        <span className="editor-file-name">{name}</span>
        {size > 0 && (
          <span className="editor-file-size">{formatSize(size)}</span>
        )}
        <FiDownload className="editor-file-download" />
      </a>
    </NodeViewWrapper>
  )
}
