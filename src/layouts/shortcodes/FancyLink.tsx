import React from "react";

interface FancyLinkProps {
  url: string;
  linkText: string;
  company?: string;
  dark?: boolean;
}

const FancyLink: React.FC<FancyLinkProps> = ({ url, linkText, company, dark = false }) => {
  const extractCompanyName = (url: string): string => {
    const domain = new URL(url).hostname;
    const parts = domain.split(".");
    if (company) {
      return company;
    } else if (parts.length > 2) {
      return parts[parts.length - 2];
    } else {
      return parts[0];
    }
  };

  const companyName = extractCompanyName(url);
  const domainLogoUrl = `/favicons/${companyName}.ico`;
  const darkDomainLogoUrl = `/favicons/${companyName}-dark.ico`;

  return (
    <a
      href={url}
      role="button"
      className="fancy-link"
    >
      <img
        src={domainLogoUrl}
        alt=""
        aria-hidden="true"
        style={{ width: "14px", height: "14px", display: dark ? undefined : "inline-block", flexShrink: 0 }}
        className={dark ? "dark:hidden" : ""}
      />
      {dark && (
        <img
          src={darkDomainLogoUrl}
          alt=""
          aria-hidden="true"
          style={{ width: "14px", height: "14px", flexShrink: 0 }}
          className="hidden dark:inline-block"
        />
      )}
      <span>{linkText}</span>
    </a>
  );
};

export default FancyLink;
