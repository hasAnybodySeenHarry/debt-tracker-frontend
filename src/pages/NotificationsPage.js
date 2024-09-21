import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_URL}/notifier/v1/notifications/subscribe`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

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

  const addNotification = (notification) => {
    const formattedNotification = {
      message: formatNotificationMessage(notification),
      timestamp: notification.metadata.timestamp
    };

    setNotifications((prev) => {
      const updatedNotifications = [...prev];

      if (updatedNotifications.length >= 10) {
        setHiddenNotifications((hiddenNotifications) => [
          ...hiddenNotifications,
          updatedNotifications.pop(),
        ]);
      }

      updatedNotifications.unshift(formattedNotification);

      return updatedNotifications;
    });
  };

  const formatNotificationMessage = (notification) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    const { metadata, data } = notification;
    const { lender, borrower, amount, description, category } = data;

    switch (metadata.type) {
      case 'transaction_created':
        if (userId === borrower.id) {
          return amount > 0
            ? `You took ${amount} USD again from ${lender.name} with a description of ${description}.`
            : `You paid off ${Math.abs(amount)} USD to ${lender.name} with a description of ${description}.`;
        } else if (userId === lender.id) {
          return amount > 0
            ? `You lent ${borrower.name} ${amount} USD again with a description of ${description}.`
            : `You received ${Math.abs(amount)} USD back from ${borrower.name}.`;
        }
        break;
      case 'debt_created':
        if (userId === lender.id) {
          return `You lent ${data.total} USD to ${borrower.name} under the category of ${category}.`;
        } else if (userId === borrower.id) {
          return `You borrowed ${data.total} USD from ${lender.name} under the category of ${category}.`;
        }
        break;
      default:
        return 'Unknown notification type';
    }
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
