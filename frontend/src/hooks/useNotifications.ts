import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import type { Notification } from '../types';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationAPI.getAll();
      if (res.data.success && res.data.data) {
        setNotifications(res.data.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await notificationAPI.getUnreadCount();
      if (res.data.success && res.data.data) {
        setUnreadCount(res.data.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchNotifications(), fetchUnreadCount()]).finally(() => {
        setIsLoading(false);
      });

      // Poll every 60 seconds for new notifications
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: () => {
      fetchNotifications();
      fetchUnreadCount();
    }
  };
};
