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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface OrgDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setTaskState: any;
}

const colorsList = [
  { name: "Light Blue", code: "#ADD8E6" },
  { name: "Berry Red", code: "#FF0055" },
  { name: "Ash Gray", code: "#b2beb5" },
  { name: "Red", code: "#FF0000" },
  { name: "Orange", code: "#FFA500" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Olive Green", code: "#808000" },
  { name: "Lime Green", code: "#32CD32" },
  { name: "Green", code: "#008000" },
  { name: "Mint Green", code: "#98FF98" },
  { name: "Teal", code: "#008080" },
  { name: "Sky Blue", code: "#87CEEB" },
];

const OrgDialog = ({ open, setOpen, setTaskState }: OrgDialogProps) => {
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
          <DialogTitle>
            Add project <CircleHelp className="inline-block" size={18} />
          </DialogTitle>
          <Separator />

          <div className="flex flex-col gap-2">
            <InputWithLabel
              type="text"
              label="Name"
              id="name"
              placeholder="Enter a Name"
            />

            <div>
              <Label>Color</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {colorsList.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.code }}
                        ></span>
                        {item.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Workspace</Label>

            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OrgDialog;
