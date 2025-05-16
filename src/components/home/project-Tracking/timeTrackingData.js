// Import data from the main time tracking data file
import {
  teamMembers,
  statusOptions,
  getCurrentDate,
  formatDate,
} from "@/components/time-tracking/timeTrackingData";

const timeEntries = [
  // Ruby Print (proj-1) entries
  {
    id: 1,
    date: "2023-05-16",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-3",
    epicName: "Website Redesign",
    taskDescription: "Homepage UI development",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 2,
    date: "2023-06-01",
    teamMemberId: "user-2",
    teamMemberName: "Shoaib Ansari",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "API integration for contact form",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 3,
    date: "2023-06-02",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "Responsive design fixes",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },

  // Warpp (proj-2) entries
  {
    id: 4,
    date: "2023-06-02",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "User authentication implementation",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 5,
    date: "2023-06-03",
    teamMemberId: "user-6",
    teamMemberName: "Manisha Gupta",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "UI design for settings screen",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 6,
    date: "2023-06-04",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "Push notification system",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },

  // Niralo (proj-3) entries
  {
    id: 7,
    date: "2023-06-03",
    teamMemberId: "user-4",
    teamMemberName: "Shahbaz Ansari",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "Payment gateway integration",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 8,
    date: "2023-06-05",
    teamMemberId: "user-2",
    teamMemberName: "Shoaib Ansari",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "Cart functionality improvements",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },

  // Bansi Metha (proj-4) entries
  {
    id: 9,
    date: "2023-06-04",
    teamMemberId: "user-5",
    teamMemberName: "Mohammed Zorif",
    epicId: "proj-4",
    epicName: "CRM System",
    taskDescription: "Performance optimization",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 10,
    date: "2023-06-06",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-4",
    epicName: "CRM System",
    taskDescription: "User reviews implementation",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },

  // Purple Ribbon (proj-5) entries
  {
    id: 11,
    date: "2023-06-07",
    teamMemberId: "user-5",
    teamMemberName: "Mohammed Zorif",
    epicId: "proj-5",
    epicName: "Analytics Dashboard",
    taskDescription: "Data visualization components",
    timeSpent: {
      hours: 4,
      minutes: 0,
    },
  },
];
// For backward compatibility, we're keeping both project and epic terminology
export const projects = [
  { id: "proj-1", name: "Ruby Print" },
  { id: "proj-2", name: "Warpp" },
  { id: "proj-3", name: "Niralo" },
  { id: "proj-4", name: "Bansi Metha" },
  { id: "proj-5", name: "Purple Ribbon" },
];

// Export all the imported data
export { timeEntries, teamMembers, statusOptions, getCurrentDate, formatDate };
