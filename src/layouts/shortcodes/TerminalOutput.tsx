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
    case "grey":
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
      colorClasses = "bg-yellow-100 dark:bg-yellow-900";
      break;
  }

  return (
    <div className={`terminal-output ${className.trim()}`}>
      <pre className={`py-0 m-0 ${colorClasses}`}>{children}</pre>
    </div>
  );
};

export default TerminalOutput;
