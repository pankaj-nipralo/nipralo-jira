'use client';

import React from 'react';
import ReduxCounter from '@/components/examples/ReduxCounter';
import TaskList from '@/components/examples/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Example page that demonstrates Redux integration
 * 
 * This page shows:
 * 1. A simple counter example using Redux
 * 2. A more complex task list example using Redux
 */
export default function ReduxExamplePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Redux Toolkit Examples</h1>
      
      <Tabs defaultValue="counter" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="counter">Counter Example</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="counter" className="mt-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Simple Counter Example</h2>
            <p className="text-gray-600">
              This example demonstrates the basic usage of Redux with a simple counter.
              It shows how to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Select data from the Redux store</li>
              <li>Dispatch actions to update the store</li>
              <li>Use action creators from a slice</li>
            </ul>
          </div>
          
          <ReduxCounter />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Task Management Example</h2>
            <p className="text-gray-600">
              This example demonstrates more advanced Redux patterns with a task management interface.
              It shows how to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Use async thunks for API calls</li>
              <li>Handle loading, success, and error states</li>
              <li>Use memoized selectors for derived data</li>
              <li>Implement filtering and searching</li>
              <li>Perform CRUD operations</li>
            </ul>
          </div>
          
          <TaskList projectSlug="example" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
