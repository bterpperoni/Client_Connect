// import { NextResponse } from 'next/server';
// import { db } from '$/server/db';
// import { Task, TaskStatus, TaskCategory } from '@prisma/client';

// // GET a task by ID
// export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     const taskId = parseInt(params.id);
//     const task: Task | null = await db.task.findUnique({
//       where: { id: taskId },
//     });

//     if (!task) {
//       return NextResponse.json({ message: 'Task not found' }, { status: 404 });
//     }

//     return NextResponse.json(task);
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching task', error }, { status: 500 });
//   }
// }

// // PATCH update task status
// export async function PATCH(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     const taskId = parseInt(params.id);
//     const body = await request.json();
//     const { status }: { status: TaskStatus } = body;

//     const updatedTask: Task = await db.task.update({
//       where: { id: taskId },
//       data: { status },
//     });

//     return NextResponse.json(updatedTask);
//   } catch (error) {
//     return NextResponse.json({ message: 'Error updating task status', error }, { status: 500 });
//   }
// }

// // PUT update task data (other than status)
// export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     const taskId = parseInt(params.id);
//     const body = await request.json();
//     const { title, content, importanceScore, deadline, category }: 
//       { title: string; content: string | null; importanceScore: number; deadline: string | null; category: TaskCategory } = body;

//     const updatedTask: Task = await db.task.update({
//       where: { id: taskId },
//       data: {
//         title,
//         content,
//         importanceScore: importanceScore || 0,
//         deadline: deadline ? new Date(deadline) : null,
//         category,
//       },
//     });

//     return NextResponse.json(updatedTask);
//   } catch (error) {
//     return NextResponse.json({ message: 'Error updating task data', error }, { status: 500 });
//   }
// }
