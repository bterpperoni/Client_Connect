"use client";

import { useEffect, useState } from "react";
import TaskForm, { type TaskFormData } from "$/app/components/task-form";
import TaskListComponent from "$/app/components/task-list";
import { type Task } from "@prisma/client";
import ChartDonut from "$/app/components/ui/chart-donut";
import Loader from "$/app/components/ui/loader";
import CustomModal from "$/app/components/ui/modal";
import {
  getAllTasks,
  getTaskById,
  updateTaskData,
} from "$/server/actions/actions";

enum TaskCategory {
  Defensive = "Defensive",
  General = "General",
  Offensive = "Offensive",
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskID, setTaskID] = useState<Task | undefined>();
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const editTask = async (taskID: number): Promise<void> => {
    if (taskID) {
      const task = await getTaskById(taskID);
      if (task !== null) {
        setTaskID(task);
        openModal();
      }
    }
  };

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
        closeModal();
        console.log("Task updated successfully", updatedTaskData);
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[90vh] ">
        <Loader size={100} />
      </div>
    );
  }

  return (
    <div className="flex min-h-full py-3 flex-col justify-center bg-gradient-to-b from-[#553ec8] to-[#550bb6] text-white">
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title="">
        <TaskForm onSubmit={handleSubmit} task={taskID ?? undefined} />
      </CustomModal>
      <div className="grid md:grid-cols-3 gap-4">
        {Object.values(TaskCategory).map((category) => (
          <div
            key={category}
            className="col-span-1 flex flex-col items-center bg-white rounded-xl h-[88vh]"
          >
            <ChartDonut percentage={0} category={category} tasks={[]} />{" "}
            {/* Remplace avec des données réelles */}
            <TaskListComponent
              tasksProps={tasks.filter((task) => task.category === category)}
              onEditTask={editTask}
              category={category}
              classList="w-[95%] rounded-xl mt-2"
              setTasks={setTasks}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
