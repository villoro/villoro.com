import React from "react";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ children, className, color }) => {
  color = color || "yellow"; // Use "yellow" if no color is provided
  return (
    <div className={`terminal-output ${className}`}>
      <pre className={`py-0 m-0 bg-${color}-100 dark:bg-${color}-900`}>{children}</pre>
    </div>
  );
}

export default TerminalOutput;
