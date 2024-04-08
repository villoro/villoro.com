import React from "react";

interface FancyLinkProps {
  url: string;
  linkText: string;
  company?: string; // Optional custom company name
  dark?: boolean; // Optional parameter indicating if dark mode is enabled
}

const FancyLink: React.FC<FancyLinkProps> = ({ url, linkText, company, dark = false }) => {
  const extractCompanyName = (url: string): string => {
    const domain = new URL(url).hostname;
    const parts = domain.split('.');
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
      style={{"text-decoration": "none"}}
      className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 px-2 items-center hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <img src={domainLogoUrl} alt="Domain Logo" className={`w-4 h-4 mr-2 my-0 ${dark ? 'dark:hidden' : ''}`} />
      {dark && (
        <img src={darkDomainLogoUrl} alt="Domain Logo Darkmode" className="w-4 h-4 mr-2 my-0 hidden dark:inline-block" />
      )}
      <span className="text-primary dark:text-darkmode-primary">{linkText}</span>
    </a>
  );
};

export default FancyLink;
