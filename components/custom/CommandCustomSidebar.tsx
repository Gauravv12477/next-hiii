// CommandDialogDemo.tsx
"use client";

import * as React from "react";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

// ui - components
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { DialogTitle } from "../ui/dialog";

// Define prop types for CommandDialogDemo
interface CommandDialogDemoProps {
  state: boolean;
  onClose: () => void;
}

export function CommandDialogDemo({ state, onClose }: CommandDialogDemoProps) {
  const [open, setOpen] = React.useState(state);

  React.useEffect(() => {
    setOpen(state);
  }, [state]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleInputClick = () => setOpen(true);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">ctrl + </span>k
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onClose(); // Call onClose when the dialog closes
      }}>
        {/* Add the hidden title for screen readers */}
        <VisuallyHidden.Root>
          <DialogTitle>Command Dialog</DialogTitle>
        </VisuallyHidden.Root>
        <CommandInput
          placeholder="Type a command or search..."
          onClick={handleInputClick}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <FaceIcon />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <EnvelopeClosedIcon />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
