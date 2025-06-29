import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCheck } from "react-icons/rx"; // using check icon instead of checkbox

type MultiSelectDropdownProps = {
  options: string[];
  className?: string;
  icon?: React.ReactNode;
  iconFirst?: boolean;
  onSelect?: (values: string[]) => void;
  defaultValues?: string[];
  DropDownName?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  className = "",
  onSelect,
  icon,
  iconFirst = false,
  defaultValues = [],
  DropDownName,
}) => {
  const [selected, setSelected] = useState<string[]>(defaultValues || []);
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with parent
  useEffect(() => {
    setSelected(defaultValues || []);
  }, [defaultValues]);

  const handleSelect = (value: string) => {
    let updatedSelection = [...selected];
    if (updatedSelection.includes(value)) {
      updatedSelection = updatedSelection.filter((v) => v !== value);
    } else {
      updatedSelection.push(value);
    }
    setSelected(updatedSelection);
    if (onSelect) onSelect(updatedSelection);

    // Close dropdown after single selection
    setOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

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
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isSelected = (value: string) => selected.includes(value);

  return (
    <div
      className="relative inline-block text-left text-[#5D6679] w-full"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-sm w-full ${className}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {DropDownName && <span className="font-medium">{DropDownName}:</span>}
          {iconFirst && icon}
          <span className="truncate">
            {selected.length > 0 ? selected.join(", ") : "Select options"}
          </span>
        </div>
        {!icon && <FaChevronDown className="text-xs ml-2" />}
        {!iconFirst && icon}
      </button>

      {open && (
        <ul
          className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
            isAbove ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => handleSelect(option)}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <RxCheck className="text-blue-600 text-lg" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
