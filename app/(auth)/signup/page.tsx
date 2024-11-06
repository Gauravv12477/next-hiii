"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaInfo } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";
import { isEqual } from "lodash";

// ShadCN components
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LabelCustom from "@/components/custom/LabelCustom";
import { InputWithLabel } from "@/components/custom/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import userServices from "@/services/userServices";
import { useDispatch } from "react-redux";
import { login } from "@/store/userSlice";
import { InfoCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { BsFillInfoCircleFill, BsInfoCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";

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
  api?: string; // Error message from API
}

// Validation Constants
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 6;

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorData>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Refs for each input field
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Validation function to check fields
  const validateFields = (): ErrorData => {
    const newErrors: ErrorData = {};

    if (!userData.firstName.trim())
      newErrors.firstName = "First Name is required";
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: newErrors[id as keyof ErrorData],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateFields();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const payload = {
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        password: userData.password,
      };

      try {
        setLoading(true);
        const { data, status } = await userServices.signup(payload);

        // Check API response status
        if (isEqual(status, 201)) {
          dispatch(login(data));
          setLoading(false);
          router.push("/dashboard");
        } else {
          // If the response status is not 200, set an API error message
          setErrors((prev) => ({
            ...prev,
            api: data.message || "An error occurred. Please try again.",
          }));
          setLoading(false);
        }
      } catch (error: any) {
        // Handle API error - can be improved based on your error structure
        setErrors((prev) => ({
          ...prev,
          api: error.response?.data?.message || "An unexpected error occurred.",
        }));
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <Card className="w-[500px] ">
        <CardHeader>
          <LabelCustom
            label="Signup"
            className="text-primary text-center text-5xl"
          />
          <Label className="text-center">
            Please create your account to continue!
          </Label>
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
                  ref={firstNameRef}
                  nextRef={lastNameRef} // Corrected ref name
                />
                <InputWithLabel
                  label="Last Name"
                  id="lastName"
                  placeholder="Doe"
                  error={errors.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={lastNameRef} // Corrected ref name
                  nextRef={emailRef}
                />
              </div>
              <InputWithLabel
                label="Email"
                id="email"
                placeholder="Enter your email"
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={emailRef}
                nextRef={passwordRef}
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
                  ref={passwordRef}
                  nextRef={confirmPasswordRef}
                />
                <InputWithLabel
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={confirmPasswordRef}
                />
              </div>
            </div>
            {errors.api && (
              <div className="flex items-baseline gap-[2px]">
                <BsInfoCircle size={15} color="red" />{" "}
                <span className="text-red-500 mt-1 text-sm font-medium">{errors.api}</span> 
              </div>
            )}
            <Button
              disabled={loading}
              type="submit"
              className={`w-full mt-4 shadow-md font-semibold`}
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>

          <div className="flex justify-between mt-2">
            <Label className="underline">
              <Link href="/login">Login</Link>
            </Label>
            <Label className="underline cursor-pointer hover:text-blue-700">
              Forgot Password?
            </Label>
          </div>

          <div className="flex py-2 justify-between items-center">
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
            <div>or</div>
            <Separator orientation="horizontal" className="w-[45%] h-[2px]" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full shadow-md text-zinc-500 font-semibold"
            >
              <FaGithub /> Github
            </Button>
            <Button
              variant="outline"
              className="w-full shadow-md text-zinc-500 font-semibold"
            >
              <FaGoogle /> Google
            </Button>
            <Button
              variant="outline"
              className="w-full shadow-md text-zinc-500 font-semibold"
            >
              <SiOnlyfans /> OnlyFans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
