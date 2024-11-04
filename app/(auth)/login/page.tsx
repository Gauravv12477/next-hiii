"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import LabelCustom from "@/components/custom/LabelCustom";
import { InputWithLabel } from "@/components/custom/InputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";

interface UserData {
  email: string;
  password: string;
}

interface ErrorData {
  email?: string;
  password?: string;
}

// Validation constants
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page = () => {
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorData>({});

  // Refs for each input field
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Validate fields
  const validateFields = (): ErrorData => {
    const newErrors: ErrorData = {};
    if (!userData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(userData.email)) newErrors.email = "Invalid email format";
    if (!userData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle validation on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { id } = e.target;
    const fieldErrors = validateFields();
    setErrors((prevErrors) => ({ ...prevErrors, [id]: fieldErrors[id as keyof ErrorData] }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateFields();
    setErrors(formErrors);

    // Check for errors before proceeding
    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", userData);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center relative">
      <Card className="w-[500px]">
        <CardHeader>
          <LabelCustom label="Login" className="text-primary text-center text-5xl" />
          <Label className="text-center">Welcome back! Please sign in to continue</Label>
        </CardHeader>

        <CardContent className="flex w-full flex-col gap-2">
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <InputWithLabel
                label="Email"
                id="email"
                type="email"
                required
                placeholder="Enter your Email"
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
                nextRef={passwordRef} // Specify next input
              />

              <InputWithLabel
                label="Password"
                id="password"
                type="password"
                required
                placeholder="Enter Password"
                error={errors.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <Button type="submit" className="w-full mt-4 shadow-md font-semibold">
              Login
            </Button>
          </form>

          <div className="flex justify-between mt-4">
            <Label className="underline">
              <Link href="/signup">Signup</Link>
            </Label>
            <Label className="underline hover:text-blue-700 cursor-pointer">
              Forgot Password?
            </Label>
          </div>

          <div className="flex py-2 justify-between items-center mt-4">
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
            <div>or</div>
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Button className="w-full shadow-md text-zinc-500 font-semibold" variant="outline">
              <FaGithub /> Github
            </Button>
            <Button className="w-full shadow-md text-zinc-500 font-semibold" variant="outline">
              <FaGoogle /> Google
            </Button>
            <Button className="w-full shadow-md text-zinc-500 font-semibold" variant="outline">
              <SiOnlyfans /> OnlyFans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
