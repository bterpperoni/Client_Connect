

import { Task, TaskStatus, TaskCategory } from '@prisma/client';

const API_BASE_URL = '/api/tasks';

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Error fetching tasks');
  }
  return await response.json();
}

// Fetch task by ID
export async function fetchTaskById(id: number): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Task not found');
  }
  return await response.json();
}

// Create a new task
export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Error creating task');
  }
  return await response.json();
}

// Update task status
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Error updating task status');
  }
  return await response.json();
}

// Update task data (other than status)
export async function updateTaskData(
  id: number,
  updatedData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>>
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error('Error updating task');
  }
  return await response.json();
}
