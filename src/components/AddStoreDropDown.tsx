import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

type AddStoreDropDownProps = {
  options: string[];
  className?: string;
  icon?: React.ReactNode;
  iconFirst?: boolean;
  onSelect?: (value: string) => void;
  defaultValue?: string;
  DropDownName?: string;
};

const AddStoreDropDown: React.FC<AddStoreDropDownProps> = ({
  options,
  className = "",
  onSelect,
  icon,
  iconFirst = false,
  defaultValue,
  DropDownName,
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string, e: React.MouseEvent) => {
    // Stop propagation to prevent modal from closing
    e.stopPropagation();

    setSelected(value);
    setOpen(false);
    onSelect?.(value);
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // 🔽 Check dropdown position
  useEffect(() => {
    const checkDropdownPosition = () => {
      if (dropdownRef.current) {
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - dropdownRect.bottom;
        setIsAbove(spaceBelow < 100);
      }
    };
    if (open) {
      checkDropdownPosition();
    }
    window.addEventListener("resize", checkDropdownPosition);
    return () => window.removeEventListener("resize", checkDropdownPosition);
  }, [open]);

  return (
    <div
      className="relative text-left text-[#5D6679]"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()} // Add this to stop propagation
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Add this to stop propagation
          setOpen((prev) => !prev);
        }}
        className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full ${className}`}
      >
        <div className="flex items-center text-start gap-2">
          {DropDownName && <span className="font-medium">{DropDownName}</span>}
          {iconFirst && icon}
          <span>{selected}</span>
        </div>
        {!icon && <FaChevronDown className="text-xs ml-2" />}
        {!iconFirst && icon}
      </button>
      {open && (
        <ul
          className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg ${
            isAbove ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          onClick={(e) => e.stopPropagation()} // Add this to stop propagation
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={(e) => handleSelect(option, e)} // Pass the event to handleSelect
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddStoreDropDown;
