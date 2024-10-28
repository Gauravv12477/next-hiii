"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";

// ShadCN components
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LabelCustom from "@/components/custom/LabelCustom";
import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Validation Constants
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 6;

const Page = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorData>({});

  // Validation function to check fields
  const validateFields = (): ErrorData => {
    const newErrors: ErrorData = {};

    if (!userData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!userData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < minPasswordLength) {
      newErrors.password = `Password must be at least ${minPasswordLength} characters`;
    }
    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // Handle input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle validation on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const newErrors = validateFields();
    setErrors((prevErrors) => ({ ...prevErrors, [id]: newErrors[id as keyof ErrorData] }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateFields();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", userData);
      // Reset user data after successful submission
      // setUserData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <Card className="w-[500px] ">
        <CardHeader>
          <LabelCustom label="Signup" className="text-primary text-center text-5xl" />
          <Label className="text-center">Please create your account to continue!</Label>
        </CardHeader>

        <CardContent className="flex w-full flex-col gap-2">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  label="First Name"
                  id="firstName"
                  placeholder="John"
                  error={errors.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputWithLabel
                  label="Last Name"
                  id="lastName"
                  placeholder="Doe"
                  error={errors.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <InputWithLabel
                label="Email"
                id="email"
                placeholder="Enter your email"
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputWithLabel
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  error={errors.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputWithLabel
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4 shadow-md font-semibold">
              Signup
            </Button>
          </form>

          <div className="flex justify-between mt-2">
            <Label className="underline">
              <Link href="/login">Login</Link>
            </Label>
            <Label className="underline cursor-pointer hover:text-blue-700">Forgot Password?</Label>
          </div>

          <div className="flex py-2 justify-between items-center">
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
            <div>or</div>
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full shadow-md text-zinc-500 font-semibold">
              <FaGithub /> Github
            </Button>
            <Button variant="outline" className="w-full shadow-md text-zinc-500 font-semibold">
              <FaGoogle /> Google
            </Button>
            <Button variant="outline" className="w-full shadow-md text-zinc-500 font-semibold">
              <SiOnlyfans /> OnlyFans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
