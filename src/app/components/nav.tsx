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
import { Task, TaskStatus } from "@prisma/client";
import { createTask } from "$/server/actions/actions";
import { getAllTasks } from "$/server/actions/actions";

export default function SimpleNav() {
  /* ----- Task state ----- */
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>();
  /* ----- Page loading state ----- */
  const { data: session, status } = useSession();
  

  /* ----- Modal state ----- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // ---------------------------------------------------

  /* --------- Function to create a task ------------------ */
  async function handleSubmit(data: TaskFormData): Promise<void> {
    const task = {
      title: data.title,
      content: data.description,
      importanceScore: data.importanceScore,
      deadline: data.deadline,
      category: data.category,
      status: TaskStatus.TODO,
    };
setLoading(true)
    try {
      const newtask = await createTask(task);
      setTasks((prevTasks) => (prevTasks ? [...prevTasks, newtask] : [newtask]));

    } catch (error) {
      console.error("Error creating task", error);
    } 
  }

  return (
    <>
      <nav className="w-full inline-flex scroll items-center  bg-background h-[60px]">
        <div className="container mx-4 px-4">
          <div className="flex items-center justify-start h-max  space-x-4">
            <div className="flex h-full items-center justify-between w-full">
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
                  <div className="flex justify-between h-full flex-col">
                    <div className="flex flex-col  justify-start mt-6">
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
                        href={
                          session ? "/api/auth/signout" : "/api/auth/signin"
                        }
                      >
                        {session ? "Sign out" : "Sign in"}
                      </Btn>
                    </div>
                    <br />
                    {status === "authenticated" && (
                      <div className="my-6">
                        <SheetTitle className="text-center">
                          Services
                        </SheetTitle>
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
                  </div>
                </SheetContent>
              </Sheet>

              <div className="cursor-pointer">
                {status === "authenticated" ? (
                  <Btn
                    classList=" px-4 float-right"
                    percentageWidth={200}
                    textSize="md"
                    onClick={() => openModal()}
                  >
                    SCHEDULE TASK
                  </Btn>
                ) : (
                  <></>
                )}
              </div>

              <CustomModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title=""
              >
                <TaskForm
                  onSubmit={(data) => handleSubmit(data)}
                  task={undefined}
                />
              </CustomModal>
            </div>
          </div>
        </div>
      </nav>
      <Separator />
    </>
  );
}
