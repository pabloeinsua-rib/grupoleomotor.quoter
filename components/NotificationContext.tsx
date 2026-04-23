import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationContextType {
  permission: NotificationPermission;
  requestPermission: () => void;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission as NotificationPermission);
    } else {
      console.warn('This browser does not support desktop notification');
      setPermission('denied');
    }
  }, []);

  const requestPermission = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result as NotificationPermission);
      });
    }
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    // Check if Notification API is available
    if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('Notifications not supported in this browser.');
        return;
    }

    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
          const serviceWorkerRegistration = navigator.serviceWorker.ready;
          serviceWorkerRegistration.then(registration => {
            registration.showNotification(title, {
                icon: 'https://storage.googleapis.com/bucket_quoter_auto2/fortos/icona.jpeg', // Default icon
                ...options,
            });
          });
      } else {
          // Fallback for standard Notification API
          try {
              new Notification(title, {
                  icon: 'https://storage.googleapis.com/bucket_quoter_auto2/fortos/icona.jpeg',
                  ...options
              });
          } catch (e) {
              console.error("Notification error:", e);
          }
      }
    } else if (Notification.permission === 'default') {
      console.log('Notification permission has not been requested yet.');
      requestPermission();
    } else {
       console.log('Notification permission was denied.');
    }
  }, [requestPermission]);

  const value = { permission, requestPermission, showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};