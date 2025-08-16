const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getTodos(): Promise<Todo[]> {
  return apiCall('/todos');
}

export async function createTodo(todo: TodoCreate): Promise<Todo> {
  return apiCall('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

export async function updateTodo(id: string, todo: TodoUpdate): Promise<Todo> {
  return apiCall(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  });
}

export async function deleteTodo(id: string): Promise<void> {
  return apiCall(`/todos/${id}`, {
    method: 'DELETE',
  });
}