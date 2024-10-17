"use client";

import { Separator } from "$/app/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Btn from "./ui/btn";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "$/app/components/ui/sheet";
import TaskForm, { TaskFormData } from "./task-form";
import CustomModal from "./ui/modal";
import { Task } from "@prisma/client";

export function SimpleNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskID, setTaskID] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function handleSubmit(data: TaskFormData): void {
    throw new Error("Function not implemented.");
  }

  const [taskHook, setTaskHook] = useState<Task>();

  useEffect(() => {
    if (taskHook) {
      const taskList = tasks?.filter((task) => task.id === taskID);
      if (taskList) {
        console.log("task current: ", taskList);
        setTaskHook(taskList ? taskList[0] : undefined);
      }
      openModal();
    }
  }, [taskID, tasks]);

  return (
    <nav className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16 space-x-4">
          <div className="flex h-full items-center justify-between w-full">
            <div className="">
              <Sheet>
                <SheetTrigger>
                  <AlignJustify />
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="text-center ">
                      Navigation panel
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex justify-between h-full flex-col">
                    <div className="flex flex-col  justify-start mt-6">
                      <Btn href="/" onClick={() => router.push("/")}>
                        Home
                      </Btn>
                      <br />
                      <Btn
                        href="/dashboard"
                        onClick={() => router.push("/dashboard")}
                      >
                        Dashboard
                      </Btn>
                      <br />
                      <Btn
                        href={
                          session ? "/api/auth/signout" : "/api/auth/signin"
                        }
                      >
                        {session ? "Sign out" : "Sign in"}
                      </Btn>
                    </div>
                    <br />
                    <div className="my-6">
                      <SheetTitle className="text-center">Services</SheetTitle>
                      <Btn classList="mt-4 w-full" onClick={() => openModal()}>
                        SCHEDULE TASK
                      </Btn>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div onClick={() => openModal()} className="cursor-pointer" >
              { location.pathname === "/dashboard" && (
                <Btn classList=" relative float-right w-[200%]">
                  SCHEDULE TASK
                </Btn>
              )}
            </div>
            <CustomModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              title=""
            >
              <div className="mt-20">
                <TaskForm
                  onSubmit={(data) => handleSubmit(data)}
                  task={taskHook ?? undefined}
                />
              </div>
            </CustomModal>
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
