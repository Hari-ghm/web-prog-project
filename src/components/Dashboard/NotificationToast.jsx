import React from 'react';
import { useData } from '../../context/DataContext';

const NotificationToast = () => {
  const { notifications } = useData();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {notifications.map((note) => (
        <div 
          key={note.id}
          className="animate-slide-up bg-white dark:bg-darkSecondary border border-borderLight dark:border-gray-800 shadow-lg rounded-lg p-4 flex items-start pointer-events-auto"
        >
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              note.type === 'success' ? 'text-teal dark:text-teal' : 
              note.type === 'warning' ? 'text-amber-600 dark:text-amber-400' : 
              'text-blue dark:text-blue'
            }`}>
              {note.message}
            </p>
            <p className="text-xs text-textSecondary dark:text-gray-500 mt-1">
              {note.time.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
