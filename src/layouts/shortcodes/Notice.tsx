import React from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaStickyNote,
  FaClipboardList,
  FaFire,
  FaQuestionCircle,
  FaBolt,
  FaBug,
  FaListOl,
  FaQuoteLeft,
} from "react-icons/fa";

const TYPE_ALIASES: Record<string, string> = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote",
};

const ICONS: Record<string, React.ReactElement> = {
  note: <FaStickyNote />,
  abstract: <FaClipboardList />,
  info: <FaInfoCircle />,
  tip: <FaFire />,
  success: <FaCheckCircle />,
  question: <FaQuestionCircle />,
  warning: <FaExclamationTriangle />,
  failure: <FaTimesCircle />,
  danger: <FaBolt />,
  bug: <FaBug />,
  example: <FaListOl />,
  quote: <FaQuoteLeft />,
};

function Notice({
  type,
  children,
  className = "",
}: {
  type: string;
  children: React.ReactNode;
  className?: string;
}) {
  const canonical = TYPE_ALIASES[type] ?? type;
  const icon = ICONS[canonical] ?? <FaInfoCircle />;
  const classNames = ["notice", canonical, "text-md", className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <span>{icon}</span>
      <span className="ml-4">{children}</span>
    </div>
  );
}

export default Notice;
