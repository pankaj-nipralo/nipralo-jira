import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

/**
 * Initial state for the sprints slice
 */
const initialState = {
  backlogSprints: [], // Sprints in the backlog (PLANNED status)
  activeSprints: [],  // Active sprints (ACTIVE status)
  completedSprints: [], // Completed sprints (COMPLETED status)
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

/**
 * Async thunk for fetching sprints
 */
export const fetchSprints = createAsyncThunk(
  'sprints/fetchSprints',
  async (projectSlug, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use dummy data
      return generateDummyData();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for creating a new sprint
 */
export const createSprint = createAsyncThunk(
  'sprints/createSprint',
  async (sprint, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just return the sprint with an ID
      return {
        ...sprint,
        id: `sprint-${Date.now()}`,
        status: 'PLANNED',
        points: { current: 0, total: 0 },
        items: [],
        created: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for updating a sprint
 */
export const updateSprint = createAsyncThunk(
  'sprints/updateSprint',
  async (sprint, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return sprint;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for starting a sprint
 */
export const startSprint = createAsyncThunk(
  'sprints/startSprint',
  async (sprintId, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would be an API call
      const state = getState();
      const sprint = state.sprints.backlogSprints.find(s => s.id === sprintId);

      if (!sprint) {
        throw new Error('Sprint not found');
      }

      return {
        ...sprint,
        status: 'ACTIVE',
        startedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for completing a sprint
 */
export const completeSprint = createAsyncThunk(
  'sprints/completeSprint',
  async ({ sprintId, completionData, incompleteItemsDestination }, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would be an API call
      const state = getState();
      const sprint = state.sprints.activeSprints.find(s => s.id === sprintId);

      if (!sprint) {
        throw new Error('Sprint not found');
      }

      // Get completed items
      const completedItems = sprint.items.filter(item => item.status === 'DONE');
      const incompleteItems = sprint.items.filter(item => item.status !== 'DONE');

      return {
        sprint: {
          ...sprint,
          status: 'COMPLETED',
          completionData,
          items: completedItems,
          completedAt: new Date().toISOString(),
        },
        incompleteItems,
        incompleteItemsDestination,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Sprint slice with reducers and actions
 */
const sprintSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    // Add a task to a sprint
    addTaskToSprint: (state, action) => {
      const { sprintId, task } = action.payload;

      // Check if the sprint is in backlog sprints
      const backlogSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === sprintId);
      if (backlogSprintIndex !== -1) {
        state.backlogSprints[backlogSprintIndex].items.push(task);
        return;
      }

      // Check if the sprint is in active sprints
      const activeSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === sprintId);
      if (activeSprintIndex !== -1) {
        state.activeSprints[activeSprintIndex].items.push(task);
      }
    },

    // Remove a task from a sprint
    removeTaskFromSprint: (state, action) => {
      const { sprintId, taskId } = action.payload;

      // Check if the sprint is in backlog sprints
      const backlogSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === sprintId);
      if (backlogSprintIndex !== -1) {
        state.backlogSprints[backlogSprintIndex].items = state.backlogSprints[backlogSprintIndex].items.filter(
          item => item.id !== taskId
        );
        return;
      }

      // Check if the sprint is in active sprints
      const activeSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === sprintId);
      if (activeSprintIndex !== -1) {
        state.activeSprints[activeSprintIndex].items = state.activeSprints[activeSprintIndex].items.filter(
          item => item.id !== taskId
        );
      }
    },

    // Move a task between sprints
    moveTask: (state, action) => {
      const { taskId, sourceSprintId, targetSprintId, targetIndex } = action.payload;

      // Find the source sprint and task
      let sourceSprintList, sourceSprintIndex, task;

      // Check in backlog sprints
      sourceSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === sourceSprintId);
      if (sourceSprintIndex !== -1) {
        sourceSprintList = 'backlogSprints';
        const taskIndex = state.backlogSprints[sourceSprintIndex].items.findIndex(item => item.id === taskId);
        if (taskIndex !== -1) {
          task = { ...state.backlogSprints[sourceSprintIndex].items[taskIndex] };
          state.backlogSprints[sourceSprintIndex].items.splice(taskIndex, 1);
        }
      }

      // If not found, check in active sprints
      if (!task) {
        sourceSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === sourceSprintId);
        if (sourceSprintIndex !== -1) {
          sourceSprintList = 'activeSprints';
          const taskIndex = state.activeSprints[sourceSprintIndex].items.findIndex(item => item.id === taskId);
          if (taskIndex !== -1) {
            task = { ...state.activeSprints[sourceSprintIndex].items[taskIndex] };
            state.activeSprints[sourceSprintIndex].items.splice(taskIndex, 1);
          }
        }
      }

      if (!task) return; // Task not found

      // Find the target sprint
      let targetSprintList, targetSprintIndex;

      // Check in backlog sprints
      targetSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === targetSprintId);
      if (targetSprintIndex !== -1) {
        targetSprintList = 'backlogSprints';
        if (targetIndex !== undefined) {
          state.backlogSprints[targetSprintIndex].items.splice(targetIndex, 0, task);
        } else {
          state.backlogSprints[targetSprintIndex].items.push(task);
        }
      } else {
        // Check in active sprints
        targetSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === targetSprintId);
        if (targetSprintIndex !== -1) {
          targetSprintList = 'activeSprints';
          if (targetIndex !== undefined) {
            state.activeSprints[targetSprintIndex].items.splice(targetIndex, 0, task);
          } else {
            state.activeSprints[targetSprintIndex].items.push(task);
          }
        }
      }
    },

    // Move a task between backlog and sprint
    moveTaskBetweenBacklogAndSprint: (state, action) => {
      const { taskId, sourceType, sourceId, targetType, targetId, targetIndex } = action.payload;
      let task = null;

      // Get task from source
      if (sourceType === 'sprint') {
        // Find which sprint list contains the source sprint
        let sourceSprintList, sourceSprintIndex;

        // Check in backlog sprints
        sourceSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === sourceId);
        if (sourceSprintIndex !== -1) {
          sourceSprintList = 'backlogSprints';
          const taskIndex = state.backlogSprints[sourceSprintIndex].items.findIndex(item => item.id === taskId);
          if (taskIndex !== -1) {
            task = { ...state.backlogSprints[sourceSprintIndex].items[taskIndex] };
            state.backlogSprints[sourceSprintIndex].items.splice(taskIndex, 1);
          }
        }

        // If not found, check in active sprints
        if (!task) {
          sourceSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === sourceId);
          if (sourceSprintIndex !== -1) {
            sourceSprintList = 'activeSprints';
            const taskIndex = state.activeSprints[sourceSprintIndex].items.findIndex(item => item.id === taskId);
            if (taskIndex !== -1) {
              task = { ...state.activeSprints[sourceSprintIndex].items[taskIndex] };
              state.activeSprints[sourceSprintIndex].items.splice(taskIndex, 1);
            }
          }
        }
      }

      // If task was found and target is a sprint, add to target sprint
      if (task && targetType === 'sprint') {
        // Find which sprint list contains the target sprint
        let targetSprintList, targetSprintIndex;

        // Check in backlog sprints
        targetSprintIndex = state.backlogSprints.findIndex(sprint => sprint.id === targetId);
        if (targetSprintIndex !== -1) {
          targetSprintList = 'backlogSprints';
          if (targetIndex !== undefined) {
            state.backlogSprints[targetSprintIndex].items.splice(targetIndex, 0, task);
          } else {
            state.backlogSprints[targetSprintIndex].items.push(task);
          }
        } else {
          // Check in active sprints
          targetSprintIndex = state.activeSprints.findIndex(sprint => sprint.id === targetId);
          if (targetSprintIndex !== -1) {
            targetSprintList = 'activeSprints';
            if (targetIndex !== undefined) {
              state.activeSprints[targetSprintIndex].items.splice(targetIndex, 0, task);
            } else {
              state.activeSprints[targetSprintIndex].items.push(task);
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSprints
      .addCase(fetchSprints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.backlogSprints = action.payload.sprints.filter(sprint => sprint.status === 'PLANNED');
        state.activeSprints = action.payload.sprints.filter(sprint => sprint.status === 'ACTIVE');
        state.completedSprints = action.payload.sprints.filter(sprint => sprint.status === 'COMPLETED');
      })
      .addCase(fetchSprints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle createSprint
      .addCase(createSprint.fulfilled, (state, action) => {
        state.backlogSprints.push(action.payload);
      })

      // Handle updateSprint
      .addCase(updateSprint.fulfilled, (state, action) => {
        const sprint = action.payload;

        // Check if the sprint is in backlog sprints
        const backlogSprintIndex = state.backlogSprints.findIndex(s => s.id === sprint.id);
        if (backlogSprintIndex !== -1) {
          state.backlogSprints[backlogSprintIndex] = sprint;
          return;
        }

        // Check if the sprint is in active sprints
        const activeSprintIndex = state.activeSprints.findIndex(s => s.id === sprint.id);
        if (activeSprintIndex !== -1) {
          state.activeSprints[activeSprintIndex] = sprint;
        }
      })

      // Handle startSprint
      .addCase(startSprint.fulfilled, (state, action) => {
        const sprint = action.payload;

        // Remove from backlog sprints
        state.backlogSprints = state.backlogSprints.filter(s => s.id !== sprint.id);

        // Add to active sprints
        state.activeSprints.push(sprint);
      })

      // Handle completeSprint
      .addCase(completeSprint.fulfilled, (state, action) => {
        const { sprint, incompleteItems, incompleteItemsDestination } = action.payload;

        // Remove from active sprints
        state.activeSprints = state.activeSprints.filter(s => s.id !== sprint.id);

        // Add to completed sprints
        state.completedSprints.push(sprint);

        // Handle incomplete items
        if (incompleteItems.length > 0) {
          if (incompleteItemsDestination === 'backlog') {
            // Add to backlog items (this would be handled by the task slice)
          } else if (incompleteItemsDestination === 'next') {
            // Find the next planned sprint
            if (state.backlogSprints.length > 0) {
              // Sort by start date to find the earliest planned sprint
              const nextSprint = [...state.backlogSprints].sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate)
              )[0];

              // Add incomplete items to the next sprint
              const nextSprintIndex = state.backlogSprints.findIndex(s => s.id === nextSprint.id);
              if (nextSprintIndex !== -1) {
                state.backlogSprints[nextSprintIndex].items.push(...incompleteItems);
              }
            }
          }
        }
      })
  },
});

// Helper function to generate dummy data (for development only)
function generateDummyData() {
  const epicsList = [
    { id: "epic-1", name: "User Authentication", color: "#FF5630" },
    { id: "epic-2", name: "Customer Management", color: "#4C9AFF" },
    { id: "epic-3", name: "Reporting", color: "#36B37E" },
  ];

  return {
    sprints: [
      {
        id: "sprint-1",
        name: "CRM Sprint 1",
        goal: "Complete core CRM functionality",
        dateRange: "6 May - 20 May",
        startDate: "2023-05-06",
        endDate: "2023-05-20",
        status: "ACTIVE",
        points: { current: 8, total: 13 },
        items: [
          {
            id: "crm-12",
            key: "CRM-12",
            title: "Setup database schema",
            status: "TO DO",
            assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
            estimate: "0m",
            type: "task",
            priority: "High",
            epic: epicsList[1], // Customer Management
          },
          {
            id: "crm-4",
            key: "CRM-4",
            title: "Sample: Log Customer Interactions",
            status: "IN PROGRESS",
            assignee: { id: "user-1", name: "John Doe", avatar: "JD" },
            estimate: "0m",
            labels: ["SAMPLE", "CUSTOMER LOG"],
            type: "task",
            priority: "Medium",
            epic: epicsList[1], // Customer Management
          },
        ],
      },
      {
        id: "sprint-2",
        name: "CRM Sprint 2",
        goal: "Implement user management",
        dateRange: "21 May - 3 June",
        startDate: "2023-05-21",
        endDate: "2023-06-03",
        status: "PLANNED",
        points: { current: 0, total: 21 },
        items: [
          {
            id: "crm-15",
            key: "CRM-15",
            title: "User authentication flow",
            status: "TO DO",
            assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
            estimate: "8h",
            type: "task",
            priority: "High",
            epic: epicsList[0], // User Authentication
          },
          {
            id: "crm-16",
            key: "CRM-16",
            title: "Role-based permissions",
            status: "TO DO",
            assignee: { id: "user-3", name: "Robert Brown", avatar: "RB" },
            estimate: "13h",
            labels: ["SECURITY", "USER MANAGEMENT"],
            type: "task",
            priority: "High",
            epic: epicsList[0], // User Authentication
          },
        ],
      },
    ],
    backlogItems: [
      {
        id: "crm-17",
        key: "CRM-17",
        title: "Export customer data to CSV",
        status: "TO DO",
        assignee: null,
        estimate: "5h",
        type: "task",
        priority: "Medium",
        epic: epicsList[2], // Reporting
      },
      {
        id: "crm-18",
        key: "CRM-18",
        title: "Generate monthly sales report",
        status: "TO DO",
        assignee: { id: "user-2", name: "Jane Smith", avatar: "JS" },
        estimate: "8h",
        type: "task",
        priority: "Medium",
        epic: epicsList[2], // Reporting
      },
    ],
  };
}

// Export actions
export const {
  addTaskToSprint,
  removeTaskFromSprint,
  moveTask,
  moveTaskBetweenBacklogAndSprint
} = sprintSlice.actions;

// Selectors
export const selectBacklogSprints = state => state.sprints.backlogSprints;
export const selectActiveSprints = state => state.sprints.activeSprints;
export const selectCompletedSprints = state => state.sprints.completedSprints;
export const selectAllSprints = state => [
  ...state.sprints.backlogSprints,
  ...state.sprints.activeSprints,
  ...state.sprints.completedSprints,
];
export const selectSprintById = (state, sprintId) => {
  const allSprints = [
    ...state.sprints.backlogSprints,
    ...state.sprints.activeSprints,
    ...state.sprints.completedSprints,
  ];
  return allSprints.find(sprint => sprint.id === sprintId);
};
export const selectSprintStatus = state => state.sprints.status;
export const selectSprintError = state => state.sprints.error;

export default sprintSlice.reducer;
