"use client"

import { AppSidebar } from "@/components/custom/AppSideBar";
import DynamicBreadcrumb from "@/components/custom/BreadCrumbCustom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense, useState } from "react";
import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [taskState, setTaskState] = useState(false);
  
  return (
    <SidebarProvider>
      <AppSidebar setTaskState={setTaskState}/>
      <main className="w-full">
        <div className="flex items-center w-auto border-b p-3 border-[#777474] ">
          <SidebarTrigger />
          <DynamicBreadcrumb /> 
        </div>
          <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </SidebarProvider>
  );
}
