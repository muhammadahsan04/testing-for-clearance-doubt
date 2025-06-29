import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCheck } from "react-icons/rx";

type OptionType = string | { label: string; value: string };

type MultiSelectDropdownProps = {
  options: OptionType[];
  className?: string;
  icon?: React.ReactNode;
  iconFirst?: boolean;
  onSelect?: (values: string[]) => void;
  onChange?: (values: string[]) => void; // Added for compatibility
  defaultValues?: string[];
  selectedValues?: string[]; // Added for controlled component
  DropDownName?: string;
  placeholder?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  className = "",
  onSelect,
  onChange,
  icon,
  iconFirst = false,
  defaultValues = [],
  selectedValues,
  DropDownName,
  placeholder = "Select options",
}) => {
  const [selected, setSelected] = useState<string[]>(selectedValues || defaultValues || []);
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with parent when selectedValues prop changes
  useEffect(() => {
    if (selectedValues !== undefined) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  // Sync with defaultValues
  useEffect(() => {
    if (selectedValues === undefined) {
      setSelected(defaultValues || []);
    }
  }, [defaultValues, selectedValues]);

  const getOptionValue = (option: OptionType): string => {
    return typeof option === 'string' ? option : option.value;
  };

  const getOptionLabel = (option: OptionType): string => {
    return typeof option === 'string' ? option : option.label;
  };

  const handleSelect = (option: OptionType) => {
    const value = getOptionValue(option);
    let updatedSelection = [...selected];
    
    if (updatedSelection.includes(value)) {
      updatedSelection = updatedSelection.filter((v) => v !== value);
    } else {
      updatedSelection.push(value);
    }
    
    // Only update local state if not controlled
    if (selectedValues === undefined) {
      setSelected(updatedSelection);
    }
    
    // Call both callbacks for compatibility
    if (onSelect) onSelect(updatedSelection);
    if (onChange) onChange(updatedSelection);
    
    // Don't close dropdown to allow multiple selections
    // setOpen(false);
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

  const isSelected = (option: OptionType) => {
    const value = getOptionValue(option);
    return selected.includes(value);
  };

  const getSelectedLabels = () => {
    return selected.map(value => {
      const option = options.find(opt => getOptionValue(opt) === value);
      return option ? getOptionLabel(option) : value;
    });
  };

  return (
    <div
      className="relative inline-block text-left text-[#5D6679] w-full"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-sm w-full ${className}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {DropDownName && <span className="font-medium">{DropDownName}:</span>}
          {iconFirst && icon}
          <span className="truncate">
            {selected.length > 0 ? getSelectedLabels().join(", ") : placeholder}
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
              <span>{getOptionLabel(option)}</span>
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
