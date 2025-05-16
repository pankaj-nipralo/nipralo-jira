"use client";

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditSprintModal = ({ isOpen, onClose, sprint, onUpdateSprint }) => {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with sprint data when modal is opened
  useEffect(() => {
    if (isOpen && sprint) {
      setFormData({
        name: sprint.name || '',
        goal: sprint.goal || '',
        startDate: sprint.startDate || '',
        endDate: sprint.endDate || ''
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, sprint]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Validate dates in real-time when either date field changes
    if (name === 'startDate' || name === 'endDate') {
      validateDates(name === 'startDate' ? value : formData.startDate, 
                   name === 'endDate' ? value : formData.endDate);
    }
  };
  
  // Validate dates
  const validateDates = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        setErrors(prev => ({
          ...prev,
          dateRange: 'Start date cannot be after end date'
        }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dateRange;
          return newErrors;
        });
        return true;
      }
    }
    return true;
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Sprint name is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      if (!validateDates(formData.startDate, formData.endDate)) {
        newErrors.dateRange = 'Start date cannot be after end date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      // Update the sprint
      const updatedSprint = {
        ...sprint,
        name: formData.name,
        goal: formData.goal,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dateRange: `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
      };
      
      onUpdateSprint(updatedSprint);
      onClose();
    } else {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen || !sprint) return null;
  
  return (
    <div className="fixed inset-0 bg-[#00000049] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Sprint</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Name <span className="text-red-500">*</span>
              </label>
              <Input 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
                placeholder="e.g., Sprint 3" 
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Goal
              </label>
              <Input
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="e.g., Complete user authentication"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate || errors.dateRange ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.startDate}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="endDate" 
                  type="date" 
                  value={formData.endDate}
                  onChange={handleChange}
                  className={errors.endDate || errors.dateRange ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.endDate}
                  </p>
                )}
              </div>
            </div>
            
            {errors.dateRange && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.dateRange}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSprintModal;
