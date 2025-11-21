
import { useState, useEffect, useCallback } from 'react';
import { Notification, User } from '../types';
import { API_URL } from '../constants';

export const useNotifications = (user: User | null, isBackendAvailable: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    if (isBackendAvailable) {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          headers: { 'x-user-id': user.id }
        });
        if (res.ok) {
            const data = await res.json();
            // Sort desc by time
            const sorted = data.sort((a: Notification, b: Notification) => b.createdAt - a.createdAt);
            setNotifications(sorted);
            setUnreadCount(sorted.filter((n: Notification) => !n.isRead).length);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const stored = localStorage.getItem('pinclone_notifications');
      if (stored) {
        const allNotes = JSON.parse(stored);
        const myNotes = allNotes.filter((n: Notification) => n.recipientId === user.id);
        const sorted = myNotes.sort((a: Notification, b: Notification) => b.createdAt - a.createdAt);
        setNotifications(sorted);
        setUnreadCount(sorted.filter((n: Notification) => !n.isRead).length);
      }
    }
  }, [user, isBackendAvailable]);

  useEffect(() => {
    fetchNotifications();
    
    // Listen for local updates
    const handleLocalUpdate = () => fetchNotifications();
    window.addEventListener('notificationUpdate', handleLocalUpdate);
    
    // Poll backend every 10 seconds if online
    let interval: any;
    if (isBackendAvailable) {
        interval = setInterval(fetchNotifications, 10000);
    }

    return () => {
        window.removeEventListener('notificationUpdate', handleLocalUpdate);
        if(interval) clearInterval(interval);
    };
  }, [fetchNotifications, isBackendAvailable]);

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    if (isBackendAvailable && user) {
      await fetch(`${API_URL}/notifications/mark-read`, {
          method: 'POST',
          headers: { 'x-user-id': user.id }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } else if (user) {
       const stored = localStorage.getItem('pinclone_notifications');
       if (stored) {
           const allNotes = JSON.parse(stored);
           const updated = allNotes.map((n: Notification) => {
               if (n.recipientId === user.id) return { ...n, isRead: true };
               return n;
           });
           localStorage.setItem('pinclone_notifications', JSON.stringify(updated));
           fetchNotifications();
       }
    }
  };

  return { notifications, unreadCount, markAllAsRead };
};
