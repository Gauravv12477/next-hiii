"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputWithLabelProps {
  label: string;
  placeholder: string;
  id?: string;
  type?: string;
  required?: boolean;
  error?: string; // Change to lowercase 'string' for TypeScript compatibility
  className?: string; // Change to lowercase 'string'
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;

}

export function InputWithLabel({
  label,
  placeholder = "",
  type = "text",
  id,
  required = false,
  error,
  className,
  ref,
  ...props
}: InputWithLabelProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`grid w-full items-center gap-1.5 ${className}`}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative w-full flex flex-col">
        <Input
          className={`h-10 ${error ? 'border-red-500' : ''}`} // Add border color for error
          type={type === "password" && !showPassword ? "password" : "text"}
          id={inputId}
          placeholder={placeholder}
          required={required}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <span
            className="absolute cursor-pointer inset-y-0 right-4 flex items-center pl-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Icon toggle */}
          </span>
        )}
        {/* Only show error message if it exists */}
        <div className="h-2 ">
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
      </div>
    </div>
  );
}
