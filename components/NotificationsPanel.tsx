import React from 'react';
import { BellIcon, CheckIcon } from './Icons.tsx';
import type { Notification } from '../App.tsx';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transform transition-all origin-top-right fade-in-up">
       <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Notificaciones</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs font-semibold text-[#0085c7] hover:underline">
            Marcar todas como leídas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-4 border-b transition-colors ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="flex-shrink-0 mt-1">
                {!notification.read && <div className="w-2.5 h-2.5 bg-[#00a1e0] rounded-full"></div>}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
              </div>
              {!notification.read && (
                 <button 
                    onClick={() => onMarkAsRead(notification.id)} 
                    className="flex-shrink-0 p-1.5 text-gray-500 rounded-none hover:bg-gray-200"
                    aria-label="Marcar como leída"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-12 text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-semibold">No tienes notificaciones</p>
            <p className="text-sm mt-1">Aquí aparecerán las actualizaciones importantes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;