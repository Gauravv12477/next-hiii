import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  AlarmClock,
  Armchair,
  Calendar1Icon,
  CalendarArrowDown,
  CalendarRange,
  Check,
  CheckCheckIcon,
  Ellipsis,
  FlagIcon,
  SunIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { isEqual } from "lodash";
import { Cross1Icon } from "@radix-ui/react-icons";

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
  { id: 1, color: "red" , value: "LOW"  },
  { id: 2, color: "yellow" , value: "MEDIUM"},
  { id: 3, color: "blue" , value: "HIGH"},
  { id: 4, color: "lightgray", value: "URGENT" },
];

// <----date-->
const parseDateInput = (
  input: string
): { date: Date | null; time: Date | null } => {
  const now = new Date();

  // Default to null for both date and time
  const result = { date: null, time: null };

  // Check if the input doesn't contain date/time-related words
  const nonDateRelatedInput = /today's task|drink water|task/i.test(
    input.toLowerCase()
  );
  if (nonDateRelatedInput) {
    return result; // Return null for both date and time if input is unrelated to date/time
  }

  // Define patterns for various formats, including flexible date and time
  const regexPatterns = [
    // Full date with time (e.g., "2 Jan 2025, 2pm")
    {
      regex:
        /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})?,?\s*(\d{1,2})?\s*(am|pm)?/i,
      transform: (match: any) => {
        const day = parseInt(match[1]);
        const month = match[2].toLowerCase();
        const year = match[3] ? parseInt(match[3]) : now.getFullYear();
        const hour = match[4] ? parseInt(match[4]) % 12 : 0; // Default to 0 if no hour provided
        const isPM = match[5]?.toLowerCase() === "pm";
        const finalHour = isPM ? hour + 12 : hour;

        const monthIndex = new Date(Date.parse(`${month} 1, 2021`)).getMonth();
        const date = new Date(year, monthIndex, day, finalHour);

        // Return both date and time objects
        return { date, time: new Date(year, monthIndex, day, finalHour) };
      },
    },
    // Date only (e.g., "5 Apr" or "2 Jan 2025")
    {
      regex:
        /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s*(\d{4}))?/i,
      transform: (match: any) => {
        const day = parseInt(match[1]);
        const month = match[2].toLowerCase();
        const year = match[3] ? parseInt(match[3]) : now.getFullYear();

        const monthIndex = new Date(Date.parse(`${month} 1, 2021`)).getMonth();
        const date = new Date(year, monthIndex, day);

        // Return date object and null for time
        return { date, time: null };
      },
    },
    // Time only (e.g., "6pm" or "2:30 PM")
    {
      regex: /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
      transform: (match: any) => {
        const hour = parseInt(match[1]) % 12;
        const minute = match[2] ? parseInt(match[2]) : 0;
        const isPM = match[3]?.toLowerCase() === "pm";
        const finalHour = isPM ? hour + 12 : hour;

        const time = new Date(now);
        time.setHours(finalHour, minute, 0, 0);

        // Return null for date and time object for the time
        return { date: null, time };
      },
    },
    // Add additional patterns as necessary
  ];

  // Iterate through patterns and attempt to match
  for (const pattern of regexPatterns) {
    const match = input.match(pattern.regex);
    if (match) {
      return pattern.transform(match); // Return transformed result if match is found
    }
  }

  return result; // Return { date: null, time: null } by default if no pattern matches
};

interface TaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskDialog = ({ open, setOpen }: TaskDialogProps) => {
  // Date and time states
  // const [taskTime, setTaskTime] = useState<Date | undefined>(new Date());
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [taskDate, setTaskDate] = useState<Date | undefined>(new Date());
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState<string | undefined>(undefined);

  // Set date function that also updates taskInput
  const handleDateChange = (dateProp: Date | undefined) => {
    setDate(dateProp);
    if (dateProp) {
    }
  };
  console.log("first", date);

  // Handle user input and parse for date-related terms
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTaskInput(value);

    const { date } = parseDateInput(value);
    if (date) {
      setTaskDate(date);
      // setTaskInput(formatDateForInput(date)); // Update input box with formatted date
      setDate(date);
    }
  };

  useEffect(() => {
    setDate(undefined);
    setPriority(undefined);
    setTaskInput("");
  },[open])

  // Render logic remains mostly the same
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="z-50"
        style={{
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <div>
            <Input
              placeholder="Task name"
              className="border-none outline-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-2xl placeholder:font-medium text-2xl"
              value={taskInput}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Description"
              className="border-none outline-none focus-visible:outline-none focus-visible:ring-0 mt-2"
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
                          ? priorityItem.find((pr) => pr.value === priority)?.color
                          : "gray"
                      }`}
                      fill={`${
                        priority && isEqual(item.title, "Priority")
                          ? priorityItem.find((pr) => pr.value === priority)?.color
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
                          P {priorityItem.find((pri)=> pri.value === priority)?.id}{" "}
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
                          selected={date}
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
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button className="bg-red-600" onClick={() => setOpen(false)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
