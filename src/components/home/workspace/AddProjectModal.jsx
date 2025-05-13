"use client";
import { useState } from "react";

const AddProjectModal = ({ isOpen, onClose, onAddProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    lead: '' // New field for project lead
  });

  // Sample list of potential project leads
  const projectLeads = [
    { id: '1', name: 'You', initials: 'YO' },
    { id: '2', name: 'Alex Johnson', initials: 'AJ' },
    { id: '3', name: 'Sam Wilson', initials: 'SW' },
    { id: '4', name: 'Taylor Smith', initials: 'TS' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) return;
    
    onAddProject({
      ...formData,
      workItems: { open: 0 },
      lead: formData.lead || 'You' // Default to 'You' if not selected
    });
    setFormData({ title: '', description: '', slug: '', lead: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000049] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Project</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project ID*</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
                <p className="mt-1 text-xs text-gray-500">This will be used in the project URL</p>
              </div>

              {/* New Project Lead Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Lead</label>
                <select
                  value={formData.lead}
                  onChange={(e) => setFormData({...formData, lead: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select a lead</option>
                  {projectLeads.map((lead) => (
                    <option key={lead.id} value={lead.name}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 cursor-pointer text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;