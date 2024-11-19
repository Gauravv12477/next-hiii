"use client";

import React, { useState, useEffect } from "react";
import * as chrono from "chrono-node";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  AlarmClock,
  Armchair,
  Calendar1Icon,
  CalendarArrowDown,
  CalendarRange,
  Check,
  Ellipsis,
  FlagIcon,
  SunIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { isEqual } from "lodash";
import { Cross1Icon, ReloadIcon } from "@radix-ui/react-icons";
import taskServices from "@/services/taskServices";
import { useToast } from "../hooks/use-toast";

// Utility function to get weekday as a short label
const getWeekday = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

// Get dates dynamically
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const nextSaturday = new Date(today);
nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));

// Calculate next week’s Monday with formatted date
const nextMonday = new Date(today);
nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7));

// Calculate next month’s date with a day limit check
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);
if (nextMonth.getDate() !== today.getDate()) {
  nextMonth.setDate(0); // Set to last day of the new month if original date doesn’t exist
}

const menubarItems = [
  { id: 1, title: "Due Date", icon: Calendar1Icon },
  { id: 2, title: "Priority", icon: FlagIcon },
  { id: 3, title: "Reminders", icon: AlarmClock },
];

// Assign relative labels to each quick access item
const quickAccessItems = [
  {
    id: 1,
    title: "Today",
    icon: CalendarArrowDown,
    color: "text-green-500",
    customDate: getWeekday(today),
    value: today,
  },
  {
    id: 2,
    title: "Tomorrow",
    icon: SunIcon,
    color: "text-yellow-500",
    customDate: getWeekday(tomorrow),
    value: tomorrow,
  },
  {
    id: 3,
    title: "This Weekend",
    icon: Armchair,
    color: "text-blue-500",
    customDate: getWeekday(nextSaturday),
    value: nextSaturday,
  },
  {
    id: 4,
    title: "Next Week",
    icon: CalendarRange,
    color: "text-purple-500",
    customDate: `${getWeekday(
      nextMonday
    )} ${nextMonday.getDate()} ${nextMonday.toLocaleString("default", {
      month: "short",
    })}`,
    value: nextMonday,
  },
];

const priorityItem = [
  { id: 1, color: "red", value: "LOW" },
  { id: 2, color: "yellow", value: "MEDIUM" },
  { id: 3, color: "blue", value: "HIGH" },
  { id: 4, color: "lightgray", value: "URGENT" },
];

// <----date-->

const parseDateInput = (
  input: string
): { date: Date | null; time: Date | null } => {
  const result: { date: Date | null; time: Date | null } = {
    date: null,
    time: null,
  };
  const parsedDate = chrono.parseDate(input);

  if (parsedDate) {
    const hasTime = parsedDate.getHours() || parsedDate.getMinutes();
    result.date = parsedDate;
    result.time = hasTime ? parsedDate : null;
  }

  return result;
};

interface AddTaskProps {
  onSave: () => void;
  onCancel: () => void;
  setTaskState?: any;
  taskData?: any;
}

const AddTask = ({
    onSave,
    onCancel,
    setTaskState,
    taskData,
}: AddTaskProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [taskInput, setTaskInput] = useState("");
  const [description, setDescription] = useState(""); // Description of the task
  const [priority, setPriority] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  // Input change handler with parsing
  const handleDateChange = (dateProp: Date | undefined) => {
    setDate(dateProp);
    if (!dateProp) setTaskDate(null);
  };

  console.log(taskData,"sdfdsgdf");
  // Input change handler with parsing
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
    setTaskInput(value);
    const { date: parsedDate } = parseDateInput(value);
    if (parsedDate) {
      setTaskDate(parsedDate);
      setDate(parsedDate);
    }
  };

  const handleSaveTask = async () => {
    setLoading(true);

    if (!taskInput.trim()) {
      setLoading(false); // Reset loading if there's no input
      return;
    }

    const payload = {
      title: taskInput.trim(),
      description: description.trim(),
      dueDate: taskDate || date,
      priority: priority,
    };

    try {
        let response;
  
        if (taskData) {
          // Edit task
          response = await taskServices.updateTask({id: taskData.id, payload});
          if (response && response.status === 200) {
            toast({
              title: "Task Updated",
              description: `${response.data.title} has been updated!`,
              className: "bg-green-100",
            });
          }
        } else {
          // Create new task
          response = await taskServices.createTask(payload);
          if (response && response.status === 201) {
            toast({
              title: "Task Created",
              description: `${response.data.title} is created Successfully!!}`,
              className: "bg-green-200",
            });
          }
        }
  
        return response?.data;
      } catch (error: any) {
        toast({
          title: "Oh! something went wrong",
          description: `${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Ensure loading state resets on both success and error
        onSave();
      }
  };

  useEffect(() => {
    if (taskData) {
      setTaskInput(taskData.title);
      setDescription(taskData.description);
      setPriority(taskData.priority);
      setTaskDate(new Date(taskData.dueDate));
      setDate(new Date(taskData.dueDate));
    }
  }, [taskData]);

  useEffect(() => {
    if (!open) {
      setDate(undefined);
      setPriority(undefined);
      setTaskInput("");
      setDescription("");
    }
  }, [open]);

  return (
    <div
      className={`${
        taskData ? "p-2 border border-[#49494F] border-double rounded-2xl" : ""
      }`}
    >
      <div>
        <div>
          <div>
            <Input
              placeholder="Task name"
              className={`border-none outline-none focus-visible:outline-none focus-visible:ring-0 
              placeholder:text-2xl placeholder:font-medium text-2xl 
              ${taskData ? "text-lg placeholder:text-lg" : "text-2xl"}`}
              value={taskInput}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Description"
              className={`border-none outline-none focus-visible:outline-none focus-visible:ring-0 
              mt-2 ${taskData ? "text-sm mt-1" : "text-base mt-2"}`}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div className="flex space-x-2 mt-4 pt-3">
            {menubarItems.map((item) => (
              <Popover key={item.id}>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className="text-gray-700 font-medium space-x-1 cursor-pointer"
                  >
                    <item.icon
                      color={`${
                        date && isEqual(item.title, "Due Date")
                          ? "green"
                          : priority && isEqual(item.title, "Priority")
                          ? priorityItem.find((pr) => pr.value === priority)
                              ?.color
                          : "gray"
                      }`}
                      fill={`${
                        priority && isEqual(item.title, "Priority")
                          ? priorityItem.find((pr) => pr.value === priority)
                              ?.color
                          : "none"
                      }`}
                      className="h-4 w-4"
                    />
                    <span>
                      {date && isEqual(item.title, "Due Date") ? (
                        <span className="flex gap-1 text-green-700">
                          {date.toLocaleDateString("en-us", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })}
                          <Cross1Icon
                            className="hover:text-red-400"
                            onClick={() => handleDateChange(undefined)}
                          />
                        </span>
                      ) : priority && isEqual(item.title, "Priority") ? (
                        // Content for when the title is "Priority"
                        <span className="flex gap-1 text-black">
                          {" "}
                          P{" "}
                          {
                            priorityItem.find((pri) => pri.value === priority)
                              ?.id
                          }{" "}
                          <Cross1Icon
                            className="hover:text-red-400"
                            onClick={() => setPriority(undefined)}
                          />{" "}
                        </span>
                      ) : (
                        // Fallback: when the title is not "Due Date" or "Priority"
                        item.title
                      )}
                    </span>
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2">
                  {item.title === "Due Date" && (
                    <div>
                      <div className="mb-4 ">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {date?.toDateString()}
                        </p>
                        <div className="space-y-2">
                          {quickAccessItems.map((quickItem) => (
                            <div
                              key={quickItem.id}
                              className="flex items-center justify-between space-x-2 cursor-pointer hover:bg-slate-100 p-1"
                              onClick={() => handleDateChange(quickItem?.value)}
                            >
                              <div className="flex space-x-2">
                                <quickItem.icon
                                  className={`h-5 w-5 ${quickItem.color}`}
                                />
                                <span className="text-gray-700 text-sm font-normal">
                                  {quickItem.title}
                                </span>
                              </div>
                              <span className="text-gray-600 text-xs">
                                {quickItem.customDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-600 pb-2">
                          Pick a Date
                        </p>
                        <Calendar
                          mode="single"
                          selected={date || undefined}
                          onSelect={(selectedDate) =>
                            handleDateChange(selectedDate)
                          }
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  )}
                  {item.title === "Priority" && (
                    <div>
                      <div className="space-y-1">
                        {priorityItem.map((pri) => (
                          <div
                            key={pri.id}
                            className="flex items-center justify-between space-x-2 cursor-pointer hover:bg-slate-100 p-1 gap-2 text-sm font-normal"
                            onClick={() => setPriority(pri.value)}
                          >
                            <FlagIcon
                              fill={pri.color}
                              color={pri.color}
                              size={18}
                            />
                            Priority {pri.id}
                            <div className="w-4">
                              {priority === pri.value && (
                                <Check color="green" size={15} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.title === "Reminders" && <div>Set Reminders</div>}
                </PopoverContent>
              </Popover>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Badge variant="outline">
                  <Ellipsis />
                </Badge>
              </PopoverTrigger>
              <PopoverContent>
                <div>More Options</div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className={`w-full flex items-center justify-end ${!taskData ? 'pt-6' : 'pt-0'} space-x-4`}>
          <Button disabled={loading} onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button className="bg-red-600" onClick={handleSaveTask}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Saving..
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
