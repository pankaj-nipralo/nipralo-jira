"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  CalendarRange,
  ChevronDown,
  Users,
  CheckCircle,
  Filter,
  X,
  FolderGit2
} from "lucide-react";
import React from "react";

const TimeTrackingFiltering = () => {
  return (
    <div className="bg-white p-4 rounded-md border mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start cursor-pointer" >
              <CalendarRange className="h-4 w-4 mr-2" />
              Select Date Range
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
          
          </DropdownMenuContent>
        </DropdownMenu>


      </div>
    </div>
  );
};

export default TimeTrackingFiltering;
