import React from "react";

interface FancyLinkProps {
  url: string;
  linkText: string;
}

const FancyLink: React.FC<FancyLinkProps> = ({ url, linkText }) => {
  const domainLogoUrl = `${url.split('//')[0]}//${url.split('/')[2]}/favicon.ico`;

  return (
    <a href={url} role="button" className="inline-flex rounded-md border border-gray-300 px-2 flex items-center hover:bg-gray-100">
      <img src={domainLogoUrl} alt="Domain Logo" className="w-4 h-4 mr-2 my-0" />
      <span className="text-primary dark:text-darkmode-primary">{linkText}</span>
    </a>
  );
};

export default FancyLink;
