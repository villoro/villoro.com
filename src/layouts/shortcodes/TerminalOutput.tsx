import React from "react";

function TerminalOutput({ children }: { children: React.ReactNode }) {
  return (
    <div className="terminal-output">
      <pre>{children}</pre>
    </div>
  );
}

export default TerminalOutput;
