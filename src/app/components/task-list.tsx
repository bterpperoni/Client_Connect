// "use client";

// import { ScrollArea } from "$/app/components/ui/scroll-area";

// import { deleteTask, getAllTasks } from "$/server/actions/actions";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "$/app/components/ui/dialog";

// import React, { useState, useEffect } from "react";
// import { Button } from "$/app/components/ui/button";
// import { Trash, MoreHorizontal, Calendar, CalendarIcon } from "lucide-react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "$/app/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "$/app/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "$/app/components/ui/dropdown-menu";
// import { updateTaskStatus } from "$/server/actions/actions";
// import { Task } from "@prisma/client";

// import { DialogClose } from "@radix-ui/react-dialog";
// import Loader from "./ui/loader";
// import { useSession } from "next-auth/react";
// import { useMutation, useQuery, useQueryClient } from "react-query";

// type TaskListProps = {
//   category: Task["category"];
//   classList?: string;
//   onEditTask?: (taskId: number) => void;
// };

// const statusColors: { [key in Task["status"]]: string } = {
//   TODO: "bg-yellow-100 text-yellow-800",
//   IN_PROGRESS: "bg-blue-100 text-blue-800",
//   DONE: "bg-green-100 text-green-800",
// };

// export default function TaskListComponent({
//   classList,
//   onEditTask,
//   category,
// }: TaskListProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // States
//   const queryClient = useQueryClient();
//   const { data: tasks } = useQuery("tasks", getAllTasks);

//   const { data: session } = useSession();

//   const mutationUpdateStatus = useMutation(({ id, status }: { id: number; status: Task["status"] }) => updateTaskStatus(id, status), {
//     onSuccess: () => {
//       // Invalide la requête "tasks" pour forcer un refetch
//       queryClient.invalidateQueries("tasks");
//     },
//   });

//   const handleUpdateTaskStatus = async (taskId: number, status: Task["status"]) => {
//     try {
//       await mutationUpdateStatus.mutateAsync({ id: taskId, status });
//       console.log("Task status updated successfully");
//     } catch (error) {
//       console.error("Error updating task status", error);
//     }
//   };

//   const handleEditTask = (taskId: number) => {
//     if (typeof onEditTask === "function") {
//       onEditTask(taskId);
//     } else {
//       console.warn("onEditTask is not defined or a function");
//     }
//   };

//   const mutationDelete = useMutation(deleteTask, {
//     onSuccess: () => {
//       // Invalide la requête "tasks" pour forcer un refetch
//       queryClient.invalidateQueries("tasks");
//     },
//   });

//     const handleDeleteTask = async (taskId: number) => {
//     try {
//       await mutationDelete.mutateAsync(taskId);
//       console.log("Task deleted successfully");
//     } catch (error) {
//       console.error("Error deleting task", error);
//     }
//   };

//   /* --------------------------------------------------------------------------- */
//   const filteredTasks = tasks?.filter((task) => task.category === category);

//   return (
//     <Card className={`${classList} p-0`} key={category}>
//       <CardContent>
//         {filteredTasks && filteredTasks.length === 0 ? (
//           <>
//             <CardHeader>
//               <CardTitle>{category}</CardTitle>
//             </CardHeader>
//             <div className="text-center text-gray-500 dark:text-gray-400">
//               No tasks available for this category.
//             </div>
//           </>
//         ) : (
//           <>
//             <ScrollArea className="h-[21rem] w-full overflow-hidden">
//               {filteredTasks &&
//                 filteredTasks.map((task) => (
//                   <React.Fragment key={task.id}>
//                     {" "}
//                     {/* Ajoute la key ici */}
//                     <CardHeader className="p-5">
//                       <CardTitle className="text-sm flex-col flex-grow  leading-none font-medium">
//                         <div className="font-bold">{task.title}</div>
//                         <div>
//                           {(task.content?.length ?? 0) > 100
//                             ? task.content?.substring(0, 100) + ".."
//                             : task.content}
//                         </div>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ul className="space-y-2">
//                         <li
//                           key={task.id}
//                           className="flex flex-grow items-center justify-between rounded-lg bg-white p-2 shadow dark:bg-gray-950"
//                         >
//                           <div className="flex flex-grow items-center space-x-2">
//                             <span
//                               className={`rounded-full px-1 py-1 text-xs font-semibold ${
//                                 statusColors[task.status]
//                               }`}
//                             >
//                               {task.status.replace("_", " ")}
//                             </span>
//                           </div>
//                           <div className="flex justify-center items-center">
//                             <CalendarIcon className="h-4 w-4" />
//                             <span className="text-xs text-gray-500 text-center">
//                               {task.deadline
//                                 ? task.deadline.toDateString()
//                                 : "No deadline"}
//                             </span>
//                           </div>
//                           {session && (
//                             <div className="flex space-x-1">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" size="icon">
//                                     <MoreHorizontal className="h-3 w-4" />
//                                     <span className="sr-only">Open menu</span>
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem
//                                     onSelect={() => handleEditTask(task.id)}
//                                   >
//                                     Edit
//                                   </DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuLabel>
//                                     Update Status
//                                   </DropdownMenuLabel>
//                                   <DropdownMenuItem>
//                                     <Select
//                                       value={task.status}
//                                       onValueChange={async (
//                                         value: Task["status"]
//                                       ) =>
//                                         await handleUpdateTaskStatus(
//                                           task.id,
//                                           value
//                                         )
//                                       }
//                                     >
//                                       <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Status" />
//                                       </SelectTrigger>
//                                       <SelectContent>
//                                         <SelectItem value="TODO">
//                                           Todo
//                                         </SelectItem>
//                                         <SelectItem value="IN_PROGRESS">
//                                           In Progress
//                                         </SelectItem>
//                                         <SelectItem value="DONE">
//                                           Done
//                                         </SelectItem>
//                                       </SelectContent>
//                                     </Select>
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                               <Dialog
//                                 aria-labelledby="dialog-title"
//                                 aria-describedby="dialog-description"
//                               >
//                                 <DialogTrigger>
//                                   <Trash className="h-4 w-4" />
//                                 </DialogTrigger>
//                                 <DialogContent className="items-center flex flex-col justify-center">
//                                   <DialogHeader className="mt-2 ">
//                                     <DialogTitle
//                                       id="dialog-title"
//                                       className="text-lg text-center mb-4 leading-none tracking-tight"
//                                     >
//                                       <div className="text-lg font-sans text-gray-600 p-2 leading-snug border-y-2 border-red-800">
//                                         Are you sure you want to delete the task
//                                         ?
//                                       </div>
//                                       <br />
//                                       <span className="text-black-800 space-x-1 font-semibold text-lg p-1">
//                                         You'll be unable to undone this action.
//                                       </span>
//                                     </DialogTitle>
//                                     <DialogDescription id="dialog-description">
//                                       <div className="text-sm color-gray-600 text-center">
//                                         I understood & I am sure to delete the
//                                         task is my own responsibility.
//                                       </div>
//                                     </DialogDescription>
//                                   </DialogHeader>
//                                   <DialogClose
//                                     onClick={async () =>
//                                       await handleDeleteTask(task.id)
//                                     }
//                                     className="bg-red-500 hover:bg-red-700 w-[50%] text-center text-white font-bold py-2 px-4 rounded-full"
//                                   >
//                                     Yes
//                                   </DialogClose>
//                                   {/* <DialogClose
//                                 className="absolute w-auto h-auto p-2 rounded-lg border-2  border-gray-500 PopoverClose ml-4 scale-100"
//                                 aria-label="Close"
//                               >
//                                 <Cross2Icon />
//                               </DialogClose> */}
//                                 </DialogContent>
//                               </Dialog>
//                               <span className="sr-only">Delete task</span>
//                             </div>
//                           )}
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </React.Fragment>
//                 ))}
//             </ScrollArea>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { ScrollArea } from "$/app/components/ui/scroll-area";
import { deleteTask, updateTaskStatus } from "$/server/actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "$/app/components/ui/dialog";
import React from "react";
import { Button } from "$/app/components/ui/button";
import { Trash, MoreHorizontal, Calendar } from "lucide-react";
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
import { Task } from "@prisma/client";
import Loader from "./ui/loader";
import { useMutation, useQueryClient } from "react-query";

type TaskListProps = {
  tasksProps: Task[];
  category: Task["category"];
  classList?: string;
  onEditTask?: (taskId: number) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
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
  setTasks,
}: TaskListProps) {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const mutationUpdateStatus = useMutation(
    ({ id, status }: { id: number; status: Task["status"] }) =>
      updateTaskStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );

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

  const handleDeleteTask = async (taskId: number) => {
    try {
      await mutationDelete.mutateAsync(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  if (!tasksProps) {
    return (
      <div className="flex flex-col items-center justify-center w-max ">
        <Loader size={10} />
      </div>
    );
  }

  const filteredTasks = tasksProps.filter((task) => task.category === category);

  return (
    <Card className={`${classList} p-0`} key={category}>
      <CardContent>
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
          <ScrollArea className="h-[21rem] w-full overflow-hidden">
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
                      className={`flex flex-grow items-center justify-between rounded-lg bg-white p-2 shadow dark:bg-gray-950 ${
                        statusColors[task.status]
                      }`}
                    >
                      <div className="flex flex-grow items-center space-x-2">
                        <span
                          className={`rounded-full px-1 py-1 text-xs font-semibold ${
                            statusColors[task.status]
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-center items-center">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs text-gray-500 text-center">
                          {task.deadline
                            ? task.deadline.toDateString()
                            : "No deadline"}
                        </span>
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
                              onClick={() => onEditTask?.(task.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Select
                                value={task.status}
                                onValueChange={async (value: Task["status"]) =>
                                  await handleUpdateTaskStatus(task.id, value)
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
                        <Dialog
                          aria-labelledby="dialog-title"
                          aria-describedby="dialog-description"
                        >
                          <DialogTrigger>
                            <Trash className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="items-center flex flex-col justify-center">
                            <DialogHeader className="mt-2 ">
                              <DialogTitle
                                id="dialog-title"
                                className="text-lg text-center mb-4 leading-none tracking-tight"
                              >
                                <div className="text-lg font-sans text-gray-600 p-2 leading-snug border-y-2 border-red-800">
                                  Are you sure you want to delete the task?
                                </div>
                                <br />
                                <span className="text-black-800 space-x-1 font-semibold text-lg p-1">
                                  You'll be unable to undo this action.
                                </span>
                              </DialogTitle>
                              <DialogDescription id="dialog-description">
                                <div className="text-sm color-gray-600 text-center">
                                  I understand & I am sure that deleting the
                                  task is my own responsibility.
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              onClick={async () =>
                                await handleDeleteTask(task.id)
                              }
                              className="bg-red-500 hover:bg-red-700 w-[50%] text-center text-white font-bold py-2 px-4 rounded-full"
                            >
                              Yes
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <span className="sr-only">Delete task</span>
                      </div>
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
