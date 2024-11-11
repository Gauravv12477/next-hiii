"use client";

import Heading from "@/components/custom/Heading";
import { TaskMenuBar } from "@/components/custom/taskMenuBar";
import { useToast } from "@/components/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import taskServices from "@/services/taskServices";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { isEqual } from "lodash";
import {
  Calendar1Icon,
  Circle,
  CircleCheck,
  GripVertical,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Page = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState("");
  const [dragHover, setDragHover] = useState("");

  // Function to format the due date
  const formatDueDate = (dueDate: string) => {
    const parseDate = parseISO(dueDate);
    if (isToday(parseDate)) {
      return "Today";
    } else if (isTomorrow(parseDate)) {
      return "Tomorrow";
    } else {
      return format(parseDate, "MMM dd, yyyy");
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    const fetchMyTasks = async () => {
      setLoading(true);
      try {
        const { data, status } = await taskServices.getMyAllTasks();

        if (isEqual(status, 200) && Array.isArray(data.data)) {
          setTasks(data.data);
        } else {
          console.error("Failed to fetch tasks, status:", status);
          toast({
            description: "Something went wrong!",
          });
        }
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        toast({
          description: "Something went wrong!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    // Here you can add an API call to update the order in your backend
    // updateTaskOrder(items);
  };

  const TaskItem = React.memo(
    ({ task, index }: { task: any; index: number }) => (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-1 rounded-lg transition-colors ${
              snapshot.isDragging
                ? "bg-gray-50 shadow-lg"
                : isEqual(dragHover, task.id)
                ? "bg-gray-100"
                : ""
            }`}
            onDragOver={() => setDragHover(task.id)}
            onDragLeave={() => setDragHover("")}
          >
            <div
              className="flex justify-between cursor-pointer p-2"
              onMouseEnter={() => setDragHover(task.id)}
              onMouseLeave={() => setDragHover("")}
            >
              <div className="flex items-center">
                <div
                  {...provided.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing w-4"
                >
                  {isEqual(dragHover, task.id) && (
                    <GripVertical color="#73737a" size={17} />
                  )}
                </div>

                <div className="flex items-center gap-1 m-2">
                  <div
                    onMouseEnter={() => setCheck(task.id)}
                    onMouseLeave={() => setCheck("")}
                    className="cursor-pointer"
                  >
                    {isEqual(check, task.id) ? (
                      <CircleCheck size={18} color="#73737a" />
                    ) : (
                      <Circle size={18} color="#73737a" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-xs">{task.title}</div>
                    <div className="flex font-normal text-xs items-center space-x-2 space-y-2 gap-2">
                      <Calendar1Icon size={15} color="gray" />
                      {formatDueDate(task.dueDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {isEqual(dragHover, task.id) && <TaskMenuBar />}
              </div>
            </div>
            <Separator className="mt-3" />
          </div>
        )}
      </Draggable>
    )
  );

  return (
    <div className="p-2 w-full">
      <div>
        <Heading
          title="My Tasks"
          cn="font-bold text-[2.2rem] pb-3 text-[#49494f]"
        />
        <div className="flex items-center">
          <FaRegCheckCircle />
          <label className="text-gray-600 font-medium">
            {tasks?.length} tasks
          </label>
        </div>
        <div>
          {loading ? (
            <div>
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-3">
                  <Skeleton className="h-[100px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                  </div>
                  <Skeleton className="h-[100px] w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="max-h-[80vh] overflow-y-scroll scroll-m-1"
                  >
                    {tasks.map((task: any, index: number) => (
                      <TaskItem key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;