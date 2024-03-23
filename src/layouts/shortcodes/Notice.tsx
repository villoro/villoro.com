import { humanize } from "@/lib/utils/textConverter";
import React from "react";

import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimesCircle  } from "react-icons/fa";

function Notice({
  type,
  children,
}: {
  type: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`notice ${type} text-md`}>
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
