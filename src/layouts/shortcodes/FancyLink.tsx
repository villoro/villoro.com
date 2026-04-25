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
      className="btn btn-outline-primary inline-flex items-center gap-2"
    >
      <img src={domainLogoUrl} alt="Domain Logo" className={`w-4 h-4 ${dark ? "dark:hidden" : ""}`} />
      {dark && (
        <img src={darkDomainLogoUrl} alt="Domain Logo Darkmode" className="w-4 h-4 hidden dark:inline-block" />
      )}
      <span>{linkText}</span>
    </a>
  );
};

export default FancyLink;
