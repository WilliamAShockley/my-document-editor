'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Table as TableIcon,
} from 'lucide-react'
import SlashCommands, { commands as slashCommands } from './SlashCommands'
import { CommandItem } from './CommandMenu'

interface EditorToolbarProps {
  editor: any
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Heading 2',
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Numbered List',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      tooltip: 'Quote',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      tooltip: 'Code Block',
    },
    {
      icon: TableIcon,
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      isActive: false,
      tooltip: 'Insert Table',
    },
  ]

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-2 sticky top-0 z-40">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <div className="flex items-center gap-1 ml-4">
          {buttons.map((button, index) => {
            const Icon = button.icon
            return (
              <button
                key={index}
                onClick={button.action}
                className={`p-2 rounded hover:bg-gray-100 ${
                  button.isActive ? 'bg-gray-100 text-blue-600' : ''
                }`}
                title={button.tooltip}
              >
                <Icon className="h-4 w-4" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DocumentEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing or type "/" for commands...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      SlashCommands.configure({
        suggestion: {
          items: ({ query }: { query: string }) => {
            return slashCommands.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            )
          },
          command: ({ editor, range, props }: any) => {
            const { command } = props as CommandItem

            if (command === 'heading1') {
              editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
            } else if (command === 'heading2') {
              editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
            } else if (command === 'heading3') {
              editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
            } else if (command === 'bulletList') {
              editor.chain().focus().deleteRange(range).toggleBulletList().run()
            } else if (command === 'orderedList') {
              editor.chain().focus().deleteRange(range).toggleOrderedList().run()
            } else if (command === 'taskList') {
              editor.chain().focus().deleteRange(range).toggleTaskList().run()
            } else if (command === 'codeBlock') {
              editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
            } else if (command === 'blockquote') {
              editor.chain().focus().deleteRange(range).toggleBlockquote().run()
            } else if (command === 'horizontalRule') {
              editor.chain().focus().deleteRange(range).setHorizontalRule().run()
            } else if (command === 'table') {
              editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          },
        },
      }),
    ],
    content: `
      <h1>Welcome to Your Document Editor</h1>
      <p>This is a modern document editor with embedded commands. Try typing "/" to see available commands!</p>
      <p>You can also use the toolbar above or keyboard shortcuts:</p>
      <ul>
        <li><strong>Bold:</strong> Cmd/Ctrl + B</li>
        <li><strong>Italic:</strong> Cmd/Ctrl + I</li>
        <li><strong>Undo:</strong> Cmd/Ctrl + Z</li>
        <li><strong>Redo:</strong> Cmd/Ctrl + Shift + Z</li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] px-8 py-6',
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8">
        <EditorToolbar editor={editor} />
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}