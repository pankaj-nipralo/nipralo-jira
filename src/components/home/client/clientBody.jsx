"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ClientTable = () => {
  const router = useRouter();

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      slug: "john-doe",
      project: "Website Redesign",
      phone: "123-456-7890",
      resourcePending: "Design Assets",
      summary: "Needs homepage mockups",
      resources: [
        {
          id: 1,
          name: "UI Design",
          date: "20 May 2025, 10:00 AM",
          status: "Pending",
        },
        {
          id: 2,
          name: "Content",
          date: "21 May 2025, 02:00 PM",
          status: "Approved",
        },
      ],
      expanded: false,
      editing: false,
      createdAt: "2025-05-07T05:51:46.595+00:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      slug: "jane-smith",
      project: "Mobile App",
      phone: "987-654-3210",
      resourcePending: "API Integration",
      summary: "Requires backend support",
      resources: [
        {
          id: 1,
          name: "Images",
          date: "22 May 2025, 09:00 AM",
          status: "Pending",
        },
      ],
      expanded: false,
      editing: false,
      createdAt: "2025-05-07T05:51:46.595+00:00",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [addingResource, setAddingResource] = useState(null);
  const [newResource, setNewResource] = useState({
    name: "",
    date: "",
    status: "Pending",
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);  // Will be set based on auth later.......................................................................
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    project: "",
    phone: "",
    resourcePending: "",
    summary: "",
    resources: [],
  });

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle client details expansion
  const toggleExpand = (id) => {
    setClients(
      clients.map((client) =>
        client.id === id ? { ...client, expanded: !client.expanded } : client
      )
    );
  };

  // Toggle edit mode
  const toggleEdit = (id) => {
    setClients(
      clients.map((client) =>
        client.id === id ? { ...client, editing: !client.editing } : client
      )
    );
  };

  // Handle field changes during editing
  const handleFieldChange = (id, field, value) => {
    setClients(
      clients.map((client) =>
        client.id === id ? { ...client, [field]: value } : client
      )
    );
  };

  // Handle deleting a client (only for super admin)
  const handleDelete = (id) => {
    if (isSuperAdmin) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  // Handle adding a new resource
  const handleAddResource = (clientId) => {
    setAddingResource(clientId);
    setNewResource({ name: "", date: "", status: "Pending" });
  };

  // Handle saving a new resource
  const handleSaveResource = (clientId) => {
    setClients(
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              resources: [
                ...client.resources,
                { ...newResource, id: client.resources.length + 1 },
              ],
            }
          : client
      )
    );
    setAddingResource(null);
  };

  // Handle deleting a resource
  const handleDeleteResource = (clientId, resourceId) => {
    setClients(
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              resources: client.resources.filter(
                (res) => res.id !== resourceId
              ),
            }
          : client
      )
    );
  };

  // Handle adding a new client
  const handleAddClient = () => {
    const newClientWithId = {
      ...newClient,
      id: clients.length + 1,
      expanded: false,
      editing: false,
      resources: [],
      createdAt: new Date().toISOString(),
    };
    setClients([...clients, newClientWithId]);
    setShowAddClientModal(false);
    setNewClient({
      name: "",
      project: "",
      phone: "",
      resourcePending: "",
      summary: "",
      resources: [],
    });
  };

  const handleResourceStatusChange = (clientId, resourceId, newStatus) => {
    setClients(
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              resources: client.resources.map((resource) =>
                resource.id === resourceId
                  ? { ...resource, status: newStatus }
                  : resource
              ),
            }
          : client
      )
    );
  };

  function formatToISTDateTime(isoString) {
    const date = new Date(isoString);

    // Options for formatting
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      // timeZone: 'Asia/Kolkata'
      // timeZoneName: 'short',
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search and Add Client Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Client Management</h2>

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
          className="text-white bg-black hover:bg-gray-800 w-full md:w-auto"
          onClick={() => setShowAddClientModal(true)}
        >
          + Add Client
        </Button>
      </div>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Client</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Client Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Project"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={newClient.project}
                onChange={(e) =>
                  setNewClient({ ...newClient, project: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Resource Pending"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={newClient.resourcePending}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    resourcePending: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Client Summary"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={newClient.summary}
                onChange={(e) =>
                  setNewClient({ ...newClient, summary: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddClientModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleAddClient}
              >
                Add Client
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resources
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <React.Fragment key={client.id}>
                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="flex items-center">
                      <button className="mr-2 text-gray-500 hover:text-gray-700">
                        {client.expanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      <div className="text-sm font-medium text-gray-900">
                        {client.editing ? (
                          <input
                            type="text"
                            value={client.name}
                            onChange={(e) =>
                              handleFieldChange(
                                client.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          />
                        ) : (
                          client.name
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="text-sm text-gray-900">
                      {client.editing ? (
                        <input
                          type="text"
                          value={client.project}
                          onChange={(e) =>
                            handleFieldChange(
                              client.id,
                              "project",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        client.project
                      )}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {client.editing ? (
                        <input
                          type="tel"
                          value={client.phone}
                          onChange={(e) =>
                            handleFieldChange(
                              client.id,
                              "phone",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        client.phone
                      )}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {client.resources.length} resource(s)
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="text-sm text-gray-500">
                      {formatToISTDateTime(client.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
                    <div className="flex space-x-2">
                      <button className="text-gray-900 hover:text-gray-600 cursor-pointer justify-self-center">
                        {client.editing ? (
                          <>
                            <Button className="cursor-pointer"  onClick={() => toggleEdit(client.id)}>Save</Button>
                          </>
                        ) : (
                          <div className="flex gap-2 justify-center items-center">
                            <Edit
                              size={22}
                              onClick={() => toggleEdit(client.id)}
                            />
                            <Button
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/nipralo-jira/client/${client.slug}`
                                )
                              }
                            >
                              Details
                            </Button>
                          </div>
                        )}
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded details row */}
                {client.expanded && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Client Summary
                          </h4>
                          {client.editing ? (
                            <textarea
                              value={client.summary}
                              onChange={(e) =>
                                handleFieldChange(
                                  client.id,
                                  "summary",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1"
                              rows="3"
                            />
                          ) : (
                            <p className="text-gray-600">{client.summary}</p>
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">
                              Resources
                            </h4>
                            <Button
                              onClick={() => handleAddResource(client.id)}
                              className="flex items-center gap-1 text-xs"
                              size="sm"
                            >
                              <Plus size={14} /> Add Resource
                            </Button>
                          </div>

                          {addingResource === client.id && (
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                <input
                                  type="text"
                                  placeholder="Resource Name"
                                  value={newResource.name}
                                  onChange={(e) =>
                                    setNewResource({
                                      ...newResource,
                                      name: e.target.value,
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                                <input
                                  type="text"
                                  placeholder="Date"
                                  value={newResource.date}
                                  onChange={(e) =>
                                    setNewResource({
                                      ...newResource,
                                      date: e.target.value,
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                />
                                <select
                                  value={newResource.status}
                                  onChange={(e) =>
                                    setNewResource({
                                      ...newResource,
                                      status: e.target.value,
                                    })
                                  }
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleSaveResource(client.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                >
                                  Save Resource
                                </Button>
                                <Button
                                  onClick={() => setAddingResource(null)}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Resource
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {client.resources.map((resource) => (
                                  <tr key={resource.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {resource.name}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {resource.date}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      <select
                                        value={resource.status}
                                        onChange={(e) =>
                                          handleResourceStatusChange(
                                            client.id,
                                            resource.id,
                                            e.target.value
                                          )
                                        }
                                        className={`px-2 py-1 rounded cursor-pointer ${
                                          resource.status === "Approved"
                                            ? "bg-green-100 text-green-800"
                                            : resource.status === "Completed"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        <option
                                          value="Pending"
                                          className="bg-yellow-100 text-yellow-800"
                                        >
                                          Pending
                                        </option>
                                        <option
                                          value="Approved"
                                          className="bg-green-100 text-green-800"
                                        >
                                          Approved
                                        </option>
                                        <option
                                          value="Completed"
                                          className="bg-blue-100 text-blue-800"
                                        >
                                          Completed
                                        </option>
                                      </select>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      <button
                                        onClick={() =>
                                          handleDeleteResource(
                                            client.id,
                                            resource.id
                                          )
                                        }
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
