import React from "react";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ children, className = "", color }) => {
  let colorClasses = "";

  // Determine background colors based on color prop
  switch (color) {
    case "gray":
    case "grey": // both spelling just in case
    case "stone":
      colorClasses = "bg-gray-200 dark:bg-gray-800";
      break;

    case "red":
      colorClasses = "bg-red-100 dark:bg-red-900";
      break;

    case "green":
      colorClasses = "bg-green-100 dark:bg-green-900";
      break;

    case "yellow":
    default:
      // Default to yellow if color prop is not provided or unrecognized
      colorClasses = "bg-yellow-100 dark:bg-yellow-900";
      break;
  }

  return (
    <div className={`terminal-output ${className.trim()}`}>
      {/* Apply conditional background colors based on light/dark mode */}
      <pre className={`py-0 m-0 ${colorClasses}`}>{children}</pre>
    </div>
  );
}

export default TerminalOutput;
