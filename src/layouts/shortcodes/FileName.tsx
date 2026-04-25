import React from "react";

interface FileNameProps {
  children: React.ReactNode;
}

const FileName: React.FC<FileNameProps> = ({ children }) => {
  return (
    <div className="file-name">
      <div className="file-name__body">
        <svg
          className="file-name__icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="file-name__text">{children}</span>
      </div>
    </div>
  );
};

export default FileName;
