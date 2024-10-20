"use client";

import { useEffect, useState } from "react";
import { type TaskFormData } from "$/app/components/task-form";
import TaskListComponent from "$/app/components/task-list";
import { type Task, TaskStatus } from "@prisma/client";

enum TaskCategory {
  Defensive = "Defensive",
  General = "General",
  Offensive = "Offensive",
}

import ChartDonut from "$/app/components/ui/chart-donut";
import Loader from "$/app/components/ui/loader";
import { getAllTasks } from "$/server/actions/actions";

export default function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [taskID, setTaskID] = useState<number>()
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false)
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
    <div className=" flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#553ec8] to-[#550bb6] text-white">
      <div className=" items-center justify-center gap-4 px-4 py-8">
        <div className="">

          {/* --------------------------Dashboard content ----------------------------------------------------- */}
          
          <div className="grid grid-cols-3 gap-4">
            <div className="group flex flex-col items-center bg-white rounded-xl">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <ChartDonut
                  percentage={Math.floor(percentageDefensive)}
                  category={TaskCategory.Defensive}
                  tasks={filteredTasksDefensive}
                />
              )}
              <TaskListComponent
                tasks={tasks ?? []}
                onEditTask={(taskID) => setTaskID(taskID)}
                category={"Defensive"}
                classList="w-[95%] rounded-xl my-5"
              />
            </div>
            <div className="group flex h-[85vh] min-w-[400px] flex-col items-center rounded-xl bg-white">
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
                  classList="w-[95%] rounded-xl my-5"
                  />
                </>
              )}
              
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl">
              {isLoading ? (
                <Loader size={100} className="my-10 text-black"></Loader>
              ) : (
                <ChartDonut
                  percentage={Math.floor(percentageOffensive)}
                  category={TaskCategory.Offensive}
                  tasks={filteredTasksOffensive}

                />
              )}
              <TaskListComponent
                tasks={tasks ?? []}
                onEditTask={(taskID) => setTaskID(taskID)}
                category={"Offensive"}
                classList="w-[95%] rounded-xl my-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
