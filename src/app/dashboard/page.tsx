"use client";

import { useSession } from "next-auth/react";
import { Button } from "$/app/components/ui/button";
import { useEffect, useState } from "react";
import CustomModal from "$/app/components/ui/modal";
import TaskForm, { type TaskFormData } from "$/app/components/task-form";
import TaskList from "$/app/components/task-list";
import { type Task, TaskStatus } from "@prisma/client";

enum TaskCategory {
  Defensive = "Defensive",
  General = "General",
  Offensive = "Offensive",
}

import ChartDonut from "$/app/components/chart-donut";
import Loader from "$/app/components/ui/loader";

export default function Dashboard() {
  const { data: session } = useSession();

  const [taskID, setTaskID] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

const [tasks, setTasks] = useState<Task[]>();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  



  async function handleSubmit(data: TaskFormData) {
    const newUpdate = {
      title: data.title,
      content: data.description,
      importanceScore: data.importanceScore,
      deadline: data.deadline,
      status: TaskStatus.TODO,
      category: data.category,
      taskID: taskID ?? 0, // Ensure taskID is included
    };

    try {
    
          closeModal();
      
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  // or any other category you want to filter by
  const filteredTasksDefensive = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.Defensive,
  );
  const filteredTasksGeneral = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.General,
  );
  const filteredTasksOffensive = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.Offensive,
  );

  const [taskHook, setTaskHook] = useState<Task>();
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []),


  useEffect(() => {
    if (taskID) {
      const task = (tasks ?? []).filter((task) => task.id === taskID);
      if (task) {
        console.log("task current: ", task);
        setTaskHook(task ? task[0] : undefined);
      }
      openModal();
    }
  }, [taskID, tasks]);

  const percentageDefensive =
    (filteredTasksDefensive.filter((task) => task.status === TaskStatus.DONE)
      .length /
      filteredTasksDefensive.length) *
    100;
  const percentageGeneral =
    (filteredTasksGeneral.filter((task) => task.status === TaskStatus.DONE)
      .length /
      filteredTasksGeneral.length) *
    100;
  const percentageOffensive =
    (filteredTasksOffensive.filter((task) => task.status === TaskStatus.DONE)
      .length /
      filteredTasksOffensive.length) *
    100;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#553ec8] to-[#550bb6] text-white">
      <div className="container flex min-w-[85%] flex-col items-center justify-center gap-4 px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
        <div className="flex flex-col items-center gap-2">
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
          {/* --------------------------Dashboard content ----------------------------------------------------- */}
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-indigo-600">
            <div className="flex h-[85vh] flex-col items-center bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <ChartDonut
                  percentage={Math.floor(percentageDefensive)}
                  category={TaskCategory.Defensive}
                  tasks={filteredTasksDefensive}
                />
              )}
              <TaskList
                tasks={tasks ?? []}
                onEditTask={(taskID) => setTaskID(taskID)}
                category={"Defensive"}
                classList=" min-w-[30vw] my-5"
              />
            </div>
            <div className="flex h-[85vh] min-w-[400px] flex-col items-center rounded-xl bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <ChartDonut
                  percentage={Math.floor(percentageGeneral)}
                  category={TaskCategory.General}
                  tasks={filteredTasksGeneral}
                />
              )}
              <TaskList
                tasks={tasks ?? []}
                onEditTask={(taskID) => setTaskID(taskID)}
                category={"General"}
                classList="min-w-[30vw] my-5"
              />
            </div>
            <div className="flex h-[85vh] flex-col items-center bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <ChartDonut
                  percentage={Math.floor(percentageOffensive)}
                  category={TaskCategory.Offensive}
                  tasks={filteredTasksOffensive}
                />
              )}
              <TaskList
                tasks={tasks ?? []}
                onEditTask={(taskID) => setTaskID(taskID)}
                category={"Offensive"}
                classList="min-w-[30vw] my-5"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
