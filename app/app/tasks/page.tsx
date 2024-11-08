// page.tsx
"use client";

import Heading from "@/components/custom/Heading";
import { useToast } from "@/components/hooks/use-toast";
import taskServices from "@/services/taskServices";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const { data, status } = await taskServices.getMyAllTasks();
        
        if (isEqual(status, 200)) {
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks, status:", status);
          toast({
            description: "Something went wrong!!",
          })
        }
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        toast({
          description: "Something went wrong!!",
        })
      }
    };

    fetchMyTasks();
  }, []);

  return (
    <div className="p-2 w-full">
      <div>
          <Heading
            title="My Tasks"
            cn="font-bold text-[3rem] text-[#49494f]"
          />
        <div>
          {/* Tasks would go here */}
          

        </div>
      </div>
    </div>
  );
};

export default Page;
