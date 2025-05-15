"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const EditBacklogItemModal = ({ isOpen, onClose, item, onUpdate, onDelete }) => {
  const initialFormState = {
    id: '',
    key: '',
    title: '',
    description: '',
    status: 'TO DO',
    assignee: null,
    estimate: '0m',
    labels: [],
    type: 'task',
    priority: 'Medium'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [labelInput, setLabelInput] = useState('');

  // Available options for dropdowns
  const statusOptions = ['TO DO', 'IN PROGRESS', 'DONE'];
  const assigneeOptions = [
    { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
    { id: 'user-3', name: 'Robert Brown', avatar: 'RB' }
  ];
  const estimateOptions = ['0m', '1h', '2h', '4h', '8h', '1d', '2d', '1w'];

  // Initialize form data when item changes or modal opens
  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        ...item,
        // Ensure labels is an array
        labels: item.labels || []
      });
      setErrors({});
    }
  }, [isOpen, item]);

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
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle assignee selection
  const handleAssigneeChange = (assigneeId) => {
    const assignee = (assigneeId && assigneeId !== 'unassigned')
      ? assigneeOptions.find(a => a.id === assigneeId)
      : null;

    setFormData(prev => ({
      ...prev,
      assignee: assignee
    }));
  };

  // Handle adding a label
  const handleAddLabel = () => {
    if (!labelInput.trim()) return;

    // Don't add duplicate labels
    if (formData.labels.includes(labelInput.trim().toUpperCase())) {
      setLabelInput('');
      return;
    }

    setFormData(prev => ({
      ...prev,
      labels: [...prev.labels, labelInput.trim().toUpperCase()]
    }));

    setLabelInput('');
  };

  // Handle removing a label
  const handleRemoveLabel = (labelToRemove) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Summary is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onUpdate(formData);
      onClose();
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${formData.title}"?`)) {
      onDelete(formData.id);
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-[#00000049] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit issue {formData.key}</h2>
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
                Summary <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Enter a summary"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Add a description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <Select
                  value={formData.assignee ? formData.assignee.id : 'unassigned'}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {assigneeOptions.map(assignee => (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium mr-2">
                            {assignee.avatar}
                          </div>
                          {assignee.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimate
                </label>
                <Select
                  value={formData.estimate}
                  onValueChange={(value) => handleSelectChange('estimate', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select estimate" />
                  </SelectTrigger>
                  <SelectContent>
                    {estimateOptions.map(estimate => (
                      <SelectItem key={estimate} value={estimate}>
                        {estimate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labels
              </label>
              <div className="flex space-x-2">
                <Input
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Add a label"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddLabel}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.labels && formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.labels.map((label, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {label}
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(label)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBacklogItemModal;
