"use server"

import { saltAndHashPassword } from '$/lib/utils/password';
// app/actions.ts
import {db} from '$/server/db' ;
import { Task, TaskStatus } from '@prisma/client';

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


export async function createUser(): Promise<void> {
await db.user.createMany({
  data: [
    {
      id: 'cku1g02xg0001z3vy8n5rj1hf',
      name: 'Maxime Curon',
      email: 'maxime.curon@risk-horizon.be',
      password: await saltAndHashPassword('Test123*'),
      createdAt: new Date('2024-11-17T12:00:00Z'),
    },
  ],
});

await db.account.createMany({
  data: [
    {
      id: 'cm3m3idw100000cmn005gdoos',
      userId: 'cku1g02xg0001z3vy8n5rj1hf',
      type: 'credentials',
      provider: 'email',
      providerAccountId: 'maxime.curon@risk-horizon.be',
      access_token: 'token_12345',
      refresh_token: 'refresh_12345',
      expires_at: 1690024000,
    },
  ],
});

await db.session.createMany({
  data: [
    {
      id: 'cm3m3jj7700010cmn420va6mq',
      sessionToken: 'token_abcdef123',
      userId: 'cku1g02xg0001z3vy8n5rj1hf',
      expires: new Date('2024-11-18T12:00:00Z'),
    },
  ],
});
}