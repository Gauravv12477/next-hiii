"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Calendar,
  Calendar1,
  ChevronUp,
  Hash,
  Inbox,
  Plus,
  Radar,
  Search,
  Settings,
  User2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SearchForm } from "../search-form";
import { Label } from "@radix-ui/react-label";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LogOut } from "@/helper/common";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../hooks/use-toast";
import CustomAlertDialog from "./CustomAlertDialog";
import { FaPlusCircle } from "react-icons/fa";
import { CommandDialogDemo } from "./CommandCustomSidebar";
import TaskDialog from "./TaskDialog";
import OrgDialog from "./OrgDialog";

const items = [
  { title: "Search", url: "#", icon: Search, shortcut: "ctrl + k" },
  { title: "Tasks", url: "/app/tasks", icon: Inbox },
  { title: "Today", url: "/app/today", icon: Calendar1 },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Settings", url: "#", icon: Settings },
];

interface UserType {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export function AppSidebar({ setTaskState }: any) {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<UserType | null>(null);
  const { toast } = useToast();

  // Dialog Handler
  const [isDialogOpen, setDialogOpen] = useState(false); //logout
  const [searchDialog, setSearchDialog] = useState(false); //search dialog
  const [taskDialog, settaskDialog] = useState(false); //task Dialog
  const [orgDialog, setOrgDialog] = useState(false);

  // Effect to set user data from Redux store
  useEffect(() => {
    console.log("Fetching user info from Redux store...");
    setUserData(userInfo.userInfo);
  }, [userInfo]);

  // Logout handler
  const handleLogout = async () => {
    console.log("Preparing to log out...");
    setDialogOpen(false);
    try {
      const logoutSuccess = await LogOut();
      if (logoutSuccess) {
        console.log("Logout successful, redirecting to login...");
        router.push("/login");
        toast({
          title: "Logged out successfully!",
          description: "You have been logged out.",
          variant: "default",
          className: "bg-green-200",
        });
      } else {
        console.error("Logout failed: Server response was unsuccessful.");
        toast({
          title: "Something went wrong!",
          description: "Logout failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "An error occurred!",
        description: "Logout failed due to an error.",
        variant: "destructive",
      });
    }
  };

  const handleOpenOrgDialog = async () => {};

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 p-3 bg-gray-200 rounded-xl">
          <Radar size={30} className="text-red-500" />
          <Label className="text-red-700 font-semibold text-2xl">Todozz</Label>
        </div>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        {/* add task button */}
        <SidebarGroup>
          <span
            className="flex items-center gap-1 ml-2 text-red-700 font-semibold cursor-pointer"
            onClick={() => settaskDialog(!taskDialog)}
          >
            <FaPlusCircle color="red" size={20} /> Add Task
          </span>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md font-medium text-gray-500">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item?.shortcut ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        className="flex justify-between items-center cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default navigation
                          if (item.shortcut) {
                            setSearchDialog(!searchDialog); // Open the search dialog for `ctrl + k`
                          }
                        }}
                      >
                        <div className="flex gap-1">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                        {/* {item.shortcut && <CommandDiv label="ctrl + k" />} */}
                        {item.shortcut && (
                          <CommandDialogDemo
                            state={searchDialog}
                            onClose={() => setSearchDialog(false)}
                          />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        className="flex justify-between items-center cursor-pointer"
                        href={item.url}
                      >
                        <div className="flex gap-1">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* organisation */}

        <SidebarGroup>
          <SidebarGroupLabel
            className="flex cursor-pointer justify-between text-md font-medium text-gray-500 group hover:text-gray-700"
            onClick={() => setOrgDialog(!orgDialog)}
          >
            <div>Organisations</div>

            <div className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} onClick={() => setOrgDialog(!orgDialog)} />
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      className="flex justify-between items-center cursor-pointer"
                      href={item.url}
                    >
                      <div className="flex gap-1">
                        <Hash />
                        <span>{item.title}</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* </Collapsible> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {userData ? (
                    <p>
                      Welcome, {userData.firstname} {userData.lastname}
                    </p>
                  ) : (
                    <p>Loading...</p>
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* profile */}
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                {/* sign */}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Custom Alert Dialog for Logout Confirmation */}
      <CustomAlertDialog
        title="Sign out"
        dialogTitle="Confirm Sign Out"
        description="Are you sure you want to sign out? You will need to log in again to access your account."
        submitText="Yes, Sign out"
        cancelText="Cancel"
        submitHandler={() => {
          handleLogout();
          setDialogOpen(false); // Close the dialog after logout
        }}
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Taskbar Dialogbox */}

      <OrgDialog
        open={orgDialog}
        setOpen={setOrgDialog}
        setTaskState={setTaskState}
      />

      <TaskDialog
        open={taskDialog}
        setOpen={settaskDialog}
        setTaskState={setTaskState}
      />
    </Sidebar>
  );
}
