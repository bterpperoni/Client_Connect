"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { type Task, TaskStatus } from "@prisma/client";

enum TaskCategory {
  Defensive = "Defensive",
  General = "General",
  Offensive = "Offensive",
}

import ChartDonut from "$/app/components/ui/chart-donut";
import Loader from "$/app/components/ui/loader";
import { getAllTasks } from "$/server/actions/actions";
import TaskListComponent from "$/app/components/task-list";

export default function Dashboard() {
  const { data: session } = useSession();

  const [taskID, setTaskID] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksT = await getAllTasks();
      setTasks(tasksT);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  // or any other category you want to filter by
  const filteredTasksDefensive = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.Defensive
  );
  const filteredTasksGeneral = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.General
  );
  const filteredTasksOffensive = (tasks ?? []).filter(
    (task) => task.category === TaskCategory.Offensive
  );

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

          {/* --------------------------Dashboard content ----------------------------------------------------- */}
          
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-indigo-600">
            <div className="flex h-[85vh] flex-col items-center bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <>
                  <ChartDonut
                    percentage={Math.floor(percentageDefensive)}
                    category={TaskCategory.Defensive}
                    tasks={filteredTasksDefensive}
                  />
                  <TaskListComponent
                  tasks={tasks ?? []}
                  onEditTask={(taskID) => setTaskID(taskID)}
                  category={"Defensive"}
                  classList=" min-w-[30%] my-5"
                />
              </>
              )}
              
            </div>
            <div className="flex h-[85vh] min-w-[400px] flex-col items-center rounded-xl bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <>
                  <ChartDonut
                    percentage={Math.floor(percentageGeneral)}
                    category={TaskCategory.General}
                    tasks={filteredTasksGeneral}
                  />
                  <TaskListComponent
                  tasks={tasks ?? []}
                  onEditTask={(taskID) => setTaskID(taskID)}
                  category={"General"}
                  classList="min-w-[30%] my-5"
                  />
                </>
              )}
              
            </div>
            <div className="flex h-[85vh] flex-col items-center bg-white">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <>
                  <ChartDonut
                    percentage={Math.floor(percentageOffensive)}
                    category={TaskCategory.Offensive}
                    tasks={filteredTasksOffensive}
                  />
                  <TaskListComponent
                  tasks={tasks ?? []}
                  onEditTask={(taskID) => setTaskID(taskID)}
                  category={"Offensive"}
                  classList="min-w-[30%] my-5"
                />
              </>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
