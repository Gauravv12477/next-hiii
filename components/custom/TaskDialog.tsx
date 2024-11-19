"use client"
import React from "react";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AddTask from "./AddTask";

interface TaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setTaskState: any
}

const TaskDialog = ({ open, setOpen , setTaskState }: TaskDialogProps) => {

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
          <AddTask
              onSave={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              setTaskState={setTaskState}
          />
        </DialogHeader>
         
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
