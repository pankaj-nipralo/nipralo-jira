"use client";

import React from 'react';
import { Plus } from 'lucide-react';

const AddColumnButton = ({ onClick }) => {
  return (
    <div 
      className="flex flex-col h-full rounded-lg border border-dashed border-gray-300 min-w-[250px] cursor-pointer hover:border-gray-400 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-3 mx-auto mb-3">
            <Plus className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">Add Column</p>
          <p className="text-gray-400 text-sm mt-1">Create a new status column</p>
        </div>
      </div>
    </div>
  );
};

export default AddColumnButton;
