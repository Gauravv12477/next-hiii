import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CustomAlertDialogProps {
  title: string;
  dialogTitle?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  submitHandler: () => void;
  open: boolean; // New prop to manage dialog open state
  onOpenChange: (open: boolean) => void; // New prop to handle state change
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  title,
  dialogTitle = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  submitText = "Continue",
  cancelText = "Cancel",
  submitHandler,
  open,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger asChild>
        <button>{title}</button>
      </AlertDialogTrigger> */}

      {/* Add the hidden title for screen readers */}
      <VisuallyHidden.Root>
        <AlertDialogTitle>Command Dialog</AlertDialogTitle>
      </VisuallyHidden.Root>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={submitHandler}>
            {submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
