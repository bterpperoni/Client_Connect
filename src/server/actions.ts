// @ts-nocheck
"use server";

import {db} from "$/server/db";
import { Task, TaskCategory, TaskStatus, User } from "@prisma/client";
import { isPasswordValid, saltAndHashPassword } from "$/lib/utils/password";

//. Fonction pour récupérer toutes les tâches
export async function getAllTasks(): Promise<Task[]> {
  try {
    const tasks = await db.task.findMany();
    return tasks;
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
}

//. Fonction pour récupérer une tâche par ID
export async function getTaskById(id: number): Promise<Task | null> {
  try {
    const task = await db.task.findUnique({ where: { id } });
    return task;
  } catch (error) {
    throw new Error("Error fetching task");
  }
}

//. Fonction pour créer une nouvelle tâche
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

//. Fonction pour mettre à jour le statut d'une tâche
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

//. Fonction pour mettre à jour les autres données d'une tâche
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

//.. Fonction pour supprimer une tâche
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

export async function insertTasks() {
  const tasks = [
    // Offensive Tasks
    {
      title: "Penetration Testing for New System",
      content:
        "Perform penetration testing to identify vulnerabilities in the newly deployed infrastructure.",
      importanceScore: 5,
      deadline: new Date("2024-11-15T12:00:00Z"),
      status: TaskStatus.TODO,
      category: TaskCategory.Offensive,
    },
    {
      title: "Deploy AI-Driven Security Monitoring",
      content:
        "Implement AI-based monitoring tools to detect and predict potential security threats.",
      importanceScore: 1,
      deadline: new Date("2024-12-01T10:00:00Z"),
      status: TaskStatus.TODO,
      category: TaskCategory.Offensive,
    },
    // Additional Tasks
    {
      title: "Monthly Security Audit",
      content:
        "Perform routine monthly audit of all security policies and access controls.",
      importanceScore: 2,
      deadline: new Date("2024-10-31T12:00:00Z"),
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.General,
    },
    {
      title: "Install DDoS Protection",
      content:
        "Set up DDoS protection to safeguard critical infrastructure from distributed denial-of-service attacks.",
      importanceScore: 3,
      deadline: new Date("2024-11-01T18:00:00Z"),
      status: TaskStatus.TODO,
      category: TaskCategory.Defensive,
    },
    {
      title: "Backup and Disaster Recovery Planning",
      content:
        "Review and update disaster recovery plans and perform regular backup tests.",
      importanceScore: 4,
      deadline: new Date("2024-10-25T12:00:00Z"),
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.Defensive,
    },
    {
      title: "Upgrade Firewall System",
      content:
        "Install and configure next-gen firewall with advanced intrusion prevention capabilities.",
      importanceScore: 3,
      deadline: new Date("2024-11-10T15:00:00Z"),
      status: TaskStatus.TODO,
      category: TaskCategory.Offensive,
    },
    {
      title: "User Access Review",
      content:
        "Review and update user access levels across systems to ensure proper permissions.",
      importanceScore: 5,
      deadline: new Date("2024-11-05T10:00:00Z"),
      category: TaskCategory.General,
      status: TaskStatus.TODO,
    },
  ];

  try {
    for (const task of tasks) {
      await db.task.create({
        data: {
          title: task.title,
          content: task.content,
          importanceScore: task.importanceScore,
          deadline: task.deadline,
          category: task.category as TaskCategory,
          status: task.status as TaskStatus,
        },
      });
    }
    console.log("All tasks have been inserted successfully.");
  } catch (error) {
    console.error("Error inserting tasks:", error);
  } finally {
    await db.$disconnect();
  }
}
