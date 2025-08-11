'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: { completed?: boolean; title?: string; description?: string }) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 ${todo.completed ? 'bg-gray-100' : 'bg-white'} shadow-sm`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description (optional)"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={toggleCompleted}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Created: {new Date(todo.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}