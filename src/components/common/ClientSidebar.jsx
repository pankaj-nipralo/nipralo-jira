"use client";

import { 
  Home, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { SITE_URL } from "@/lib/constant";

const ClientSidebarItems = [
  { label: "Overview", icon: Home, href: "" },
  { label: "Tasks", icon: FileText, href: "tasks" },
  { label: "Meetings", icon: Calendar, href: "meetings" },
  { label: "Team", icon: Users, href: "team" },
  { label: "Messages", icon: MessageSquare, href: "messages" },
  { label: "Settings", icon: Settings, href: "settings" },
];

const ClientSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const { slug } = params; 
  const baseUrl = `${SITE_URL}nipralo-jira/client`;

  return (
    <aside className="w-16 md:w-64 border-r bg-white h-full p-3 flex flex-col relative transition-all duration-300">
      {/* Back to Clients */}
      <div className="mb-6">
        <Link 
          href="/nipralo-jira/client" 
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline text-sm font-medium">Back to Clients</span>
        </Link>
      </div>
      
      {/* Client Header */}
      <div className="relative mb-6">
        <div className="w-full flex items-center px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
              {slug?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-medium">
                Client {slug}
              </span>
              <span className="text-xs text-muted-foreground">Client Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 space-y-1">
        {ClientSidebarItems.map(({ label, icon: Icon, href }) => {
          // Determine if this item is active
          const itemPath = href ? `${baseUrl}/${slug}/${href}` : `${baseUrl}/${slug}`;
          const isActive = pathname === itemPath || 
                          (href === "" && pathname === `${baseUrl}/${slug}`);
          
          return (
            <div key={label} className="relative group">
              <Link
                href={href ? `${baseUrl}/${slug}/${href}` : `${baseUrl}/${slug}`}
                className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition",
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
              {/* Tooltip for mobile view */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 md:hidden whitespace-nowrap z-50">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ClientSidebar;
