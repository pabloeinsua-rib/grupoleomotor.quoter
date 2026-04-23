import React from 'react';
// FIX: Corrected the prop type for 'notifications' from a single object to an array to match its usage, and added a default export to resolve the module not found error.
import { type Notification } from '../App.tsx';
import { BellIcon } from './Icons.tsx';

interface MessagesProps {
  // FIX: Changed Notification to Notification[] to match the prop type.
  notifications: Notification[];
}

const Messages: React.FC<MessagesProps> = ({ notifications }) => {
  if (notifications.length === 0) {
    return (
      <div className="w-full flex-grow flex items-center justify-center">
        <div className="text-center text-gray-500 p-8">
          <BellIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold text-gray-700">No tienes mensajes</h2>
          <p className="mt-2">Tus notificaciones y avisos importantes aparecerán aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-6 rounded-lg shadow-md transition-colors ${
            !notification.read ? 'bg-blue-50 border-l-4 border-caixa-blue' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="font-bold text-lg text-gray-800">{notification.title}</p>
              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
            </div>
            {!notification.read && (
              <div className="flex-shrink-0 ml-4">
                <span className="inline-block bg-caixa-blue text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Nuevo
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-right">{notification.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

// FIX: Added default export to resolve the "no default export" error.
export default Messages;