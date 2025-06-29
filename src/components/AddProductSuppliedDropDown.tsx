"use client";

import type React from "react";
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FaChevronDown } from "react-icons/fa";

type DropdownProps = {
  options: string[];
  className?: string;
  icon?: React.ReactNode;
  iconFirst?: boolean;
  onSelect?: (value: string) => void;
  defaultValue?: string;
  DropDownName?: string;
  searchable?: boolean;
  noResultsMessage?: string;
  resetTrigger?: number; // Add this prop to trigger reset
};

// Add ref type for reset function
export interface DropdownRef {
  resetSelection: () => void;
}

const AddProductSuppliedDropDown = forwardRef<DropdownRef, DropdownProps>(
  (
    {
      options,
      className = "",
      onSelect,
      icon,
      iconFirst = false,
      defaultValue,
      DropDownName,
      searchable = false,
      noResultsMessage = "No results found",
      resetTrigger = 0, // Add this prop
    },
    ref
  ) => {
    const [selected, setSelected] = useState(defaultValue || options[0]);
    const [open, setOpen] = useState(false);
    const [isAbove, setIsAbove] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose reset function to parent component
    useImperativeHandle(ref, () => ({
      resetSelection: () => {
        setSelected(defaultValue || options[0]);
        setSearchTerm("");
        setIsSearching(false);
        setOpen(false);
      },
    }));

    // Reset when resetTrigger changes
    useEffect(() => {
      if (resetTrigger > 0) {
        setSelected(defaultValue || options[0]);
        setSearchTerm("");
        setIsSearching(false);
        setOpen(false);
      }
    }, [resetTrigger, defaultValue, options]);

    // Filter options based on search term (only if searchable)
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // FIXED: Reset to default value after selection
    const handleSelect = (value: string) => {
      setSelected(defaultValue || options[0]); // Reset to default instead of showing selected value
      setOpen(false);
      setSearchTerm("");
      setIsSearching(false);
      onSelect?.(value);
    };

    const handleButtonClick = () => {
      if (!open) {
        setOpen(true);
        if (searchable) {
          setTimeout(() => {
            inputRef.current?.focus();
            setIsSearching(true);
          }, 100);
        }
      } else {
        setOpen(false);
        setIsSearching(false);
      }
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    // Handle input focus
    const handleInputFocus = () => {
      setIsSearching(true);
    };

    // Handle input blur
    const handleInputBlur = () => {
      // Small delay to allow option selection
      setTimeout(() => {
        setIsSearching(false);
      }, 150);
    };

    // Clear search term when dropdown closes
    useEffect(() => {
      if (!open) {
        setSearchTerm("");
        setIsSearching(false);
      }
    }, [open]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative text-left text-[#5D6679]" ref={dropdownRef}>
        <div
          className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-sm w-full cursor-pointer ${className}`}
          onClick={handleButtonClick}
        >
          <div className="flex items-center gap-2 flex-1">
            {iconFirst && icon}

            {/* Show input when searching, otherwise show labels */}
            {searchable && open && isSearching ? (
              <input
                ref={inputRef}
                type="text"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={DropDownName || "Search..."}
                className="outline-none bg-transparent flex-1 font-medium text-gray-600"
                autoFocus
              />
            ) : (
              <>
                {DropDownName && (
                  <span className="font-medium">{DropDownName}</span>
                )}
                {!DropDownName && <span>{selected}</span>}
                {DropDownName && <span>{selected}</span>}
              </>
            )}
          </div>

          {!icon && (
            <FaChevronDown
              className={`text-xs ml-2 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
          {!iconFirst && icon}
        </div>

        {open && (
          <div
            className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg ${
              isAbove ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-500">
                  {noResultsMessage}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

AddProductSuppliedDropDown.displayName = "Dropdown";

export default AddProductSuppliedDropDown;
