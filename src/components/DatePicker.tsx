import React, { forwardRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { placeholder, value, onChange, className = "", type = "text", onFocus },
    ref
  ) => {
    const isDate = type === "date";

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isDate) {
        e.target.showPicker?.();
      }
      onFocus?.(e);
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          placeholder={placeholder}
          value={value}
          type={type}
          onFocus={handleFocus}
          onChange={onChange}
          className={`border border-gray-300 rounded px-3 py-2 w-full pr-10 outline-none !placeholder-gray-400  ${
            isDate ? "hide-native-datepicker-icon" : ""
          } ${className}`}
        />
        {isDate && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <MdKeyboardArrowDown size={20} />
          </span>
        )}
      </div>
    );
  }
);

export default Input;