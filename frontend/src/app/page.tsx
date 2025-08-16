'use client'

import { useState, useEffect } from 'react'
import { TodoList } from '@/components/TodoList'
import { TodoForm } from '@/components/TodoForm'
import { getTodos, createTodo, updateTodo, deleteTodo, Todo, TodoCreate } from '@/lib/api'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await getTodos()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError('Failed to load todos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async (todoData: TodoCreate) => {
    try {
      const newTodo = await createTodo(todoData)
      setTodos(prev => [...prev, newTodo])
      setError(null)
    } catch (err) {
      setError('Failed to create todo')
      console.error(err)
    }
  }

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, { completed })
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
      setError(null)
    } catch (err) {
      setError('Failed to update todo')
      console.error(err)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo.id !== id))
      setError(null)
    } catch (err) {
      setError('Failed to delete todo')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Todo List
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <TodoForm onSubmit={handleCreateTodo} />
      
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading todos...</div>
        </div>
      ) : (
        <TodoList 
          todos={todos}
          onToggle={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  )
}