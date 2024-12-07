"use client";

import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "$/lib/utils/utils";
import { Button } from "$/app/_components/ui/button";
import { Calendar } from "$/app/_components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "$/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "$/app/_components/ui/select";
import { Input } from "$/app/_components/ui/input";
import { Textarea } from "$/app/_components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "$/app/_components/ui/popover";
import { type Task } from "@prisma/client";

type TaskFormProps = {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
};

export type TaskFormData = {
  category: "Defensive" | "General" | "Offensive";
  title: string;
  description: string;
  importanceScore: number;
  deadline: Date;
  createdAt: Date;
};

export default function TaskForm({ task, onSubmit }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    defaultValues: {
      category: task?.category ?? "General",
      title: task?.title ?? "",
      description: task?.content ?? "",
      importanceScore: task?.importanceScore ?? 1,
      deadline: task?.deadline ?? new Date(),
      createdAt: new Date(),
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 mx-4 mt-4"
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Defensive">Defensive</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Offensive">Offensive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits this task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormDescription>
                Provide a clear and concise title for the task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the task in detail, including any specific requirements
                or goals.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="importanceScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Importance Score</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 6))}
                />
              </FormControl>
              <FormDescription>
                Rate the importance of this task from 1 (lowest) to 5 (highest).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-bold">Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Set the deadline for task completion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center w-full">
          <Button className="w-[25%] hover:bg-white hover:text-black hover:border-black border-2" type="submit">
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
