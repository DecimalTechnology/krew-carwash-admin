import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "success" | "error";
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  color = "success"
}) => {
  const sizes = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-7"
  };

  const toggleSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const colors = {
    success: "bg-success-500",
    error: "bg-error-500"
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-white focus-visible:ring-opacity-75
        ${sizes[size]}
        ${checked ? colors[color] : "bg-gray-200 dark:bg-gray-700"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block transform rounded-full bg-white shadow-lg 
          ring-0 transition duration-200 ease-in-out
          ${toggleSizes[size]}
          ${checked ? "translate-x-full" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default Switch; 