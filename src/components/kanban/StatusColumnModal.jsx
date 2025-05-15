"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';

const StatusColumnModal = ({ isOpen, onClose, onSave, existingStatus, existingStatuses }) => {
  const [status, setStatus] = useState({
    name: '',
    color: 'bg-gray-100',
    colorHex: '#f3f4f6' // Default light gray
  });
  const [error, setError] = useState('');
  
  // Predefined color options
  const colorOptions = [
    { name: 'Gray', value: 'bg-gray-100', hex: '#f3f4f6' },
    { name: 'Blue', value: 'bg-blue-100', hex: '#dbeafe' },
    { name: 'Green', value: 'bg-green-100', hex: '#dcfce7' },
    { name: 'Purple', value: 'bg-purple-100', hex: '#f3e8ff' },
    { name: 'Yellow', value: 'bg-yellow-100', hex: '#fef9c3' },
    { name: 'Red', value: 'bg-red-100', hex: '#fee2e2' },
    { name: 'Orange', value: 'bg-orange-100', hex: '#ffedd5' },
    { name: 'Teal', value: 'bg-teal-100', hex: '#ccfbf1' },
    { name: 'Indigo', value: 'bg-indigo-100', hex: '#e0e7ff' },
    { name: 'Pink', value: 'bg-pink-100', hex: '#fce7f3' },
  ];

  // Initialize form with existing status data if editing
  useEffect(() => {
    if (existingStatus) {
      // Find the matching color option or default to the first one
      const colorOption = colorOptions.find(option => option.value === existingStatus.color) || colorOptions[0];
      
      setStatus({
        name: existingStatus.name,
        color: existingStatus.color,
        colorHex: colorOption.hex
      });
    } else {
      // Reset form for new status
      setStatus({
        name: '',
        color: 'bg-gray-100',
        colorHex: '#f3f4f6'
      });
    }
    
    setError('');
  }, [existingStatus, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate status name
    if (!status.name.trim()) {
      setError('Status name is required');
      return;
    }
    
    // Check for duplicate names (case insensitive)
    const isDuplicate = existingStatuses.some(
      s => s.name.toLowerCase() === status.name.toLowerCase() && 
      (!existingStatus || s.id !== existingStatus.id)
    );
    
    if (isDuplicate) {
      setError('A status with this name already exists');
      return;
    }
    
    // Create a unique ID if this is a new status
    const statusId = existingStatus ? existingStatus.id : 
      'status-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    
    // Save the status
    onSave({
      id: statusId,
      name: status.name,
      color: status.color
    });
    
    // Reset and close
    setStatus({
      name: '',
      color: 'bg-gray-100',
      colorHex: '#f3f4f6'
    });
    setError('');
    onClose();
  };

  const handleColorChange = (colorValue, colorHex) => {
    setStatus({
      ...status,
      color: colorValue,
      colorHex: colorHex
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{existingStatus ? 'Edit Status Column' : 'Add New Status Column'}</DialogTitle>
          <DialogDescription>
            {existingStatus 
              ? 'Update the details of this status column.' 
              : 'Create a new status column for your board.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Status Name</Label>
              <Input
                id="name"
                placeholder="Enter status name"
                value={status.name}
                onChange={(e) => {
                  setStatus({...status, name: e.target.value});
                  if (error) setError('');
                }}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>Column Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`
                      h-10 rounded-md cursor-pointer border-2 transition-all
                      ${color.value}
                      ${status.color === color.value ? 'border-blue-500 scale-110' : 'border-transparent hover:border-gray-300'}
                    `}
                    title={color.name}
                    onClick={() => handleColorChange(color.value, color.hex)}
                  />
                ))}
              </div>
              <div className="flex items-center mt-2">
                <div 
                  className={`w-10 h-10 rounded-md mr-3 ${status.color}`}
                  title="Selected color"
                />
                <span className="text-sm text-gray-500">
                  {colorOptions.find(c => c.value === status.color)?.name || 'Custom'} color
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingStatus ? 'Save Changes' : 'Add Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StatusColumnModal;
