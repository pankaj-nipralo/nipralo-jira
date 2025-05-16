"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getCurrentDate, teamMembers, epics, statusOptions } from './timeTrackingData';

const TimeEntryModal = ({
  isOpen,
  onClose,
  onSave,
  editEntry = null,
  isAdmin = true // For controlling approval/rejection access
}) => {
  const initialFormState = {
    id: null,
    date: getCurrentDate(),
    teamMemberId: '',
    epicId: '',
    taskDescription: '',
    timeSpent: '',
    status: 'submitted'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // If editing an entry, populate the form
  useEffect(() => {
    if (editEntry) {
      setFormData({
        id: editEntry.id,
        date: editEntry.date,
        teamMemberId: editEntry.teamMemberId,
        epicId: editEntry.epicId,
        taskDescription: editEntry.taskDescription,
        timeSpent: editEntry.timeSpent.toString(),
        status: editEntry.status
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editEntry, isOpen]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.teamMemberId) {
      newErrors.teamMemberId = 'Team member is required';
    }

    if (!formData.epicId) {
      newErrors.epicId = 'Epic is required';
    }

    if (!formData.taskDescription.trim()) {
      newErrors.taskDescription = 'Task description is required';
    }

    if (!formData.timeSpent) {
      newErrors.timeSpent = 'Time spent is required';
    } else if (isNaN(formData.timeSpent) || parseFloat(formData.timeSpent) <= 0) {
      newErrors.timeSpent = 'Time spent must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Find the team member and epic names
      const teamMember = teamMembers.find(member => member.id === formData.teamMemberId);
      const epic = epics.find(ep => ep.id === formData.epicId);

      // Prepare data for saving
      const entryData = {
        ...formData,
        teamMemberName: teamMember ? teamMember.name : '',
        epicName: epic ? epic.name : '',
        timeSpent: parseFloat(formData.timeSpent)
      };

      onSave(entryData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editEntry ? 'Edit Task Time' : 'Add Task Time'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSpent">Hours Spent</Label>
                <Input
                  id="timeSpent"
                  name="timeSpent"
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="0.0"
                  value={formData.timeSpent}
                  onChange={handleChange}
                  className={errors.timeSpent ? 'border-red-500' : ''}
                />
                {errors.timeSpent && (
                  <p className="text-red-500 text-xs mt-1">{errors.timeSpent}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamMemberId">Team Member</Label>
              <Select
                value={formData.teamMemberId}
                onValueChange={(value) => handleSelectChange('teamMemberId', value)}
              >
                <SelectTrigger className={errors.teamMemberId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teamMemberId && (
                <p className="text-red-500 text-xs mt-1">{errors.teamMemberId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="epicId">Epic</Label>
              <Select
                value={formData.epicId}
                onValueChange={(value) => handleSelectChange('epicId', value)}
              >
                <SelectTrigger className={errors.epicId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.epicId && (
                <p className="text-red-500 text-xs mt-1">{errors.epicId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea
                id="taskDescription"
                name="taskDescription"
                placeholder="Describe the work done"
                value={formData.taskDescription}
                onChange={handleChange}
                className={errors.taskDescription ? 'border-red-500' : ''}
              />
              {errors.taskDescription && (
                <p className="text-red-500 text-xs mt-1">{errors.taskDescription}</p>
              )}
            </div>

            {isAdmin && editEntry && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editEntry ? 'Update' : 'Add'} Task Time
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryModal;
