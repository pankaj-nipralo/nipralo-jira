
import { useDispatch, useSelector, useStore } from 'react-redux';

/**
 * Custom hooks for Redux
 *
 * These hooks provide a consistent way to access Redux state and dispatch.
 * Use these throughout your app instead of plain `useDispatch` and `useSelector`.
 */

// Use this hook to access the dispatch function
export const useAppDispatch = () => useDispatch();

// Use this hook to select parts of the Redux state
export const useAppSelector = useSelector;

// Use this hook to access the store directly if needed
export const useAppStore = () => useStore();