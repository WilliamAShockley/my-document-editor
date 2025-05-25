import { Extension } from '@tiptap/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance } from 'tippy.js'
import { CommandMenu, CommandItem } from './CommandMenu'

export const commands: CommandItem[] = [
  {
    title: 'Heading 1',
    command: 'heading1',
    description: 'Large section heading',
  },
  {
    title: 'Heading 2',
    command: 'heading2',
    description: 'Medium section heading',
  },
  {
    title: 'Heading 3',
    command: 'heading3',
    description: 'Small section heading',
  },
  {
    title: 'Bullet List',
    command: 'bulletList',
    description: 'Create a simple bullet list',
  },
  {
    title: 'Numbered List',
    command: 'orderedList',
    description: 'Create a numbered list',
  },
  {
    title: 'Task List',
    command: 'taskList',
    description: 'Create a todo list with checkboxes',
  },
  {
    title: 'Code Block',
    command: 'codeBlock',
    description: 'Add a code snippet with syntax highlighting',
  },
  {
    title: 'Quote',
    command: 'blockquote',
    description: 'Add a blockquote',
  },
  {
    title: 'Divider',
    command: 'horizontalRule',
    description: 'Add a horizontal divider',
  },
  {
    title: 'Table',
    command: 'table',
    description: 'Insert a table',
  },
]

const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      } as Partial<SuggestionOptions>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return commands.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let component: ReactRenderer | null = null
          let popup: Instance | null = null

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandMenu, {
                props,
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })[0]
            },

            onUpdate(props: any) {
              component?.updateProps(props)

              if (popup) {
                popup.setProps({
                  getReferenceClientRect: props.clientRect,
                })
              }
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup?.hide()
                return true
              }

              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit() {
              popup?.destroy()
              component?.destroy()
            },
          }
        },
      }),
    ]
  },
})

export default SlashCommands