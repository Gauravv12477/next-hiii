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
  Ellipsis,
  FlagIcon,
  SunIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

// Utility function to get weekday as a short label
const getWeekday = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" });

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
  { id: 1, title: "Today", icon: CalendarArrowDown, color: "text-green-500", customDate: getWeekday(today) },
  { id: 2, title: "Tomorrow", icon: SunIcon, color: "text-yellow-500", customDate: getWeekday(tomorrow) },
  { id: 3, title: "This Weekend", icon: Armchair, color: "text-blue-500", customDate: getWeekday(nextSaturday) },
  { id: 4, title: "Next Week", icon: CalendarRange, color: "text-purple-500", customDate: `${getWeekday(nextMonday)} ${nextMonday.getDate()} ${nextMonday.toLocaleString('default', { month: 'short' })}` },
];

interface TaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskDialog = ({ open, setOpen }: TaskDialogProps) => {

  // Date state
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // State for dynamic positioning
  const [position, setPosition] = useState<{ top: string; left: string }>({
    top: "10%",  // Default position for top
    left: "50%", // Default position for left
  });

  // Dynamically set position based on conditions
  useEffect(() => {
    // Example logic to set dynamic position
    const isSmallScreen = window.innerWidth < 640;  // For small screens
    if (isSmallScreen) {
      setPosition({
        top: "5%",  // For small screens, position the dialog slightly lower
        left: "50%", // Center horizontally
      });
    } else {
      setPosition({
        top: "10%", // For larger screens, position the dialog higher
        left: "50%", // Center horizontally
      });
    }

    // Optionally, you can use scroll position or other events to dynamically adjust
    // window.addEventListener("scroll", handleScroll); // Example: if you want dynamic adjustments on scroll
  }, [open]);  

  const handleContinue = () => {
    console.log("Continue action triggered");
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancel action triggered");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="z-50"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          transform: "translateX(-50%)", // Ensure it's centered horizontally
        }}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <div>
            <Input
              placeholder="Task name"
              className="border-none outline-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-2xl placeholder:font-medium text-2xl"
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
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2">
                  {item.title === "Due Date" && (
                    <div>
                      <div className="mb-4 ">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Quick Access
                        </p>
                        <div className="space-y-2">
                          {quickAccessItems.map((quickItem) => (
                            <div
                              key={quickItem.id}
                              className="flex items-center justify-between space-x-2 cursor-pointer hover:bg-slate-100 p-1"
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
                      {/* Calendar Placeholder */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-600 pb-2">
                          Pick a Date
                        </p>
                        <Calendar
                          mode="single"
                          selected={date}
                          
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </div>
                      {/* Time select */}
                    </div>
                  )}
                  {item.title === "Priority" && <div>Set Task Priority</div>}
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
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleContinue}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
