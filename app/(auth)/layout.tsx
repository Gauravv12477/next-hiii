"use client"

import Link from "next/link";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

//Local
import LoginSvg from "@/assets/LoginSvg";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathName = usePathname();

  return (
    <div className="flex justify-center relative " lang="en">
      <div className="flex items-center w-1/2">
        <LoginSvg className="w-[80%]" />
      </div>
      <div className="flex items-center w-1/3">{children}</div>
      <Link
        className="flex gap-2 items-center  bottom-12 right-12 absolute bg-gray-200 p-3 font-bold text-xl rounded-xl hover:bg-gray-300"
        href={pathName === '/signup' ? '/login' : '/signup'}
      >
      {pathName === '/signup' ? 'Login' : 'Signup'} <HiMiniArrowTopRightOnSquare className="font-medium" />
      </Link>
    </div>
  );
}
