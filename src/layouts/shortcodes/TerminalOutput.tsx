import React from "react";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
  color?: "yellow" | "grey" | "gray" | "stone" | "red" | "green";
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ children, className = "", color = "yellow" }) => {
  const tone = (color === "gray" || color === "stone") ? "grey" : (color || "yellow");

  return (
    <div className={`terminal-output terminal-output--${tone} ${className}`.trim()}>
      <div className="terminal-output__body">{children}</div>
    </div>
  );
};

export default TerminalOutput;
