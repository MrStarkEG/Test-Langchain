'use client'

import { Todo } from '@/lib/api'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No todos yet</div>
        <div className="text-gray-400 text-sm mt-2">Add your first todo above!</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}