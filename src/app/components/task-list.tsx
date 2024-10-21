"use client";

import { ScrollArea } from "$/app/components/ui/scroll-area";
import { deleteTask, getAllTasks } from "$/server/actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "$/app/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "$/app/components/ui/button";
import { Trash, MoreHorizontal, Calendar, CalendarIcon } from "lucide-react";
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
import { updateTaskStatus } from "$/server/actions/actions";
import { Task } from "@prisma/client";
import { cn } from "$/lib/utils/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DialogClose } from "@radix-ui/react-dialog";

type TaskListProps = {
  tasksProps: Task[];
  category: Task["category"];
  classList?: string;
  onEditTask?: (taskId: number) => void;
};

const statusColors: { [key in Task["status"]]: string } = {
  TODO: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
};

export default function TaskListComponent({
  tasksProps,
  classList,
  onEditTask,
  category,
}: TaskListProps) {
  // States
  const [tasks, setTasks] = useState<Task[] | null>(tasksProps);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTasks() {
    setLoading(true);
    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateTaskStatus = async (
    taskId: number,
    status: Task["status"]
  ) => {
    setTasks((prevTasks) =>
      prevTasks
        ? prevTasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
          )
        : null
    );
    try {
      await updateTaskStatus(taskId, status);
      setTasks(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status", error);
    } finally {
    }
  };

  const handleEditTask = (taskId: number) => {
    if (typeof onEditTask === "function") {
      onEditTask(taskId);
    } else {
      console.warn("onEditTask is not defined or a function");
    }
  };

  const filteredTasks = tasks?.filter((task) => task.category === category);

  return (
    <Card className={`${classList} p-0`} key={category}>
      <CardContent>
        {filteredTasks && filteredTasks.length === 0 ? (
          <>
            <CardHeader key={category}>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tasks available for this category.
            </p>
          </>
        ) : (
          <>
            <ScrollArea className="h-80 w-full overflow-hidden">
              {filteredTasks &&
                filteredTasks.map((task) => (
                  <>
                    <CardHeader key={task.id}>
                      <CardTitle className="text-sm flex-col flex-grow  leading-none font-medium">
                        <div className="font-bold">{task.title}</div>
                        <div>
                          {(task.content?.length ?? 0) > 100
                            ? task.content?.substring(0, 100) + ".."
                            : task.content}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <ul className="space-y-2">
                      <li
                        key={task.id}
                        className="flex flex-grow items-center justify-between rounded-lg bg-white p-2 shadow dark:bg-gray-950"
                      >
                        <div className="flex flex-grow items-center space-x-2">
                          <span
                            className={`rounded-full px-1 py-1 text-xs font-semibold ${
                              statusColors[task.status]
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>

                          {/* <div className="flex-grow">
                          <p className="leading-none font-bold text-sm">
                            {task.title}
                          </p>
                        </div> */}
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
                              <DropdownMenuLabel>
                                Update Status
                              </DropdownMenuLabel>
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
                          {/* <Popover>
                            {/* Button that trigger  the popover 
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[40px] pl-3 text-left font-normal text-gray-500 dark:text-gray-400"
                                )}
                              >
                                <Trash
                                  className="h-4 w-4"
                                />
                              </Button>
                            </PopoverTrigger>
                            
                            <PopoverContent
                              className=" bg-black text-white relative w-max h-max p-2"
                              align="start"
                            >
                        
                              <p className="p-2 font-bold text-md">
                                Are you sure?
                              </p>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTask(task.id)}
                              >
                                Yes
                              </Button>
                              <PopoverClose
                                className="absolute w-auto h-auto p-2 rounded-lg border-2 border-spacing-2 border-gray-500 PopoverClose ml-4 scale-100"
                                aria-label="Close"
                              >
                                <Cross2Icon />
                              </PopoverClose>
                            </PopoverContent>
                          </Popover> */}
                          <Dialog>
                            <DialogTrigger>
                              <Trash className="h-4 w-4" />
                            </DialogTrigger>
                            <DialogContent className="items-center flex flex-col justify-center">
                              <DialogHeader className="mt-3 ">
                                <DialogTitle className="text-lg text-center mb-4 font-semibold leading-none tracking-tight">
                                  <span className="text-black-800 space-x-1 space-y-2 text-lg p-3">
                                    Are you sure you want to delete the task ?
                                  </span>
                                  <br />
                                  <div className="text-lg p-0 leading-snug">
                                    This action CANNOT be undone.
                                  </div>
                                </DialogTitle>
                                <DialogDescription>
                                  <p className="text-sm color-gray-600 text-center">
                                    I understood & I am sure to delete the task
                                    is my own responsibility.
                                  </p>
                                </DialogDescription>
                              </DialogHeader>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTask(task.id)}
                                className="bg-red-500 hover:bg-red-700 w-[50%] text-center text-white font-bold py-2 px-4 rounded-full"
                              >
                                Yes
                              </Button>
                              {/* <DialogClose
                                className="absolute w-auto h-auto p-2 rounded-lg border-2  border-gray-500 PopoverClose ml-4 scale-100"
                                aria-label="Close"
                              >
                                <Cross2Icon />
                              </DialogClose> */}
                            </DialogContent>
                          </Dialog>
                          <span className="sr-only">Delete task</span>
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
