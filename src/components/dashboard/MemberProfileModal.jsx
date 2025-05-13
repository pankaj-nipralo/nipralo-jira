"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  X, 
  Mail, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";

const MemberProfileModal = ({ isOpen, onClose, member, onUpdateMember, onRemoveMember }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: ''
  });

  // Initialize form data when member changes or editing mode is activated
  React.useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        email: member.email || ''
      });
    }
  }, [member, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Create initials for avatar if name changed
    let avatar = member.avatar;
    if (member.name !== formData.name) {
      const nameParts = formData.name.split(' ');
      avatar = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}` 
        : formData.name.substring(0, 2);
      avatar = avatar.toUpperCase();
    }
    
    const updatedMember = {
      ...member,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      avatar
    };
    
    onUpdateMember(updatedMember);
    setIsEditing(false);
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Team Member Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 text-xl font-bold flex items-center justify-center mr-4">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{member.email || 'No email provided'}</span>
                </div>
                
                {member.tasksCompleted !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium">Completed Tasks</span>
                      </div>
                      <div className="text-xl font-bold mt-1">{member.tasksCompleted || 0}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                      <div className="text-xl font-bold mt-1">{member.tasksInProgress || 0}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
                      onRemoveMember(member.id);
                      onClose();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
