import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

/**
 * Initial state for the tasks slice
 */
const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: '',
    assignee: [],
    priority: [],
    status: [],
    epic: 'all',
  },
};

/**
 * Async thunk for fetching tasks
 * In a real app, this would make an API call to your backend
 */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectSlug, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/projects/${projectSlug}/tasks`);
      // return await response.json();
      
      // For now, we'll return dummy data
      return generateDummyTasks(projectSlug);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for creating a new task
 */
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(task)
      // });
      // return await response.json();
      
      // For now, we'll just return the task with an ID
      return {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for updating a task
 */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/tasks/${task.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(task)
      // });
      // return await response.json();
      
      // For now, we'll just return the updated task
      return {
        ...task,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk for deleting a task
 */
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/tasks/${taskId}`, {
      //   method: 'DELETE'
      // });
      
      // Return the ID so we can remove it from state
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Task slice with reducers and actions
 */
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set filters for tasks
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Move a task to a different status (for Kanban board)
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const taskIndex = state.items.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.items[taskIndex].status = newStatus;
        state.items[taskIndex].updatedAt = new Date().toISOString();
      }
    },
    
    // Set a due date for a task
    setDueDate: (state, action) => {
      const { taskId, dueDate } = action.payload;
      const taskIndex = state.items.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.items[taskIndex].dueDate = dueDate;
        state.items[taskIndex].updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle createTask
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      // Handle updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Handle deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      });
  },
});

// Helper function to generate dummy tasks for development
function generateDummyTasks(projectSlug) {
  const statuses = ['TO DO', 'IN PROGRESS', 'TESTING', 'DONE'];
  const priorities = ['Low', 'Medium', 'High'];
  const types = ['task', 'bug', 'story', 'epic'];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `task-${i + 1}`,
    key: `${projectSlug.toUpperCase()}-${i + 1}`,
    title: `Task ${i + 1} for ${projectSlug}`,
    description: `This is a description for task ${i + 1} in project ${projectSlug}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    assignee: Math.random() > 0.3 ? {
      id: `user-${Math.floor(Math.random() * 4) + 1}`,
      name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'][Math.floor(Math.random() * 4)],
      avatar: ['JD', 'JS', 'MJ', 'SW'][Math.floor(Math.random() * 4)],
    } : null,
    estimate: {
      hours: Math.floor(Math.random() * 8),
      minutes: Math.floor(Math.random() * 60),
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
    epic: Math.random() > 0.5 ? `epic-${Math.floor(Math.random() * 3) + 1}` : null,
  }));
}

// Export actions
export const { setFilters, clearFilters, moveTask, setDueDate } = taskSlice.actions;

// Selectors
export const selectAllTasks = state => state.tasks.items;
export const selectTaskById = (state, taskId) => state.tasks.items.find(task => task.id === taskId);
export const selectTaskStatus = state => state.tasks.status;
export const selectTaskError = state => state.tasks.error;
export const selectTaskFilters = state => state.tasks.filters;

// Memoized selector for filtered tasks
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectTaskFilters],
  (tasks, filters) => {
    return tasks.filter(task => {
      // Filter by search query
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter by assignee
      if (filters.assignee.length > 0) {
        if (!task.assignee) {
          if (!filters.assignee.includes('unassigned')) {
            return false;
          }
        } else if (!filters.assignee.includes(task.assignee.id)) {
          return false;
        }
      }
      
      // Filter by priority
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      
      // Filter by status
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      
      // Filter by epic
      if (filters.epic !== 'all') {
        if (filters.epic === 'none' && task.epic !== null) {
          return false;
        } else if (filters.epic !== 'none' && task.epic !== filters.epic) {
          return false;
        }
      }
      
      return true;
    });
  }
);

// Export the reducer
export default taskSlice.reducer;
