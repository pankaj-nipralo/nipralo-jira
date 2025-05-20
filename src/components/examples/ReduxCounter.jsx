'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, incrementByAmount } from '@/store/counterSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Example component that demonstrates how to use Redux with the hooks
 * 
 * This component shows:
 * 1. How to select data from the Redux store using useAppSelector
 * 2. How to dispatch actions using useAppDispatch
 * 3. How to use action creators from a slice
 */
export default function ReduxCounter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = React.useState(2);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Redux Counter Example</h2>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button 
          variant="outline" 
          onClick={() => dispatch(decrement())}
          aria-label="Decrement value"
        >
          -
        </Button>
        
        <span className="text-2xl font-bold">{count}</span>
        
        <Button 
          variant="outline" 
          onClick={() => dispatch(increment())}
          aria-label="Increment value"
        >
          +
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="number"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value) || 0)}
          aria-label="Set increment amount"
          className="w-20"
        />
        
        <Button 
          onClick={() => dispatch(incrementByAmount(incrementAmount))}
          aria-label="Add amount"
        >
          Add Amount
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>This component demonstrates how to use Redux with React hooks.</p>
        <p className="mt-2">
          Check the Redux DevTools to see the state changes and actions being dispatched.
        </p>
      </div>
    </div>
  );
}
