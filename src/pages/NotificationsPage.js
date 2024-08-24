import React, { useState, useEffect } from 'react';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      message: "John Doe liked your photo.",
      timestamp: new Date().toISOString()
    },
    {
      message: "Jane Smith commented on your post.",
      timestamp: new Date().toISOString()
    },
    {
      message: "You have a new friend request from Mike Ross.",
      timestamp: new Date().toISOString()
    },
    {
      message: "Sarah Connor shared your post.",
      timestamp: new Date().toISOString()
    },
    {
      message: "Your event 'React Conference' is tomorrow.",
      timestamp: new Date().toISOString()
    }
  ]);

  const [hiddenNotifications, setHiddenNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://yourserver.com/notifications/v1/notifications/subscribe');

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        message: `New notification at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString()
      };
      addNotification(newNotification);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => {
        const updatedNotifications = [...prev];
        
        if (updatedNotifications.length >= 10) {
        setHiddenNotifications(hiddenNotifications => [
            ...hiddenNotifications,
            updatedNotifications.pop()
        ]);
        }
        
        updatedNotifications.unshift(notification);
        
        return updatedNotifications;
    });
    };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="flex justify-between items-center w-full max-w-screen-xl mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-gray-400 mt-4">No notifications yet</p>
        </div>
      ) : (
        <div className="w-full max-w-screen-xl flex flex-col space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            >
              <p className="text-white mb-2">{notification.message}</p>
              <p className="text-gray-400 text-sm">{new Date(notification.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
