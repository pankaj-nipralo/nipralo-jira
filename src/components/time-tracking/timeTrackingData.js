// Dummy data for time tracking
export const timeEntries = [
  {
    id: 1,
    date: "2025-05-16",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "Homepage UI development",
    timeSpent: 4.5,
    status: "approved",
  },
  {
    id: 2,
    date: "2023-06-01",
    teamMemberId: "user-2",
    teamMemberName: "Shoaib Ansari",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "API integration for contact form",
    timeSpent: 3,
    status: "approved",
  },
  {
    id: 3,
    date: "2023-06-02",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "Responsive design fixes",
    timeSpent: 2.5,
    status: "approved",
  },
  {
    id: 4,
    date: "2023-06-02",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "User authentication implementation",
    timeSpent: 6,
    status: "approved",
  },
  {
    id: 5,
    date: "2023-06-03",
    teamMemberId: "user-6",
    teamMemberName: "Manisha Gupta",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "UI design for settings screen",
    timeSpent: 4,
    status: "approved",
  },
  {
    id: 6,
    date: "2023-06-03",
    teamMemberId: "user-4",
    teamMemberName: "Shahbaz Ansari",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "Payment gateway integration",
    timeSpent: 5.5,
    status: "approved",
  },
  {
    id: 7,
    date: "2023-06-04",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "Product listing page optimization",
    timeSpent: 3.5,
    status: "approved",
  },
  {
    id: 8,
    date: "2023-06-04",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "SEO improvements",
    timeSpent: 2,
    status: "rejected",
  },
  {
    id: 9,
    date: "2023-06-05",
    teamMemberId: "user-4",
    teamMemberName: "Shahbaz Ansari",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "Bug fixes for iOS version",
    timeSpent: 4,
    status: "submitted",
  },
  {
    id: 10,
    date: "2023-06-05",
    teamMemberId: "user-2",
    teamMemberName: "Shoaib Ansari",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "Cart functionality improvements",
    timeSpent: 3,
    status: "submitted",
  },
  {
    id: 11,
    date: "2023-06-06",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "Push notification system",
    timeSpent: 5,
    status: "submitted",
  },
  {
    id: 12,
    date: "2023-06-06",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
    epicId: "proj-3",
    epicName: "E-commerce Platform",
    taskDescription: "User reviews implementation",
    timeSpent: 4.5,
    status: "submitted",
  },
  {
    id: 13,
    date: "2023-06-07",
    teamMemberId: "user-5",
    teamMemberName: "Mohammed Zorif",
    epicId: "proj-4",
    epicName: "CRM System",
    taskDescription: "Performance optimization",
    timeSpent: 7.5,
    status: "approved",
  },
  {
    id: 14,
    date: "2023-06-07",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    epicId: "proj-2",
    epicName: "Mobile App Development",
    taskDescription: "Code review and refactoring",
    timeSpent: 3.5,
    status: "approved",
  },
  {
    id: 15,
    date: "2023-06-08",
    teamMemberId: "user-2",
    teamMemberName: "Shoaib Ansari",
    epicId: "proj-1",
    epicName: "Website Redesign",
    taskDescription: "Documentation updates",
    timeSpent: 2.5,
    status: "approved",
  },
];

export const teamMembers = [
  { id: "user-1", name: "Pankaj Gupta" },
  { id: "user-2", name: "Shoaib Ansari" },
  { id: "user-3", name: "Uzair Sayyed" },
  { id: "user-4", name: "Shahbaz Ansari" },
  { id: "user-5", name: "Mohammed Zorif" },
  { id: "user-6", name: "Manisha Gupta" },
];

export const epics = [
  { id: "proj-1", name: "Website Redesign" },
  { id: "proj-2", name: "Mobile App Development" },
  { id: "proj-3", name: "E-commerce Platform" },
  { id: "proj-4", name: "CRM System" },
  { id: "proj-5", name: "Analytics Dashboard" },
];

export const statusOptions = [
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// Helper function to get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to format date from YYYY-MM-DD to a more readable format
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
