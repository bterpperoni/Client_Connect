import { Popover, PopoverTrigger, PopoverContent } from "$/app/_components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Task } from "@prisma/client";

export default function NotificationPopover({ notifications }: { notifications: Task[] }) {
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
