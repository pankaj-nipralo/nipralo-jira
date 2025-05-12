"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ClientHeader = () => {
  const [addClient, setAddClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    email: "",
    phone: "",
    resourcePending: "",
    summary: ""
  });
  const addClientRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addClientRef.current && !addClientRef.current.contains(event.target)) {
        setAddClient(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    alert(`Form submitted:\n${JSON.stringify(formData, null, 2)}`);
    setAddClient(false);
    // Reset form
    setFormData({
      name: "",
      project: "",
      email: "",
      phone: "",
      resourcePending: "",
      summary: ""
    });
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center p-4 relative gap-4">
      <h2 className="text-2xl font-bold">Client</h2>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Button
        className="text-white bg-black hover:bg-gray-800 cursor-pointer w-full md:w-auto"
        onClick={() => setAddClient(!addClient)}
      >
        + Add Client
      </Button>

      {addClient && (
        <div className="fixed inset-0 bg-[#00000049] bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={addClientRef}
            className="w-full max-w-md mx-4 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">Add Client</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Client Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="project"
                    placeholder="Project"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.project}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Client Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Client Phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="resourcePending"
                    placeholder="Resource Pending"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.resourcePending}
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="summary"
                    placeholder="Client Summary"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.summary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                    onClick={() => setAddClient(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default ClientHeader;