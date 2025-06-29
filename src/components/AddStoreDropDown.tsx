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
  searchable?: boolean; // Add this prop
  noResultsMessage?: string; // Add this prop
};

const AddStoreDropDown: React.FC<AddStoreDropDownProps> = ({
  options,
  className = "",
  onSelect,
  icon,
  iconFirst = false,
  defaultValue,
  DropDownName,
  searchable = false, // Add this prop
  noResultsMessage = "No results found", // Add this prop
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state
  const [isSearching, setIsSearching] = useState(false); // Add searching state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Add input ref

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(value);
    setOpen(false);
    setSearchTerm(""); // Reset search term
    setIsSearching(false); // Reset searching state
    onSelect?.(value);
  };

  // Add button click handler
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Add search input handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setIsSearching(true);
  };

  const handleInputBlur = () => {
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

  // Close dropdown on outside click
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

  // Check dropdown position
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
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full cursor-pointer ${className}`}
        onClick={handleButtonClick}
      >
        <div className="flex items-center text-start gap-2 flex-1">
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
        <ul
          className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
            isAbove ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-sm text-gray-500">
              {noResultsMessage}
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={(e) => handleSelect(option, e)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default AddStoreDropDown;
