import React from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Separator } from "../ui/separator";
import { InputWithLabel } from "./InputWithLabel";

interface OrgDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setTaskState: any;
}

const OrgDialog = ({ open, setOpen, setTaskState }: OrgDialogProps) => {
  return <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogTitle>Add project <CircleHelp className="inline-block" size={18} /></DialogTitle>
      <Separator/>  

      <div>
        <InputWithLabel type="text" label="Name" id="name" placeholder="Enter a Name"/>

      </div>
        
    </DialogHeader>
     
  </DialogContent>
</Dialog>
};

export default OrgDialog;
