// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { db } from '$/server/db';
import { Task } from '@prisma/client'; // Le type Task

// GET all tasks
export async function GET(): Promise<NextResponse> {
  try {
    const tasks: Task[] = await db.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tasks', error }, { status: 500 });
  }
}

// POST create a new task
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { title, content, importanceScore, deadline, status, category } = body;

    const newTask: Task = await db.task.create({
      data: {
        title,
        content,
        importanceScore: importanceScore || 0,
        deadline: deadline ? new Date(deadline) : null,
        status,
        category,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating task', error }, { status: 500 });
  }
}
