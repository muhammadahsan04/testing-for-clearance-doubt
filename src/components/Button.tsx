// import React from "react";

// type ButtonProps = {
//   text?: string; // Text for button
//   imageSrc?: string; // Image URL for button
//   icon?: React.ReactNode; // Icon as a React element (for flexibility)
//   variant?: "border" | "bg"; // Border or background style
//   onClick?: () => void; // Button click handler
//   disabled?: boolean; // Disable button
//   className?: string; // Additional classes for custom styling
//   fontFamily?: string; // Font family for button text
//   iconFirst?: boolean; // Determines if the icon comes first
// };

// const Button: React.FC<ButtonProps> = ({
//   text,
//   imageSrc,
//   icon,
//   variant = "bg", // Default is background
//   onClick,
//   disabled = false,
//   className = "",
//   fontFamily, // Font family className
//   iconFirst = false, // Default icon position is after the text
// }) => {
//   // Conditional classNames for button styles
//   const buttonStyles =
//     variant === "bg"
//       ? "border border-[#5D6679] text-black"
//       : "bg-[#5D6679] border border-[#5D6679] text-white";

//   return (
//     <button
//       className={`${buttonStyles}  cursor-pointer px-2 py-1.5 rounded-md flex items-center justify-center gap-0.5 ${className} ${fontFamily}`}
//       onClick={onClick}
//       disabled={disabled}
//     >
//       {/* Conditionally render icon first or text first */}
//       {iconFirst && icon && <span className="mr-2">{icon}</span>}

//       {/* Display Image if imageSrc is provided */}
//       {imageSrc && (
//         <img src={imageSrc} alt="button image" className="h-6 w-6 mr-0.5 sm:mr-1 md:mr-2" />
//       )}

//       {/* Display Text if text is provided */}
//       {text && <span className="text-[12px] sm:text-[14px] md:text-[15px]">{text}</span>}

//       {/* Render the icon after the text if iconFirst is false */}
//       {!iconFirst && icon && <span className="mr-0.5 sm:mr-1">{icon}</span>}
//     </button>
//   );
// };

// export default Button;

import React from "react";

type ButtonProps = {
  text?: string; // Text for button
  imageSrc?: string; // Image URL for button
  icon?: React.ReactNode; // Icon as a React element (for flexibility)
  variant?: "border" | "bg"; // Border or background style
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // Updated to accept an optional event parameter
  disabled?: boolean; // Disable button
  className?: string; // Additional classes for custom styling
  fontFamily?: string; // Font family for button text
  iconFirst?: boolean; // Determines if the icon comes first
  type?: "button" | "submit" | "reset"; // Add type prop for form buttons
};

const Button: React.FC<ButtonProps> = ({
  text,
  imageSrc,
  icon,
  variant = "bg", // Default is background
  onClick,
  disabled = false,
  className = "",
  fontFamily, // Font family className
  iconFirst = false, // Default icon position is after the text
  type = "button", // Default type is "button"
}) => {
  // Conditional classNames for button styles
  const buttonStyles =
    variant === "bg"
      ? "border border-[#5D6679] text-black"
      : "bg-[#5D6679] border border-[#5D6679] text-white";
  return (
    <button
      className={`${buttonStyles} cursor-pointer px-2 py-1.5 rounded-md flex items-center justify-center gap-0.5 ${className} ${fontFamily}`}
      onClick={onClick}
      disabled={disabled}
      type={type} // Add the type attribute
    >
      {/* Conditionally render icon first or text first */}
      {iconFirst && icon && <span className="mr-2">{icon}</span>}
      {/* Display Image if imageSrc is provided */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="button image"
          className="h-6 w-6 mr-0.5 sm:mr-1 md:mr-1"
        />
      )}
      {/* Display Text if text is provided */}
      {text && (
        <span className="text-[12px] sm:text-[14px] md:text-[15px] md:mr-1">
          {text}
        </span>
      )}
      {/* Render the icon after the text if iconFirst is false */}
      {!iconFirst && icon && <span className="mr-0.5 sm:mr-1">{icon}</span>}
    </button>
  );
};

export default Button;
