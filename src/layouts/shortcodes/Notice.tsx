import { humanize } from "@/lib/utils/textConverter";
import React from "react";
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";

function Notice({
  type,
  children,
  className = "",
}: {
  type: string;
  children: React.ReactNode;
  className?: string;
}) {
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
