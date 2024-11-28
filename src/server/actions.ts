"use server";
// app/actions.ts
import { db } from "$/server/db";
import { Task, TaskStatus } from "@prisma/client";
import { hashPassword } from "$/lib/utils/password";
import { signIn } from "next-auth/react";
import AuthError from "next-auth";
import type { LoginFormData } from "$/app/login/page";

// Fonction pour récupérer toutes les tâches
export async function getAllTasks(): Promise<Task[]> {
  try {
    const tasks = await db.task.findMany();
    return tasks;
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
}

// Fonction pour récupérer une tâche par ID
export async function getTaskById(id: number): Promise<Task | null> {
  try {
    const task = await db.task.findUnique({ where: { id } });
    return task;
  } catch (error) {
    throw new Error("Error fetching task");
  }
}

// Fonction pour créer une nouvelle tâche
export async function createTask(
  data: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<Task> {
  try {
    const newTask = await db.task.create({
      data,
    });
    return newTask;
  } catch (error) {
    throw new Error("Error creating task");
  }
}

// Fonction pour mettre à jour le statut d'une tâche
export async function updateTaskStatus(
  id: number,
  status: TaskStatus
): Promise<Task> {
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data: { status },
    });
    return updatedTask;
  } catch (error) {
    throw new Error("Error updating task status");
  }
}

// Fonction pour mettre à jour les autres données d'une tâche
export async function updateTaskData(
  id: number,
  data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
): Promise<Task> {
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data,
    });
    return updatedTask;
  } catch (error) {
    throw new Error("Error updating task data");
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
    throw new Error("Error deleting task");
  }
}

export async function createUser(): Promise<void> {
  const password = await hashPassword("bite");
  const user = await db.user.create({
    data: {
      email: "maxime.curon@risk-horizon.be",
      password,
      accounts: {
        create: {
          provider: "credentials",
          providerAccountId: "1",
          type: "email",
        },
      },
    },
  });
}

export async function authenticate(formData: LoginFormData) {
  
}
