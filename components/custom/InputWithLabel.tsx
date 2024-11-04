import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, forwardRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputWithLabelProps {
  label: string;
  placeholder: string;
  id?: string;
  type?: string;
  required?: boolean;
  error?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  nextRef?: React.RefObject<HTMLInputElement>;
}

// Use forwardRef to handle the ref prop correctly
export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  function InputWithLabel(
    {
      label,
      placeholder = "",
      type = "text",
      id,
      required = false,
      error,
      className,
      nextRef,
      ...props
    },
    ref
  ) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && nextRef?.current) {
        e.preventDefault();
        nextRef.current.focus();
      }
    };

    return (
      <div className={`grid w-full items-center gap-1.5 ${className}`}>
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative w-full flex flex-col">
          <Input
            className={`h-10 ${error ? "border-red-500" : ""}`}
            type={type === "password" && !showPassword ? "password" : "text"}
            id={inputId}
            placeholder={placeholder}
            required={required}
            ref={ref} // Use the ref from forwardRef
            onKeyDown={handleKeyDown}
            {...props}
          />
          {type === "password" && (
            <span
              className="absolute cursor-pointer inset-y-0 right-4 flex items-center pl-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          )}
          <div className="h-2">
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
          </div>
        </div>
      </div>
    );
  }
);
