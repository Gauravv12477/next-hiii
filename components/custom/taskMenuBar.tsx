"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import taskServices from "@/services/taskServices";
import { isEqual } from "lodash";
import {
  CalendarMinus2,
  Edit2,
  Ellipsis,
  PencilLine,
  Trash2,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import CustomAlertDialog from "./CustomAlertDialog";
import { useState } from "react";


export function TaskMenuBar({  setEditDialog,  taskId , setTasks }: { setEditDialog?: any, taskId?: string, setTasks?: any  }) {
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await taskServices.deleteTask({ id: taskId });

      if (isEqual(response.status, 200)) {

        // setTasks
        setTasks((prevTasks:any) => prevTasks.filter((task:any) => task.id !== taskId));

        toast({
          description: `Task has been deleted ✅`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.log("Something went wrong", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the task.",
        variant: "destructive",
      });
    }
  };

  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer px-1">
          <PencilLine color="#73737a" size={18} className="hover" onClick={() => setEditDialog(taskId)}/>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer px-1">
          <CalendarMinus2 color="#73737a" size={18} />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer px-1">
          <Ellipsis color="#73737a" size={18} />
        </MenubarTrigger>
        <MenubarContent className="items-start ">
          <MenubarItem className="cursor-pointer">
            <Edit2 size={18} color="gray" />
            Edit...
          </MenubarItem>
          <MenubarItem
            className="bg-red-100 hover:bg-red-100 cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <Trash2 size={18} color="red" /> Delete{" "}
            <MenubarShortcut>⌘D</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Custom alertDialog */}
      <CustomAlertDialog
        title="Delete Task"
        dialogTitle="Confirm Deletion"
        description="Are you sure you want to delete this task? This action cannot be undone."
        submitText="Yes, Delete"
        cancelText="Cancel"
        submitHandler={() => {
          if (taskId) {
            handleTaskDelete(taskId); // Only proceed if taskId is valid
          }
          setDialogOpen(false); // Close the dialog after confirmation
        }}
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Menubar>
  );
}
