"use client";

import Heading from "@/components/custom/Heading";
import { TaskMenuBar } from "@/components/custom/taskMenuBar";
import { useToast } from "@/components/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import taskServices from "@/services/taskServices";
import { format, isToday, isTomorrow, parseISO, toDate } from "date-fns";
import { isEqual } from "lodash";
import {
  Calendar1Icon,
  ChevronRight,
  Circle,
  CircleCheck,
  GripVertical,
  MoveRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddTask from "@/components/custom/AddTask";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

const Page = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState("");
  const [dragHover, setDragHover] = useState("");
  const [taskOrder, setTaskOrder] = useState([]);

  const [editDialog, setEditDialog] = useState("");

  // const [taskId , setTaskId] = useState("");

  const today = new Date().getDate();

  // Filter tasks for today's date
  const todayTasks = tasks.filter((task: any) => {
    const taskDate = new Date(task.dueDate).getDate();
    return taskDate === today;
  });

  // Filter overdue tasks
  const overdueTasks = tasks.filter((task: any) => {
    const taskDate = new Date(task.dueDate);
    return taskDate < new Date() && taskDate.getDate() !== today;
  });

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
          setTaskOrder(data.data.map((task: any) => task.id)); // Setting taskOrder with IDs
        } else {
          console.error("Failed to fetch tasks, status:", status);
          toast({
            description: "Something went wrong!",
          });
        }
      } catch (error: any) {
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
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    // Create a copy of the current tasks
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the local state with the reordered items
    setTasks(items);

    // Create a new order of task IDs
    const newOrder = items.map((task: any) => task.id);
    console.log(newOrder, "hiii");

    // Update the state with the new order
    () => setTaskOrder(newOrder);

    // Call the API with the updated order (use the newOrder directly)
    console.log(taskOrder);
    try {
      const response = await taskServices.updateOrderListing({
        taskIds: newOrder,
      }); // use newOrder here directly

      if (response.status === 200) {
        toast({
          description: "Position updated successfully! ✅",
          className: "w-fit",
        });
      }
    } catch (error: any) {
      console.log("Error updating task order:", error);
      toast({
        description: "Something went wrong while updating the task order.",
      });
    }
  };

  // handle task done
  const handleTaskDone = async (taskId: string) => {
    const payload = { completed: true };

    try {
      const response = await taskServices.updateTask({ payload, id: taskId });
      if (isEqual(response.status, 200)) {
        // Filter out the completed task from the tasks list
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        toast({
          description: "Task has been done ✅",
        });
      }
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const TaskItem = React.memo(
    ({ task, index }: { task: any; index: number }) => {
      const isEditing = isEqual(editDialog, task.id);
      return (
        <>
          {!isEditing ? (
            <Draggable draggableId={task.id.toString()} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`mb-1 rounded-lg transition-colors ${
                    snapshot.isDragging
                      ? "bg-gray-50 shadow-lg"
                      : isEqual(dragHover, task.id)
                      ? "bg-gray-50"
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

                      <div className="flex gap-1 m-2">
                        <div
                          onMouseEnter={() => setCheck(task.id)}
                          onMouseLeave={() => setCheck("")}
                          className="cursor-pointer"
                        >
                          {isEqual(check, task.id) ? (
                            <CircleCheck
                              size={20}
                              color="#73737a"
                              onClick={() => handleTaskDone(task.id)}
                            />
                          ) : (
                            <Circle size={20} color="#73737a" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-xs">
                            {task.title}
                          </div>
                          <div className="flex font-normal text-xs items-center space-x-2 space-y-2 text-orange-500 mt-1 gap-1">
                            <Calendar1Icon size={15} color="#F97316" />
                            {formatDueDate(task.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      {isEqual(dragHover, task.id) && (
                        <TaskMenuBar
                          setEditDialog={setEditDialog}
                          setTasks={setTasks}
                          taskId={task.id}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ) : (
            <div>
              <AddTask
                taskData={task}
                onCancel={() => setEditDialog("")}
                onSave={() => setEditDialog("")}
              />
            </div>
          )}
          <Separator className="mt-3" />
        </>
      );
    }
  );

  return (
    <div className="p-2 w-full">
      <div>
        <Heading
          title="Today"
          cn="font-bold text-[2.2rem] pb-3 text-[#49494f]"
        />
        {/* <div className="flex items-center gap-1">
          <FaRegCheckCircle size={15} color="gray" />
          <label className="text-gray-500 font-base">
            {tasks?.length} tasks
          </label>
        </div> */}
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
                    // className="max-h-[100vh] overflow-y-scroll scroll-m-1"
                  >
                    <div>
                      <div className="">
                        <div className="flex justify-start items-center">
                          <ChevronRight size={18} />
                          <span className="font-base">OverDue Tasks </span>
                        </div>
                        <Separator className="bg-[#918e8e] col-span-2" />
                      </div>
                      <div className="max-h-[50vh] overflow-y-scroll scroll-m-1">
                        {overdueTasks.map((task: any, index: number) => (
                          <TaskItem key={task.id} task={task} index={index} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div>
                      <div className="flex justify-start items-center">
                          <ChevronRight size={18} />
                          <span className="font-base">Todays Tasks </span>
                        </div>
                        <Separator className="bg-[#918e8e]" />
                      </div>
                      <div className="max-h-[50vh] overflow-y-scroll scroll-m-1">
                        {todayTasks.map((task: any, index: number) => (
                          <TaskItem key={task.id} task={task} index={index} />
                        ))}
                      </div>
                    </div>

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
