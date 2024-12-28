import { Popover, PopoverTrigger, PopoverContent } from "$/app/_components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Task } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllTasks } from "$/server/actions";

//!--------------CHECK IF TASK IS NEAR DEADLINE -----------------
function isTaskNearDeadline(
  deadline: Date | null,
  daysThreshold: number = 14
): boolean {
  if (!deadline) return false;
  const currentDate = new Date();
  const timeDifference = deadline.getTime() - currentDate.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference <= daysThreshold;
}


export default function NotificationPopover() {

  const [notifications, setNotifications] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const nearDeadlineTasks = tasks.filter((task) =>
      isTaskNearDeadline(task.deadline)
    );
    setNotifications(nearDeadlineTasks);

    // Optional: Show browser notifications
    // if (nearDeadlineTasks.length > 0 && "Notification" in window) {
    //   nearDeadlineTasks.forEach((task) => {
    //     if (Notification.permission === "granted") {
    //       new Notification(`Task "${task.title}" is near its deadline!`);
    //     } else if (Notification.permission !== "denied") {
    //       Notification.requestPermission();
    //     }
    //   });
    // }
  }, [tasks]);

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((task) => (
              <li
                key={task.id}
                className="text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 p-2 rounded"
              >
                <strong>{task.title}</strong>: Due on{" "}
                {task.deadline?.toLocaleDateString() || "No deadline"}.
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No notifications</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
