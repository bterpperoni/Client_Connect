"use client";

import { Separator } from "$/app/components/ui/separator";
import { useSession } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useState } from "react";
import Btn from "./ui/btn";
import { AlignJustify, RefreshCcw } from "lucide-react";
import { toast, Toaster } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "$/app/components/ui/sheet";
import TaskForm, { TaskFormData } from "./task-form";
import CustomModal from "./ui/modal";
import { Task, TaskStatus } from "@prisma/client";
import { createTask } from "$/server/actions/actions";
import { saltAndHashPassword } from "$/lib/utils/password";
// import { useStore } from "$/stores/useStore";
// import { useStore } from "$/lib/stores/useStore";

export const queryClient = new QueryClient();

export default function SimpleNav() {

// const addTask = useStore((state) => state.addTask);
// const fetchTasks = useStore((state) => state.fetchTasks);

  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

// const { percentage: perc, setTasks, setPercentage  } = useStore();

  const {
    mutate: createTheTask,
    isPending,
    isSuccess,
  } = useMutation(
    {
      mutationKey: ["tasks"],
      mutationFn: async ({ formdata }: { formdata: TaskFormData }) => {
        try {
          const newTask = await createTask({
            title: formdata.title,
            content: formdata.description,
            importanceScore: formdata.importanceScore,
            deadline: formdata.deadline,
            category: formdata.category,
            status: TaskStatus.TODO,
          });
          return newTask;
        } catch (error) {
          throw new Error("Task creation failed");
        }
      },
      onSuccess: () => {
        closeModal();
        console.log("Task created successfully");
        toast.success(" Task created successfully");
        // fetchTasks();
        // addTask(data);
      },
      onError: (error) => {
        console.log(error);
        toast.error(
          "Une erreur est survenue lors de l'inscription à la newsletter"
        );
      },
    },
    queryClient
  );

  return (
    <>
      <nav className="w-full inline-flex scroll items-center bg-background h-[60px]">
        <div className="container mx-4 px-4">
          <div className="flex items-center justify-between w-full">
            <Sheet>
              <SheetTrigger>
                <SheetDescription className="items-center justify-center" title="Open Navigation">
                  <AlignJustify className="w-8 h-auto text-center" />
                </SheetDescription>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <div className="text-center ">
                    Navigation panel
                  </div>
                </SheetHeader>
                <div className="flex flex-col justify-start !mt-6">
                  <Btn href="/" onClick={() => location.assign("/")}>
                    Home
                  </Btn>

                  <Btn
                    href="/dashboard"
                    classList="my-2"
                    onClick={() => location.assign("/dashboard")}
                  >
                    Dashboard
                  </Btn>

                  <Btn
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  >
                    {session ? "Sign out" : "Sign in"}
                  </Btn>
                </div>
                {session && (
                  <div className="my-6">
                    <div className="text-center">Services</div>
                    <Btn
                      classList="mt-2"
                      percentageWidth={100}
                      textSize="md"
                      onClick={() => openModal()}
                    >
                      SCHEDULE TASK
                    </Btn>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {session && (
              <div className="flex flex-row justify-center items-center">
                <RefreshCcw
                  className="mr-2 border-2 border-black p-2 rounded-xl w-12 h-auto cursor-pointer hover:bg-black hover:text-white"
                  onClick={() => location.reload()} // Pour recharger la page
                />
                <Btn
                  classList="px-4"
                  percentageWidth={200}
                  textSize="md"
                  onClick={() => openModal()}
                >
                  SCHEDULE TASK
                </Btn>
              </div>
            )}

            <CustomModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              title=""
            >
              <TaskForm
                onSubmit={async (data) => {
                  const newd = createTheTask({ formdata: data });
                  queryClient.setQueryData(
                    ["tasks"],
                    (oldTasks: Task[] | undefined) => {
                      if (!oldTasks) return [];
                      return [...oldTasks, newd];
                    }
                  );
                  closeModal();
                }}
                task={undefined}
              />
            </CustomModal>
          </div>
        </div>
      </nav>
      <Separator />
    </>
  );
}
