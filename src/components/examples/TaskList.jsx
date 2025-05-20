'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  setFilters,
  clearFilters,
  selectFilteredTasks,
  selectTaskStatus,
  selectTaskError,
  selectTaskFilters
} from '@/store/taskSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, X } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Example component that demonstrates how to use the task slice with Redux
 * 
 * This component shows:
 * 1. How to fetch data using async thunks
 * 2. How to select data using memoized selectors
 * 3. How to dispatch various actions for CRUD operations
 * 4. How to implement filtering
 */
export default function TaskList({ projectSlug = 'demo' }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const status = useAppSelector(selectTaskStatus);
  const error = useAppSelector(selectTaskError);
  const filters = useAppSelector(selectTaskFilters);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch tasks when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks(projectSlug));
    }
  }, [status, dispatch, projectSlug]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchQuery }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);
  
  // Handle creating a new task
  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      dispatch(createTask({
        title: newTaskTitle,
        description: '',
        status: 'TO DO',
        priority: 'Medium',
        type: 'task',
      }));
      setNewTaskTitle('');
    }
  };
  
  // Handle updating a task's status
  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({
      id: taskId,
      status: newStatus,
    }));
  };
  
  // Handle deleting a task
  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };
  
  // Handle filtering by assignee
  const handleAssigneeFilter = (assigneeId) => {
    const currentAssignees = [...filters.assignee];
    
    if (assigneeId === 'clear') {
      dispatch(setFilters({ assignee: [] }));
    } else if (currentAssignees.includes(assigneeId)) {
      dispatch(setFilters({ 
        assignee: currentAssignees.filter(id => id !== assigneeId) 
      }));
    } else {
      dispatch(setFilters({ 
        assignee: [...currentAssignees, assigneeId] 
      }));
    }
  };
  
  // Render loading state
  if (status === 'loading') {
    return <div className="p-6 text-center">Loading tasks...</div>;
  }
  
  // Render error state
  if (status === 'failed') {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Tasks for {projectSlug}</h2>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleAssigneeFilter('user-1')}>
                John Doe {filters.assignee.includes('user-1') && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssigneeFilter('user-2')}>
                Jane Smith {filters.assignee.includes('user-2') && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssigneeFilter('unassigned')}>
                Unassigned {filters.assignee.includes('unassigned') && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssigneeFilter('clear')}>
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(filters.search || filters.assignee.length > 0) && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => dispatch(clearFilters())}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Create new task */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
          />
          <Button onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      
      {/* Task list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.key}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {task.description || 'No description provided'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'TO DO' ? 'bg-gray-100' :
                    task.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'TESTING' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {task.priority}
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'TO DO')}>
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'IN PROGRESS')}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'TESTING')}>
                      Testing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'DONE')}>
                      Done
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No tasks found. {filters.search || filters.assignee.length > 0 ? 'Try clearing your filters.' : 'Create a new task to get started.'}
          </div>
        )}
      </div>
    </div>
  );
}
