// Dummy data for time tracking
export const timeEntries = [
  {
    id: 1,
    date: "2025-05-16",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
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
    taskDescription: "API integration for contact form",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 3,
    date: "2023-06-02",
    teamMemberId: "user-1",
    teamMemberName: "Pankaj Gupta",
    taskDescription: "Responsive design fixes",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
  },
  {
    id: 4,
    date: "2023-06-02",
    teamMemberId: "user-3",
    teamMemberName: "Uzair Sayyed",
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
    taskDescription: "UI design for settings screen",
    timeSpent: {
      hours: 4,
      minutes: 30,
    },
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

export const propjects = [
  { id: "proj-1", name: "Purple Ribbon" },
  { id: "proj-2", name: "Warpp" },
  { id: "proj-3", name: "Niralo" },
  { id: "proj-4", name: "Bansi Metha" },
  { id: "proj-5", name: "Ruby Print" },
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
