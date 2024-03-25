import React from "react";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ children, className, color }) => {
  let colorLight = "";
  let colorDark = "";

  // Determine background colors based on color prop
  switch (color) {
    case "gray":
    case "grey": // both spelling just in case
    case "stone":
      colorLight = "bg-gray-200";
      colorDark = "dark:bg-gray-800";
      break;

    case "red":
      colorLight = "bg-red-100";
      colorDark = "dark:bg-red-900";
      break;

    case "yellow":
    default:
      // Default to yellow if color prop is not provided or unrecognized
      colorLight = "bg-yellow-100";
      colorDark = "dark:bg-yellow-900";
      break;
  }

  return (
    <div className={`terminal-output ${className}`}>
      {/* Apply conditional background colors based on light/dark mode */}
      <pre className={`py-0 m-0 ${colorLight} ${colorDark}`}>{children}</pre>
    </div>
  );
}

export default TerminalOutput;
