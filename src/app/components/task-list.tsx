"use client";

import { ScrollArea } from "$/app/components/ui/scroll-area";

import { useState, useEffect } from "react";
import { Button } from "$/app/components/ui/button";
import { Trash, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "$/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "$/app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "$/app/components/ui/dropdown-menu";
import { TaskCategory, type Task } from "@prisma/client";
import CustomModal from "./ui/modal";
import { fetchTasks } from "$/server/actions/actions"

type TaskListProps = {
  tasks: Task[];
  category: Task["category"];
  classList?: string;
  onEditTask?: (taskId: number) => void;
  onUpdateTaskStatus?: (taskId: number, status: Task["status"]) => void;
};

const statusColors: { [key in Task["status"]]: string } = {
  TODO: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
};

export default function TaskListComponent({
  tasks: initialTasks,
  classList,
  onEditTask,
}: TaskListProps) {


  const [isModalOpen, setIsModalOpen] = useState(false);

// States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Task form fields
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [importanceScore, setImportanceScore] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.General);

useEffect(() => {
    async function loadTasks() {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: number, status: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) => (task.id === taskId ? { ...task, status } : task)
      ),
    );
  };

  const handleEditTask = (taskId: number) => {
    if (typeof onEditTask === "function") {
      onEditTask(taskId);
    } else {
      console.warn("onEditTask is not defined or a function");
    }
  };


  const filteredTasks = tasks.filter((task) => task.category === category);

  return (
    <Card className={classList}>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tasks available for this category.
            </p>
          </>
        ) : (
          <>
            <ScrollArea className="h-72 w-auto rounded-md border">
              {filteredTasks.map((task) => (
                <>
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                  </CardHeader>
                  <ul className="space-y-2">
                    <li
                      key={task.id}
                      className="flex items-center justify-between rounded-lg bg-white p-2 shadow dark:bg-gray-950"
                    >
                      <div className="flex flex-grow items-center space-x-2">
                        <span
                          className={`rounded-full px-1 py-1 text-xs font-semibold ${statusColors[task.status]}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        <div className="flex-grow">
                          <p className="text-sm font-medium leading-none">
                            {task.content?.substring(0, 20) + ".."}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-3 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => handleEditTask(task.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Select
                                value={task.status}
                                onValueChange={(value: Task["status"]) =>
                                  handleUpdateTaskStatus(task.id, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TODO">Todo</SelectItem>
                                  <SelectItem value="IN_PROGRESS">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="DONE">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon">
                          <Trash
                            className="h-4 w-4"
                            onClick={() => openModal()}
                          />
                          <CustomModal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            title=""
                          >
                            <div className="mt-20 items-center justify-center">
                              <span className="bold text-xl">
                                Are you sure you want to delete this task?
                              </span>
                              <br />
                              <Button
                                onClick={() => {
                                  closeModal();
                                }}
                                className="px mr-5 rounded-full border-2 border-black bg-red-700 py-2 font-bold text-white hover:bg-red-600"
                              >
                                Yes
                              </Button>
                              <Button
                                className="px rounded-full border-2 border-black bg-green-700 py-2 font-bold text-white hover:bg-green-600"
                                onClick={closeModal}
                              >
                                No
                              </Button>
                            </div>
                          </CustomModal>
                          <span className="sr-only">Delete task</span>
                        </Button>
                      </div>
                    </li>
                  </ul>
                </>
              ))}
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
