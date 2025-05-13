"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Share2,
  MoreHorizontal
} from "lucide-react";
import ClientPageNav from "@/components/client/ClientPageNav";

const DocumentsPage = () => {
  const params = useParams();
  const { slug } = params;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock documents data - in a real app, you would fetch this from an API
    const mockDocuments = [
      {
        id: 1,
        name: "Project Brief.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "Admin",
        uploadedAt: "2025-05-10T14:30:00",
        lastModified: "2025-05-10T14:30:00",
        description: "Initial project brief and requirements document"
      },
      {
        id: 2,
        name: "Design Guidelines.docx",
        type: "doc",
        size: "1.8 MB",
        uploadedBy: "Designer",
        uploadedAt: "2025-05-12T09:15:00",
        lastModified: "2025-05-15T11:20:00",
        description: "Brand guidelines and design specifications"
      },
      {
        id: 3,
        name: "Homepage Mockup.png",
        type: "image",
        size: "4.2 MB",
        uploadedBy: "Designer",
        uploadedAt: "2025-05-18T16:45:00",
        lastModified: "2025-05-18T16:45:00",
        description: "Final homepage design mockup"
      },
      {
        id: 4,
        name: "Content Plan.xlsx",
        type: "spreadsheet",
        size: "1.1 MB",
        uploadedBy: "Content Manager",
        uploadedAt: "2025-05-20T10:30:00",
        lastModified: "2025-05-22T14:10:00",
        description: "Content plan and sitemap"
      },
      {
        id: 5,
        name: "Technical Specifications.pdf",
        type: "pdf",
        size: "3.5 MB",
        uploadedBy: "Developer",
        uploadedAt: "2025-05-25T11:20:00",
        lastModified: "2025-05-25T11:20:00",
        description: "Technical specifications and requirements"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 500);
  }, [slug]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <File className="h-6 w-6 text-red-500" />;
      case 'doc':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-6 w-6 text-green-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-700" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6">
      <ClientPageNav clientId={slug} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents for Client {slug}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="mr-4">
                    {getFileIcon(doc.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{doc.name}</h3>
                      <div className="flex space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Download className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <Share2 className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-1 mb-3">{doc.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Size:</span> {doc.size}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded by:</span> {doc.uploadedBy}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span> {formatDate(doc.uploadedAt)}
                      </div>
                    </div>

                    {doc.uploadedAt !== doc.lastModified && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Last modified:</span> {formatDate(doc.lastModified)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
