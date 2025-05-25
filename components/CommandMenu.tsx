import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Command } from 'lucide-react'

export interface CommandItem {
  title: string
  command: string
  description: string
}

interface CommandMenuProps {
  items: CommandItem[]
  onSelect: (item: CommandItem) => void
}

export const CommandMenu = forwardRef<any, CommandMenuProps>(
  ({ items, onSelect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prevIndex) => 
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
          )
          return true
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((prevIndex) => 
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
          )
          return true
        }

        if (event.key === 'Enter') {
          onSelect(items[selectedIndex])
          return true
        }

        return false
      },
    }))

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    return (
      <div className="z-50 min-w-[320px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b border-gray-200">
          Commands
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {items.map((item, index) => (
            <button
              key={item.command}
              onClick={() => onSelect(item)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
                <Command className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }
)

CommandMenu.displayName = 'CommandMenu'