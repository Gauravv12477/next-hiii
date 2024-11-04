// app/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-screen flex w-full justify-around items-center ">
     <div className="flex flex-col space-y-3 w-[30%]">
        <Skeleton className="h-[255px]  rounded-xl" />
        <Skeleton className="h-[255px]  rounded-xl" />
      </div>
      <div className="flex flex-col space-y-3 w-[20%]">
        <Skeleton className="h-[555px]  rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </div>
  );
}
