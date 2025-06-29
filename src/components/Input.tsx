import React from "react";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  icon?: React.ReactNode; // Add this prop for the icon
  iconPosition?: "left" | "right"; // Optional position, defaulting to right
  onIconClick?: () => void; // Optional click handler for the icon
  name?: string;
  required?: any;
  disable?: any;
  readOnly?: any;
};

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
  type,
  icon,
  iconPosition = "right",
  onIconClick,
  name,
  required,
  readOnly
  // disable
}) => {
  return (
    <div className="relative">
      <input
        name={name}
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-auto px-4 Poppins-font py-2 placeholder:text-gray-500 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none ${
          icon && iconPosition === "right" ? "pr-10" : ""
        } ${icon && iconPosition === "left" ? "pl-10" : ""} ${className} ${
          type === "number" ? "hide-number-input" : ""
        }`}
        required={required}
        readOnly={value !== undefined && onChange === undefined}
        // disabled={disable}
        disabled={readOnly}
      />

      {icon && (
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 ${
            iconPosition === "right" ? "right-3" : "left-4"
          } ${onIconClick ? "cursor-pointer" : ""}`}
          onClick={onIconClick}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;
