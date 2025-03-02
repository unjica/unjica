'use client';

import { useEffect } from 'react';

/**
 * A component that initializes the scheduler when mounted
 * This is meant to be included in the layout to ensure the scheduler is running
 */
export function SchedulerInitializer() {
  useEffect(() => {
    // Initialize the scheduler by pinging the API
    const initScheduler = async () => {
      try {
        const response = await fetch('/api/scheduler');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to initialize scheduler:', error);
      }
    };
    
    // Call immediately and then set up a periodic ping
    initScheduler();
    
    // Ping the scheduler every 30 minutes to keep it active
    const interval = setInterval(initScheduler, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // This component doesn't render anything
  return null;
} 