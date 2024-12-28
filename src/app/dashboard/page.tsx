"use client";

import { Children, useEffect, useState } from "react";
import TaskForm, { type TaskFormData } from "$/app/_components/task-form";
import TaskListComponent from "$/app/_components/task-list";
import { type Task, TaskCategory } from "@prisma/client";
import ChartDonut from "$/app/_components/ui/chart-donut";
import Loader from "$/app/_components/ui/loader";
import CustomModal from "$/app/_components/ui/modal";
import { getAllTasks, getTaskById, updateTaskData } from "$/server/actions";
import AnimatedPercentage from "$/app/_components/ui/animatedPercentage";
import React from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";


export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskID, setTaskID] = useState<Task | undefined>();
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  //$ ----------States for modal------
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /*----------------------------------------
 Fetch tasks when the component is mounted
------------------------------------------*/
  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  //!------- FOCUS ON THIS TASK ---------.
  const editTask = async (taskID: number): Promise<void> => {
    if (taskID) {
      const task = await getTaskById(taskID);
      if (task !== null) {
        setTaskID(task);
        openModal();
      }
    }
  };

  //!-------------- UPDATE TASK ---------
  const handleSubmit = async (data: TaskFormData): Promise<void> => {
    const taskTemp = {
      title: data.title,
      content: data.description,
      importanceScore: data.importanceScore,
      deadline: data.deadline,
      category: data.category,
    };

    try {
      if (taskID?.id) {
        const updatedTaskData = await updateTaskData(taskID.id, taskTemp);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskID.id ? updatedTaskData : task
          )
        );
        // addTask(updatedTaskData);
        closeModal();
        toast.success("Task updated successfully");
      }
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  //!--------------Percentage completed foreach categories--------
  const calcPercentage = (tasks: Task[], category: TaskCategory) => {
    const tasksByCategory = tasks.filter((task) => task.category === category);

    const totalImportanceScore = tasksByCategory.reduce(
      (acc, task) => acc + task.importanceScore,
      0
    );

    const completedImportanceScore = tasksByCategory
      .filter((task) => task.status === "DONE")
      .reduce((acc, task) => acc + task.importanceScore, 0);

    return totalImportanceScore > 0
      ? (completedImportanceScore / totalImportanceScore) * 100
      : 0;
  };

  //*--------------RENDER Loading--------
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[90vh] ">
        <Loader size={100} />
      </div>
    )
  }

  if(!session){
    return(
      <div className="flex items-center justify-center w-full h-[90vh] ">
        Please sign in!
      </div>

    )
  }

  //*--------------RENDER Main ----------
  return (
    <div className="flex min-h-full py-4 flex-col justify-center bg-gradient-to-b from-[#550bb6] to-[#3c24b8] text-white">
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title="">
        <TaskForm onSubmit={handleSubmit} task={taskID ?? undefined} />
      </CustomModal>
      <div className="grid md:grid-cols-3 gap-4 mx-3">
        {Object.values(TaskCategory).map((category) => (
          <div
            key={category}
            className=" flex flex-col items-center bg-white rounded-xl"
          >
            <div className=" w-full border-box flex flex-col justify-center items-center">
              <ChartDonut
                key={category}
                classList="w-[95%] rounded-xl"
                category={category}
                tasks={tasks.filter((task) => task.category === category) ?? []} children={undefined}              /> 
              <AnimatedPercentage
                classList="bottom-[41%] relative md:top-[-42%] z-1"
                percentage={Math.floor(
                  calcPercentage(
                    tasks.filter((task) => task.category === category),
                    category
                  )
                )}
              />
            </div>
            <TaskListComponent
              tasksProps={tasks.filter((task) => task.category === category)}
              onEditTask={editTask}
              category={category}
              classList="w-[95%] h-max rounded-xl mt-2 relative bottom-6"
              setTasks={setTasks}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
