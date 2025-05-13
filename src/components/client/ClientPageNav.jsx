"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

const ClientPageNav = ({ clientId }) => {
  const pathname = usePathname();
  const baseUrl = `/nipralo-jira/client/${clientId}`;
  
  const navItems = [
    { label: "Overview", href: baseUrl },
    { label: "Tasks", href: `${baseUrl}/tasks` },
    { label: "Meetings", href: `${baseUrl}/meetings` },
    { label: "Documents", href: `${baseUrl}/documents` },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Link 
          href="/nipralo-jira/client" 
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Back to Clients</span>
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-2 border-b">
        {navItems.map((item) => {
          const isActive = 
            (item.href === baseUrl && pathname === baseUrl) || 
            (item.href !== baseUrl && pathname === item.href);
            
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ClientPageNav;
