"use client";

import { Separator } from "$/app/components/ui/separator";
import { useSession } from "next-auth/react";
import { useQueryClient, useMutation } from "react-query";
import { useState } from "react";
import Btn from "./ui/btn";
import { AlignJustify, RefreshCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "$/app/components/ui/sheet";
import TaskForm, { TaskFormData } from "./task-form";
import CustomModal from "./ui/modal";
import { Task, TaskStatus } from "@prisma/client";
import { createTask } from "$/server/actions/actions";

export default function SimpleNav() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation(createTask, {
    onSuccess: (newTask) => {
      // Invalide et refetch la requête "tasks"
      queryClient.invalidateQueries("tasks");
      // Optionnel : vous pouvez également mettre à jour les données en cache
      queryClient.setQueryData("tasks", (oldTasks: Task[] = []) => [
        ...oldTasks,
        { ...newTask, id: Date.now(), createdAt: new Date(), updatedAt: new Date(), deadline: newTask.deadline ?? null },
      ]);
    },
    onMutate: (newTask) => {
      // Annuler la requête "tasks" pour éviter de la refetcher
      queryClient.cancelQueries("tasks");
      // Récupérer les données actuelles pour pouvoir les restaurer plus tard
      const previousTasks = queryClient.getQueryData<Task[]>("tasks");
      // Ajouter la nouvelle tâche à la liste
      queryClient.setQueryData("tasks", (oldTasks: Task[] = []) => [
        ...oldTasks,
        { ...newTask, id: Date.now(), createdAt: new Date(), updatedAt: new Date(), deadline: newTask.deadline ?? null },
      ]);
      // Retourner une fonction de rollback
      return () => queryClient.setQueryData("tasks", previousTasks);
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  async function handleSubmit(data: TaskFormData): Promise<void> {
    const task = {
      title: data.title,
      content: data.description,
      importanceScore: data.importanceScore,
      deadline: data.deadline,
      category: data.category,
      status: TaskStatus.TODO,
    };

    try {
      await mutation.mutateAsync(task);
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      closeModal();
      location.reload();
    }
  }

  return (
    <>
      <nav className="w-full inline-flex scroll items-center bg-background h-[60px]">
        <div className="container mx-4 px-4">
          <div className="flex items-center justify-between w-full">
            <Sheet>
              <SheetTrigger className="items-center justify-center">
                <AlignJustify className="w-8 h-auto text-center" />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-center ">
                    Navigation panel
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-start mt-6">
                  <Btn href="/" onClick={() => location.assign("/")}>
                    Home
                  </Btn>
                  <br />
                  <Btn
                    href="/dashboard"
                    onClick={() => location.assign("/dashboard")}
                  >
                    Dashboard
                  </Btn>
                  <br />
                  <Btn
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  >
                    {session ? "Sign out" : "Sign in"}
                  </Btn>
                </div>
                {session && (
                  <div className="my-6">
                    <SheetTitle className="text-center">Services</SheetTitle>
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
                  className="mr-2 border-2 border-black p-2 rounded-xl w-12 h-auto hover:bg-black hover:text-white"
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
              <TaskForm onSubmit={(data) => handleSubmit(data)} task={undefined} />
            </CustomModal>
          </div>
        </div>
      </nav>
      <Separator />
    </>
  );
}
