"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Clock,
  Calendar,
  User,
  Tag,
  CheckSquare,
  AlertCircle,
  Bookmark,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  History,
  Link,
  Paperclip,
  CalendarClock,
  Timer,
  Trash2,
  Image as ImageIcon,
  FileText,
  File,
  Video,
  Play,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar-react19";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WorkItemDetails = ({ item, onClose, onUpdate }) => {
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [timeEstimateUnit, setTimeEstimateUnit] = useState("hours");

  // Initialize edited item, attachments, and other fields when item changes
  useEffect(() => {
    if (item) {
      setEditedItem({...item});

      // Initialize attachments from item if they exist
      if (item.attachments) {
        setAttachments(item.attachments);
      } else {
        setAttachments([]);
      }

      // Initialize due date and time if they exist
      if (item.dueDate) {
        setSelectedDate(new Date(item.dueDate));

        // Extract time from dueDate if it exists
        const date = new Date(item.dueDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      } else {
        setSelectedDate(null);
        setSelectedTime("");
      }

      // Initialize time estimate if it exists
      if (item.timeEstimate) {
        const { value, unit } = item.timeEstimate;
        setTimeEstimate(value);
        setTimeEstimateUnit(unit);
      } else {
        setTimeEstimate("");
        setTimeEstimateUnit("hours");
      }
    }
  }, [item]);

  if (!item) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Get icon for work item type
  const getTypeIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "bug":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "story":
        return <Bookmark className="h-4 w-4 text-green-500" />;
      default:
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get color for priority
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <ArrowUp className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <ArrowUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Get background color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "TO DO":
        return "bg-gray-100 text-gray-800";
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (onUpdate && newStatus !== item.status) {
      const updatedItem = {
        ...item,
        status: newStatus,
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "status",
            from: item.status,
            to: newStatus,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
    }
  };

  // Handle assignee change
  const handleAssigneeChange = (newAssignee) => {
    if (onUpdate) {
      const oldAssignee = item.assignee ? { ...item.assignee } : null;
      const updatedItem = {
        ...item,
        assignee: newAssignee,
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "assignee",
            from: oldAssignee,
            to: newAssignee,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
      setAssigneeDropdownOpen(false);
    }
  };

  // Handle priority change
  const handlePriorityChange = (newPriority) => {
    if (onUpdate && newPriority !== item.priority) {
      const updatedItem = {
        ...item,
        priority: newPriority,
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "priority",
            from: item.priority,
            to: newPriority,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
      setPriorityDropdownOpen(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && onUpdate) {
      const updatedItem = {
        ...item,
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "comment",
            content: comment,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
      setComment("");
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      if (onUpdate && editedItem) {
        const hasChanges =
          item.summary !== editedItem.summary ||
          item.description !== editedItem.description;

        if (hasChanges) {
          const updatedItem = {
            ...item,
            summary: editedItem.summary,
            description: editedItem.description,
            updated: new Date().toISOString(),
            activity: [
              {
                id: `act-${Date.now()}`,
                type: "edit",
                user: { id: "user-1", name: "John Doe", avatar: "JD" },
                timestamp: new Date().toISOString(),
              },
              ...(item.activity || []),
            ],
          };
          onUpdate(updatedItem);
        }
      }
    } else {
      // Enter edit mode
      setEditedItem({...item});
    }
    setEditMode(!editMode);
  };

  // Handle edited item changes
  const handleEditChange = (field, value) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding a label
  const handleAddLabel = (newLabel) => {
    if (!newLabel.trim() || !onUpdate) return;

    // Check if label already exists
    if (item.labels && item.labels.includes(newLabel)) return;

    const updatedLabels = [...(item.labels || []), newLabel];
    const updatedItem = {
      ...item,
      labels: updatedLabels,
      updated: new Date().toISOString(),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "label",
          action: "add",
          label: newLabel,
          user: { id: "user-1", name: "John Doe", avatar: "JD" },
          timestamp: new Date().toISOString(),
        },
        ...(item.activity || []),
      ],
    };
    onUpdate(updatedItem);
  };

  // Handle removing a label
  const handleRemoveLabel = (labelToRemove) => {
    if (!onUpdate) return;

    const updatedLabels = (item.labels || []).filter(label => label !== labelToRemove);
    const updatedItem = {
      ...item,
      labels: updatedLabels,
      updated: new Date().toISOString(),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "label",
          action: "remove",
          label: labelToRemove,
          user: { id: "user-1", name: "John Doe", avatar: "JD" },
          timestamp: new Date().toISOString(),
        },
        ...(item.activity || []),
      ],
    };
    onUpdate(updatedItem);
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else if (fileType.includes('pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-700" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-700" />;
    } else {
      return <Paperclip className="h-5 w-5 text-gray-500" />;
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length || !onUpdate) return;

    const file = files[0];

    // Validate file type for images and videos
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Start upload simulation
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);

          // Create new attachment object
          const newAttachment = {
            id: `att-${Date.now()}`,
            filename: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file), // Create a temporary URL for the file
            isImage,
            isVideo,
            thumbnailUrl: isImage ? URL.createObjectURL(file) : null
          };

          // If it's a video, create a thumbnail (in a real app, this would be done server-side)
          if (isVideo) {
            try {
              const video = document.createElement('video');
              video.src = newAttachment.url;

              video.onloadeddata = () => {
                // Create a canvas to capture a frame
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the video frame to the canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to a data URL
                const thumbnailUrl = canvas.toDataURL('image/jpeg');

                // Update the attachment with the thumbnail
                const updatedAttachments = attachments.map(att =>
                  att.id === newAttachment.id
                    ? { ...att, thumbnailUrl }
                    : att
                );

                setAttachments(updatedAttachments);

                // Update the item with the new attachments
                const updatedItem = {
                  ...item,
                  attachments: updatedAttachments,
                  updated: new Date().toISOString()
                };

                onUpdate(updatedItem);
              };

              // Set a timeout in case the video can't be loaded
              setTimeout(() => {
                if (!newAttachment.thumbnailUrl) {
                  newAttachment.thumbnailUrl = null;
                }
              }, 3000);
            } catch (error) {
              console.error("Error creating video thumbnail:", error);
            }
          }

          // Update attachments state
          const newAttachments = [...attachments, newAttachment];
          setAttachments(newAttachments);

          // Update item with new attachment
          const updatedItem = {
            ...item,
            attachments: newAttachments,
            updated: new Date().toISOString(),
            activity: [
              {
                id: `act-${Date.now()}`,
                type: "attachment",
                action: "add",
                filename: file.name,
                fileType: isImage ? "image" : isVideo ? "video" : "file",
                user: { id: "user-1", name: "John Doe", avatar: "JD" },
                timestamp: new Date().toISOString(),
              },
              ...(item.activity || []),
            ],
          };
          onUpdate(updatedItem);

          // Reset upload state
          setIsUploading(false);
          setUploadProgress(0);

          // Clear the file input
          e.target.value = '';
        }
        return newProgress;
      });
    }, 300); // Update every 300ms for a total of ~3 seconds
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Create a synthetic event object with the file
      const syntheticEvent = {
        target: {
          files: [file],
          value: ''
        }
      };

      // Call the file upload handler
      handleFileUpload(syntheticEvent);
    }
  };

  // Handle attachment deletion
  const handleDeleteAttachment = (attachmentId) => {
    if (!onUpdate) return;

    // Find the attachment to delete
    const attachmentToDelete = attachments.find(att => att.id === attachmentId);
    if (!attachmentToDelete) return;

    // Filter out the attachment
    const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
    setAttachments(updatedAttachments);

    // Update the item
    const updatedItem = {
      ...item,
      attachments: updatedAttachments,
      updated: new Date().toISOString(),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "attachment",
          action: "remove",
          filename: attachmentToDelete.filename,
          user: { id: "user-1", name: "John Doe", avatar: "JD" },
          timestamp: new Date().toISOString(),
        },
        ...(item.activity || []),
      ],
    };
    onUpdate(updatedItem);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle due date change
  const handleDueDateChange = (date) => {
    setSelectedDate(date);

    // If we're clearing the date
    if (!date) {
      if (item.dueDate && onUpdate) {
        const oldDate = new Date(item.dueDate);
        const formattedOldDate = formatDate(oldDate);

        const updatedItem = {
          ...item,
          dueDate: null,
          updated: new Date().toISOString(),
          activity: [
            {
              id: `act-${Date.now()}`,
              type: "dueDate",
              action: "remove",
              from: formattedOldDate,
              user: { id: "user-1", name: "John Doe", avatar: "JD" },
              timestamp: new Date().toISOString(),
            },
            ...(item.activity || []),
          ],
        };
        onUpdate(updatedItem);
      }
      return;
    }

    // If time is not set, use current time
    if (!selectedTime) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }

    updateDueDateTime(date, selectedTime);
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);

    if (selectedDate) {
      updateDueDateTime(selectedDate, newTime);
    }
  };

  // Update due date and time
  const updateDueDateTime = (date, time) => {
    if (!date || !time || !onUpdate) return;

    // Create a new date object with the selected date and time
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    // Format the old date for activity
    const oldDateStr = item.dueDate ? formatDate(new Date(item.dueDate)) : 'none';
    const newDateStr = formatDate(newDate);

    // Only update if the date or time has changed
    if (item.dueDate && new Date(item.dueDate).getTime() === newDate.getTime()) {
      return;
    }

    const updatedItem = {
      ...item,
      dueDate: newDate.toISOString(),
      updated: new Date().toISOString(),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "dueDate",
          action: item.dueDate ? "change" : "add",
          from: oldDateStr,
          to: newDateStr,
          user: { id: "user-1", name: "John Doe", avatar: "JD" },
          timestamp: new Date().toISOString(),
        },
        ...(item.activity || []),
      ],
    };
    onUpdate(updatedItem);
  };

  // Handle time estimate change
  const handleTimeEstimateChange = (value) => {
    setTimeEstimate(value);

    // Update the time estimate if it's a valid number
    if (value && !isNaN(value) && onUpdate) {
      const oldEstimate = item.timeEstimate
        ? `${item.timeEstimate.value} ${item.timeEstimate.unit}`
        : 'none';

      const newEstimate = `${value} ${timeEstimateUnit}`;

      const updatedItem = {
        ...item,
        timeEstimate: {
          value,
          unit: timeEstimateUnit
        },
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "timeEstimate",
            action: item.timeEstimate ? "change" : "add",
            from: oldEstimate,
            to: newEstimate,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
    }
  };

  // Handle time estimate unit change
  const handleTimeEstimateUnitChange = (unit) => {
    setTimeEstimateUnit(unit);

    // Update the time estimate if there's a value
    if (timeEstimate && !isNaN(timeEstimate) && onUpdate) {
      const oldEstimate = item.timeEstimate
        ? `${item.timeEstimate.value} ${item.timeEstimate.unit}`
        : 'none';

      const newEstimate = `${timeEstimate} ${unit}`;

      const updatedItem = {
        ...item,
        timeEstimate: {
          value: timeEstimate,
          unit
        },
        updated: new Date().toISOString(),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "timeEstimate",
            action: item.timeEstimate ? "change" : "add",
            from: oldEstimate,
            to: newEstimate,
            user: { id: "user-1", name: "John Doe", avatar: "JD" },
            timestamp: new Date().toISOString(),
          },
          ...(item.activity || []),
        ],
      };
      onUpdate(updatedItem);
    }
  };

  // Clear time estimate
  const handleClearTimeEstimate = () => {
    if (!item.timeEstimate || !onUpdate) return;

    const oldEstimate = `${item.timeEstimate.value} ${item.timeEstimate.unit}`;

    setTimeEstimate("");
    setTimeEstimateUnit("hours");

    const updatedItem = {
      ...item,
      timeEstimate: null,
      updated: new Date().toISOString(),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "timeEstimate",
          action: "remove",
          from: oldEstimate,
          user: { id: "user-1", name: "John Doe", avatar: "JD" },
          timestamp: new Date().toISOString(),
        },
        ...(item.activity || []),
      ],
    };
    onUpdate(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-[#00000049] bg-opacity-30 flex justify-center items-center py-20  z-50">
      <div className="bg-white w-full rounded-2xl overflow-hidden max-w-3xl h-full overflow-y-auto shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.type)}
            <span className="text-sm font-medium text-gray-500">{item.key}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Title */}
        <div className="p-4 border-b">
          {editMode ? (
            <input
              type="text"
              value={editedItem.summary}
              onChange={(e) => handleEditChange('summary', e.target.value)}
              className="w-full text-xl font-semibold mb-2 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <h2 className="text-xl font-semibold mb-2">{item.summary}</h2>
          )}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Badge className={`${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange("TO DO")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("IN PROGRESS")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("DONE")}>
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={handleEditToggle}
            >
              <Edit className="h-4 w-4 mr-1" /> {editMode ? "Save" : "Edit"}
            </Button>

            {editMode && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  setEditMode(false);
                  setEditedItem({...item});
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="flex-1">
          <TabsList className="grid grid-cols-3 p-0 h-12">
            <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none">
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none">
              Activity
            </TabsTrigger>
            <TabsTrigger value="attachments" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none">
              Attachments
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              {editMode ? (
                <textarea
                  value={editedItem.description || ""}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="w-full min-h-[100px] text-sm border border-gray-300 rounded px-2 py-1"
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-sm">{item.description || "No description provided."}</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assignee</h3>
                <div className="relative">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                  >
                    {item.assignee ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{item.assignee.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">Unassigned</span>
                    )}
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </div>

                  {assigneeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAssigneeChange(null)}
                      >
                        <span className="text-gray-500 text-sm">Unassigned</span>
                      </div>
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handleAssigneeChange({ id: "user-1", name: "John Doe", avatar: "JD" })}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">John Doe</span>
                      </div>
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handleAssigneeChange({ id: "user-2", name: "Jane Smith", avatar: "JS" })}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Jane Smith</span>
                      </div>
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handleAssigneeChange({ id: "user-3", name: "Robert Brown", avatar: "RB" })}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>RB</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Robert Brown</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Reporter</h3>
                {item.reporter && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{item.reporter.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.reporter.name}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                <div className="relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                  >
                    {getPriorityIcon(item.priority)}
                    <span className="text-sm">{item.priority}</span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </div>

                  {priorityDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border rounded-md shadow-lg z-10">
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handlePriorityChange("High")}
                      >
                        <ArrowUp className="h-4 w-4 text-red-500" />
                        <span className="text-sm">High</span>
                      </div>
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handlePriorityChange("Medium")}
                      >
                        <ArrowUp className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Medium</span>
                      </div>
                      <div
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => handlePriorityChange("Low")}
                      >
                        <ArrowDown className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Low</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sprint</h3>
                <span className="text-sm">{item.sprint?.name || "None"}</span>
              </div>

              {/* Due Date Field */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
                  Due Date
                </h3>
                <div className="flex items-center gap-2">
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 text-sm justify-start ${selectedDate ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {selectedDate ? formatDate(selectedDate) : "Set date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          handleDueDateChange(date);
                          setIsDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {selectedDate && (
                    <>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="w-24 h-8 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleDueDateChange(null)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Time Estimate Field */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Timer className="h-4 w-4 mr-1 text-gray-400" />
                  Time Estimate
                </h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Estimate"
                    value={timeEstimate}
                    onChange={(e) => handleTimeEstimateChange(e.target.value)}
                    className="w-20 h-8 text-sm"
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-sm">
                        {timeEstimateUnit}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleTimeEstimateUnitChange("minutes")}>
                        minutes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTimeEstimateUnitChange("hours")}>
                        hours
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTimeEstimateUnitChange("days")}>
                        days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTimeEstimateUnitChange("weeks")}>
                        weeks
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {item.timeEstimate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={handleClearTimeEstimate}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                <span className="text-sm">{formatDate(item.created)}</span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Updated</h3>
                <span className="text-sm">{formatDate(item.updated)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Labels</h3>
              <div className="space-y-2">
                {item.labels && item.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs group relative">
                        {label}
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveLabel(label)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No labels</span>
                )}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Add a label..."
                    className="text-xs border border-gray-300 rounded px-2 py-1 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddLabel(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleAddLabel(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="p-0">
            <div className="p-4 border-b">
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!comment.trim()}>
                    Comment
                  </Button>
                </div>
              </form>
            </div>

            <div className="p-4 space-y-4">
              {item.activity && item.activity.length > 0 ? (
                item.activity.map((activity) => (
                  <div key={activity.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{activity.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{activity.user.name}</span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>

                        {activity.type === "status" && (
                          <p className="text-sm mt-1">
                            Changed status from{" "}
                            <Badge className={getStatusColor(activity.from)}>
                              {activity.from}
                            </Badge>{" "}
                            to{" "}
                            <Badge className={getStatusColor(activity.to)}>
                              {activity.to}
                            </Badge>
                          </p>
                        )}

                        {activity.type === "comment" && (
                          <p className="text-sm mt-1">{activity.content}</p>
                        )}

                        {activity.type === "assignee" && (
                          <p className="text-sm mt-1">
                            Changed assignee from{" "}
                            {activity.from ? (
                              <span className="font-medium">{activity.from.name}</span>
                            ) : (
                              <span className="italic">Unassigned</span>
                            )}{" "}
                            to{" "}
                            {activity.to ? (
                              <span className="font-medium">{activity.to.name}</span>
                            ) : (
                              <span className="italic">Unassigned</span>
                            )}
                          </p>
                        )}

                        {activity.type === "priority" && (
                          <p className="text-sm mt-1">
                            Changed priority from{" "}
                            <span className="font-medium">{activity.from}</span>{" "}
                            to{" "}
                            <span className="font-medium">{activity.to}</span>
                          </p>
                        )}

                        {activity.type === "edit" && (
                          <p className="text-sm mt-1">
                            Edited this issue
                          </p>
                        )}

                        {activity.type === "label" && activity.action === "add" && (
                          <p className="text-sm mt-1">
                            Added label{" "}
                            <Badge variant="outline" className="text-xs">
                              {activity.label}
                            </Badge>
                          </p>
                        )}

                        {activity.type === "label" && activity.action === "remove" && (
                          <p className="text-sm mt-1">
                            Removed label{" "}
                            <Badge variant="outline" className="text-xs">
                              {activity.label}
                            </Badge>
                          </p>
                        )}

                        {activity.type === "attachment" && activity.action === "add" && (
                          <p className="text-sm mt-1">
                            Added {activity.fileType || "attachment"}{" "}
                            <span className="font-medium">{activity.filename}</span>
                          </p>
                        )}

                        {activity.type === "attachment" && activity.action === "remove" && (
                          <p className="text-sm mt-1">
                            Removed {activity.fileType || "attachment"}{" "}
                            <span className="font-medium">{activity.filename}</span>
                          </p>
                        )}

                        {activity.type === "dueDate" && activity.action === "add" && (
                          <p className="text-sm mt-1">
                            Set due date to{" "}
                            <span className="font-medium">{activity.to}</span>
                          </p>
                        )}

                        {activity.type === "dueDate" && activity.action === "change" && (
                          <p className="text-sm mt-1">
                            Changed due date from{" "}
                            <span className="font-medium">{activity.from}</span>{" "}
                            to{" "}
                            <span className="font-medium">{activity.to}</span>
                          </p>
                        )}

                        {activity.type === "dueDate" && activity.action === "remove" && (
                          <p className="text-sm mt-1">
                            Removed due date{" "}
                            <span className="font-medium">{activity.from}</span>
                          </p>
                        )}

                        {activity.type === "timeEstimate" && activity.action === "add" && (
                          <p className="text-sm mt-1">
                            Set time estimate to{" "}
                            <span className="font-medium">{activity.to}</span>
                          </p>
                        )}

                        {activity.type === "timeEstimate" && activity.action === "change" && (
                          <p className="text-sm mt-1">
                            Changed time estimate from{" "}
                            <span className="font-medium">{activity.from}</span>{" "}
                            to{" "}
                            <span className="font-medium">{activity.to}</span>
                          </p>
                        )}

                        {activity.type === "timeEstimate" && activity.action === "remove" && (
                          <p className="text-sm mt-1">
                            Removed time estimate{" "}
                            <span className="font-medium">{activity.from}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No activity yet
                </div>
              )}
            </div>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="p-4">
            {/* File upload section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button variant="outline" size="sm"
                    disabled={isUploading}>
                      <ImageIcon className="h-4 w-4 mr-1" /> Add Image
                    </Button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button variant="outline" size="sm" disabled={isUploading}>
                      <Video className="h-4 w-4 mr-1" /> Add Video
                    </Button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button variant="outline" size="sm" disabled={isUploading}>
                      <Plus className="h-4 w-4 mr-1" /> Other File
                    </Button>
                  </label>
                </div>
              </div>

              {/* Upload progress bar */}
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Drag and drop area */}
            <div
              className="border-2 border-dashed rounded-md p-6 mb-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Drag and drop files here</p>
              <p className="text-xs text-gray-400 mt-1">Supports images, videos, and other file types</p>
            </div>

            {/* Attachments grid */}
            {attachments && attachments.length > 0 ? (
              <div>
                {/* Images section */}
                {attachments.some(att => att.type.startsWith('image/')) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {attachments
                        .filter(att => att.type.startsWith('image/'))
                        .map((attachment) => (
                          <div
                            key={attachment.id}
                            className="border rounded-md overflow-hidden group relative"
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-white rounded-full p-2"
                                >
                                  <ImageIcon className="h-4 w-4 text-gray-700" />
                                </a>
                                <button
                                  className="bg-white rounded-full p-2"
                                  onClick={() => handleDeleteAttachment(attachment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium truncate">{attachment.filename}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Videos section */}
                {attachments.some(att => att.type.startsWith('video/')) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Videos</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {attachments
                        .filter(att => att.type.startsWith('video/'))
                        .map((attachment) => (
                          <div
                            key={attachment.id}
                            className="border rounded-md overflow-hidden group relative"
                          >
                            <div className="relative">
                              {attachment.thumbnailUrl ? (
                                <img
                                  src={attachment.thumbnailUrl}
                                  alt={attachment.filename}
                                  className="w-full h-32 object-cover"
                                />
                              ) : (
                                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                  <Video className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-2">
                                  <Play className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-white rounded-full p-2"
                                >
                                  <Play className="h-4 w-4 text-gray-700" />
                                </a>
                                <button
                                  className="bg-white rounded-full p-2"
                                  onClick={() => handleDeleteAttachment(attachment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium truncate">{attachment.filename}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Other files section */}
                {attachments.some(att => !att.type.startsWith('image/') && !att.type.startsWith('video/')) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Other Files</h4>
                    <div className="space-y-2">
                      {attachments
                        .filter(att => !att.type.startsWith('image/') && !att.type.startsWith('video/'))
                        .map((attachment) => (
                          <div
                            key={attachment.id}
                            className="border rounded-md p-3 flex items-center justify-between group hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              {/* File icon based on type */}
                              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                                {getFileIcon(attachment.type)}
                              </div>

                              {/* File details */}
                              <div>
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                  {attachment.filename}
                                </a>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(attachment.size)} • {formatDate(attachment.uploadedAt)}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <a
                                href={attachment.url}
                                download={attachment.filename}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteAttachment(attachment.id)}
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No attachments yet</p>
                <p className="text-sm mt-1">Upload files or drag and drop them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkItemDetails;
