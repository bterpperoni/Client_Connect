// "use server"

// import { Task, TaskStatus, TaskCategory } from '@prisma/client';

// const API_BASE_URL = '/api/tasks';

// // Fetch all tasks
// export async function fetchTasks(): Promise<Task[]> {
//   const response = await fetch(API_BASE_URL);
//   if (!response.ok) {
//     throw new Error('Error fetching tasks');
//   }
//   return await response.json();
// }

// // Fetch task by ID
// export async function fetchTaskById(id: number): Promise<Task> {
//   const response = await fetch(`${API_BASE_URL}/${id}`);
//   if (!response.ok) {
//     throw new Error('Task not found');
//   }
//   return await response.json();
// }

// // Create a new task
// // Omit permet de retirer des propriétés d'un type ou d'une interface
// export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
//   const response = await fetch(API_BASE_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(task),
//   });
//   if (!response.ok) {
//     throw new Error('Error creating task');
//   }
//   return await response.json();
// }

// // Update task status
// export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ status }),
//   });
//   if (!response.ok) {
//     throw new Error('Error updating task status');
//   }
//   return await response.json();
// }

// // Update task data (other than status)
// export async function updateTaskData(
//   id: number,
//   updatedData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>>
// ): Promise<Task> {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(updatedData),
//   });
//   if (!response.ok) {
//     throw new Error('Error updating task');
//   }
//   return await response.json();
// }

// app/actions.ts
import {db} from '$/server/db' ;
import { Task, TaskStatus, TaskCategory } from '@prisma/client';

// Fonction pour récupérer toutes les tâches
export async function getAllTasks(): Promise<Task[]> {
  try {
    const tasks = await db.task.findMany();
    return tasks;
  } catch (error) {
    throw new Error('Error fetching tasks');
  }
}

// Fonction pour récupérer une tâche par ID
export async function getTaskById(id: number): Promise<Task | null> {
  try {
    const task = await db.task.findUnique({ where: { id } });
    return task;
  } catch (error) {
    throw new Error('Error fetching task');
  }
}

// Fonction pour créer une nouvelle tâche
export async function createTask(data: {
  title: string;
  content: string;
  importanceScore: number;
  deadline?: Date | null;
  status: TaskStatus;
  category: TaskCategory;
}): Promise<Task> {
  try {
    const newTask = await db.task.create({
      data,
    });
    return newTask;
  } catch (error) {
    throw new Error('Error creating task');
  }
}

// Fonction pour mettre à jour le statut d'une tâche
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data: { status },
    });
    return updatedTask;
  } catch (error) {
    throw new Error('Error updating task status');
  }
}

// Fonction pour mettre à jour les autres données d'une tâche
export async function updateTaskData(id: number, data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> {
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data,
    });
    return updatedTask;
  } catch (error) {
    throw new Error('Error updating task data');
  }
}

