"use client";

import { ScrollArea } from "$/app/_components/ui/scroll-area";
import { deleteTask, updateTaskStatus } from "$/server/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "$/app/_components/ui/dialog";
import React, { useEffect } from "react";
import { Button } from "$/app/_components/ui/button";
import { Trash, MoreHorizontal, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "$/app/_components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "$/app/_components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "$/app/_components/ui/dropdown-menu";
import { Task } from "@prisma/client";
import Loader from "./ui/loader";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import NotificationPopover from "./notification";
// import { useStore } from "$/stores/useStore";

//? -----------------------------------------------------------
type TaskListProps = {
  tasksProps: Task[];
  category: Task["category"];
  classList?: string;
  onEditTask?: (taskId: number) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const statusColors: { [key in Task["status"]]: string } = {
  TODO: "!bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "!bg-blue-100 text-blue-800",
  DONE: "!bg-green-100 text-green-800",
};


//? -----------------------------------------------------------

export default function TaskListComponent({
  tasksProps,
  classList,
  onEditTask,
  category,
  setTasks,
}: TaskListProps) {
  const queryClient = new QueryClient();
  const { data: session } = useSession();
  const [notifications, setNotifications] = React.useState<Task[]>([]);

  //!--------------DELETE TASK -----------------
  const mutationDelete = useMutation(deleteTask, {
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDeleteTask = async (taskId: number) => {
    try {
      await mutationDelete.mutateAsync(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  //!--------------UPDATE TASK STATUS MUTATION -------
  const mutationUpdateStatus = useMutation(
    ({ id, status }: { id: number; status: Task["status"] }) =>
      updateTaskStatus(id, status),
    {
      onSuccess: () => {
        toast.success("Task status updated successfully").toLocaleString();
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );

  //!------------- Update Task Status-------------------
  const handleUpdateTaskStatus = async (
    taskId: number,
    status: Task["status"]
  ) => {
    try {
      await mutationUpdateStatus.mutateAsync({ id: taskId, status });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
      console.log("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  const filteredTasks = tasksProps.filter((task) => task.category === category);


  //? ----------------------------------------
  //?--------------RENDER --------
  //?-----------------------------------------
  if (!tasksProps) {
    return (
      <div className="flex flex-col items-center justify-centers w-full ">
        <Loader size={10} />
      </div>
    );
  }

  return (
    <Card className={`${classList} p-0`} key={category}>
      <CardContent>
        {/* Notification Bar
        {notifications.length > 0 && (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
            <h3 className="font-bold">Upcoming Deadlines</h3>
            <ul>
              {notifications.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong>: Due on{" "}
                  {task.deadline?.toLocaleDateString() || "No deadline"}.
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {/* <NotificationPopover notifications={notifications} /> */}
        {filteredTasks.length === 0 ? (
          <>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <div className="text-center text-gray-500 dark:text-gray-400">
              No tasks available for this category.
            </div>
          </>
        ) : (
          <ScrollArea className="absolute h-[21rem] w-full overflow-hidden">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="my-2">
                <CardHeader className="p-5">
                  <CardTitle className="text-sm flex-col flex-grow leading-none font-medium">
                    <div className="font-bold">{task.title}</div>
                    <div>
                      {(task.content?.length ?? 0) > 100
                        ? task.content?.substring(0, 100) + ".."
                        : task.content}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li
                      className={`flex flex-grow items-center justify-between rounded-lg  p-2 shadow dark:bg-gray-950 ${
                        statusColors[task.status]
                      }`}>
                      <div className="flex flex-grow items-center space-x-2">
                        <span
                          className={`rounded-full px-1 py-1 text-xs font-semibold ${
                            statusColors[task.status]
                          }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex justify-center items-center">
                        <Calendar className="h-4 w-4 mx-2" />
                        <span className="text-xs text-gray-500 text-center">
                          {task.deadline
                            ? task.deadline.toDateString()
                            : "No deadline"}
                        </span>
                      </div>
                      {session && (
                        <div className="flex space-x-1 mx-2">
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
                                onClick={() => onEditTask?.(task.id)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Update Status
                              </DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Select
                                  value={task.status}
                                  onValueChange={async (
                                    value: Task["status"]
                                  ) =>
                                    await handleUpdateTaskStatus(task.id, value)
                                  }>
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
                          <Dialog
                            aria-labelledby="dialog-title"
                            aria-describedby="dialog-description">
                            <DialogTrigger>
                              <Trash className="h-4 w-4" />
                            </DialogTrigger>
                            <DialogContent className="items-center flex flex-col justify-center">
                              <DialogHeader className="mt-2 ">
                                <DialogTitle
                                  id="dialog-title"
                                  className="text-lg text-center mb-4 leading-none tracking-tight flex items-center justify-center flex-col">
                                  <div className="text-lg font-sans text-gray-600 p-2 leading-snug border-b-2 mt-2 w-max border-red-800">
                                    Are you sure you ?
                                  </div>
                                  <br />
                                  <span className="text-black-800 font-light space-x-1 text-2xl p-1">
                                    This Task will be deleted :
                                  </span>
                                  <span className="text-red-800 font-bold text-2xl p-1">
                                    {task.title}
                                  </span>
                                </DialogTitle>
                                <DialogDescription id="dialog-description">
                                  <div className="text-sm color-gray-600 text-center">
                                    This action cannot be undone.
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                              <Button
                                onClick={async () =>
                                  await handleDeleteTask(task.id)
                                }
                                className="bg-red-500 hover:bg-red-700 w-[50%] text-center text-white font-bold py-2 px-4 rounded-full">
                                Yes
                              </Button>
                            </DialogContent>
                          </Dialog>
                          <span className="sr-only">Delete task</span>
                        </div>
                      )}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
