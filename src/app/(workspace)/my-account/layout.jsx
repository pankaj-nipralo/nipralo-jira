"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MyAccountSidebar from "@/components/MyAccount/SettingSidebar";

export default function MyAcoountLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 w-16 md:w-64 h-full bg-gray-800 text-white transition-all duration-500 ease-in-out z-20`}
      >
        <MyAccountSidebar />
      </div>

      {/* Main content wrapper */}
      <div
        className={`${
          isSidebarOpen ? "ml-16 md:ml-64" : "ml-0"
        } flex-1 transition-all duration-500 ease-in-out`}
      >
        {/* Toggle button */}
        <div className="pt-2 pl-2">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Pass sidebar state to children */}
        <div className="p-4">{typeof children === "function" ? children({ isSidebarOpen }) : children}</div>
      </div>
    </div>
  );
}
