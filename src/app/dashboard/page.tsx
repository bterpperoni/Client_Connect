"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import TaskForm, { type TaskFormData } from "$/app/components/task-form";
import TaskListComponent from "$/app/components/task-list";

import { type Task, TaskStatus } from "@prisma/client";
import { useQuery } from "react-query";

enum TaskCategory {
  Defensive = "Defensive",
  General = "General",
  Offensive = "Offensive",
}

import ChartDonut from "$/app/components/ui/chart-donut";
import Loader from "$/app/components/ui/loader";

import {
  getAllTasks,
  getTaskById,
  updateTaskData,
} from "$/server/actions/actions";
import CustomModal from "$/app/components/ui/modal";

export default function Dashboard() {

const [ filterDef, setFilterDef ] = useState<Task[]>([]);
const [ filterGen, setFilterGen ] = useState<Task[]>([]);
const [ filterOff, setFilterOff ] = useState<Task[]>([]);

const [ pDef , setPDef ] = useState<number>();
const [ pGen, setPGen ] = useState<number>();
const [ pOff, setPOff ] = useState<number>();

  /* ----- Task state ----- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskID, setTaskID] = useState<Task | undefined>();

  /* ----- Page loading state ----- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  /* ----- Modal state ----- */
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // UseEffect to fetch tasks when the component is mounted
  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError(error);
      } finally {
        console.log("TaskList: ", tasks);
        // No need to filter tasks here
        setLoading(false);
      }
    }
    fetchTasks();
  }, [loading, updateTaskData]); // Try with the setTask function into dep
  /* ----- Function to set the task to update ----- */


  async function editTask(taskID: number): Promise<void> {
    if (taskID) {
      console.log("TaskID: " + taskID);
      await getTaskById(taskID).then((task) => {
        if (task !== null) {
          setTaskID(task);
        }
      });
      openModal();
    }
  }

  /* ----- Function to handle the task's update ----- */
  async function handleSubmit(data: TaskFormData): Promise<void> {
    // Create a temp task object with form attributes
    const taskTemp = {
      title: data.title,
      content: data.description,
      importanceScore: data.importanceScore,
      deadline: data.deadline,
      category: data.category
  }
    // Update a new task if the task and his ID is not undefined
    try {
      if (taskID !== undefined) {
        if (taskID?.id !== undefined) {
          const updatedTaskData = await updateTaskData(taskID.id, taskTemp);
          if (updatedTaskData !== undefined) {
            closeModal();
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === taskID?.id ? updatedTaskData : task
              )
            );
            console.log("Task updated successfully", updatedTaskData);
          }
        }
        setLoading(true);
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  /* ----- Calculate  the total percentage of completed tasks offensive ----- */
useEffect( () => {

setFilterDef( tasks.filter((task) => task.category === TaskCategory.Defensive));
setFilterGen( tasks.filter((task) => task.category === TaskCategory.General));
setFilterOff( tasks.filter((task) => task.category === TaskCategory.Offensive));

setPDef( (filterDef.filter((task) => task.status === TaskStatus.DONE).length / filterDef.length) * 100);
setPGen( (filterGen.filter((task) => task.status === TaskStatus.DONE).length / filterGen.length) * 100);
setPOff( (filterOff.filter((task) => task.status === TaskStatus.DONE).length / filterOff.length) * 100);

}, [tasks]);

  //   const filteredTasksDefensive = tasks.filter(
  //   (task) => task.category === TaskCategory.Defensive
  // );
  // const filteredTasksGeneral = tasks.filter(
  //   (task) => task.category === TaskCategory.General
  // );
  // const filteredTasksOffensive = tasks.filter(
  //   (task) => task.category === TaskCategory.Offensive
  // );
  // const percentageDefensive =
  //   (filteredTasksDefensive.filter((task) => task.status === TaskStatus.DONE)
  //     .length /
  //     filteredTasksDefensive.length) *
  //   100;

  // const percentageGeneral =
  //   (filteredTasksGeneral.filter((task) => task.status === TaskStatus.DONE)
  //     .length /
  //     filteredTasksGeneral.length) *
  //   100;

  // const percentageOffensive =
  //   (filteredTasksOffensive.filter((task) => task.status === TaskStatus.DONE)
  //     .length /
  //     filteredTasksOffensive.length) *
  //   100;






  return (
    <div className=" flex min-h-full py-3 flex-col justify-center bg-gradient-to-b from-[#553ec8] to-[#550bb6] text-white">
      <div className=" items-center justify-center gap-4 px-4 py-0">
        <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title="">
          <div className="">
            <TaskForm
              onSubmit={(data) => handleSubmit(data)}
              task={taskID ?? undefined}
            />
          </div>
        </CustomModal>
        {/* --------------------------Dashboard content ----------------------------------------------------- */}

        <div className="grid  md:grid-cols-3  gap-4">
          {/* 1. Category DEFENSIVE */}
          <div className="col-span-1 group h-[88vh] flex flex-col items-center bg-white rounded-xl">
            {loading ? (
              <Loader size={100} className="my-15 text-black" />
            ) : (
              <>
                <ChartDonut
                  percentage={Math.floor( pDef ?? 0)}
                  category={TaskCategory.Defensive}
                  tasks={ filterDef }
                />
                <TaskListComponent
                  key={taskID?.id}
                  tasksProps={tasks ?? []}
                  onEditTask={async (taskID) => await editTask(taskID)}
                  category={"Defensive"}
                  classList="w-[95%] rounded-xl mt-5"
                />
              </>
            )}
          </div>

          {/* 2 Category GENERAL -----------------------------------------------------------------*/}
          <div className="col-span-1 group flex h-[88vh] flex-col items-center rounded-xl bg-white">
            {loading ? (
              <Loader size={100} className="my-15 text-black"></Loader>
            ) : (
              <>
                <ChartDonut
                  percentage={Math.floor(  pGen ?? 0)}

                  category={TaskCategory.General}
                  tasks={ filterGen }
                />
                <TaskListComponent
                  tasksProps={tasks ?? []}
                  onEditTask={async (taskID) => await editTask(taskID)}
                  category={"General"}
                  classList="w-[95%] rounded-xl mt-5"
                />
              </>
            )}
          </div>

          {/* 3 Category OFFENSIVE */}
          <div className="col-span-1 flex h-[88vh] flex-col items-center bg-white rounded-xl">
            {loading ? (
              <Loader size={100} className="my-15 text-black"></Loader>
            ) : (
              <>
                <ChartDonut
                  percentage={Math.floor( pOff ?? 0)}
                  category={TaskCategory.Offensive}
                  tasks={  filterOff }
                />
                <TaskListComponent
                  tasksProps={tasks ?? []}
                  onEditTask={async (taskID) => await editTask(taskID)}
                  category={"Offensive"}
                  classList="w-[95%] rounded-xl mt-5"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
