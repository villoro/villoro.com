import { humanize } from "@/lib/utils/textConverter";
import React from "react";

import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimesCircle  } from "react-icons/fa";

function Notice({
  type,
  children,
  className = "", // Optional className prop
}: {
  type: string;
  children: React.ReactNode;
  className?: string; // Optional className prop
}) {
  // Filter out undefined and empty strings
  const classNames = ["notice", type, "text-md", className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <span>
        {type === "info" ? (
          <FaInfoCircle />
        ) : type === "success" ? (
          <FaCheckCircle />
        ) : type === "warning" ? (
          <FaExclamationCircle />
        ) : (
          <FaTimesCircle />
        )}
      </span>
      <span className="ml-4">{children}</span>
    </div>
  );
}

export default Notice;
