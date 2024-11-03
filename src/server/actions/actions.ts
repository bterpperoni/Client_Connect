"use server"

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
export async function createTask(data:  Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
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

// Fonction pour supprimer une tâche
export async function deleteTask(id: number): Promise<Task> {
  try {
    const deletedTask = await db.task.delete({
      where: { id },
    });
    return deletedTask;
  } catch (error) {
    throw new Error('Error deleting task');
  }
}



