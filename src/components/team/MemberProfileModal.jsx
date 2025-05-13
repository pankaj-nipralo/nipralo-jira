"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  BarChart2,
  CheckCircle,
  Clock,
  Edit,
  Trash2
} from "lucide-react";

const MemberProfileModal = ({ isOpen, onClose, member, onEdit, onDelete }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Team Member Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Avatar and basic info */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-600 text-2xl font-bold flex items-center justify-center mb-4">
              {member.avatar}
            </div>
            <h3 className="text-xl font-medium text-center">{member.name}</h3>
            <p className="text-gray-500 text-center mb-4">{member.role}</p>
            
            <div className="flex space-x-2 mb-6">
              <Button size="sm" variant="outline" className="h-8" onClick={() => window.location.href = `mailto:${member.email}`}>
                <Mail className="h-4 w-4 mr-1" /> Email
              </Button>
              <Button size="sm" variant="outline" className="h-8" onClick={() => window.location.href = `tel:${member.phone}`}>
                <Phone className="h-4 w-4 mr-1" /> Call
              </Button>
            </div>
            
            <div className="w-full space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => onEdit(member)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
                    onDelete(member.id);
                    onClose();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remove from Team
              </Button>
            </div>
          </div>
          
          {/* Right column - Detailed info */}
          <div className="md:w-2/3">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-medium mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div>{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div>{member.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tasks */}
              <div>
                <h4 className="text-lg font-medium mb-3">Tasks</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <div className="text-2xl font-bold">{member.tasksCompleted}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <div className="text-2xl font-bold">{member.tasksInProgress}</div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div>
                <h4 className="text-lg font-medium mb-3">Additional Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Joined Date</div>
                      <div>{new Date(member.joinedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Availability</div>
                      <div>{member.availability}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="text-lg font-medium mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
