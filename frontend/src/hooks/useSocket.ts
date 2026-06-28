import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/Toast';

export const useSocket = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Use environment variable or fallback to localhost
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Join user-specific room for targeted notifications
      newSocket.emit('join_user_room', user._id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for application status updates
    newSocket.on('application_status_update', (data) => {
      setLastUpdate(data);
      
      // Show appropriate toast based on status
      if (data.status === 'approved') {
        showToast(data.message, 'success');
      } else if (data.status === 'rejected') {
        showToast(data.message, 'error');
      } else {
        showToast(data.message || `Application status updated to ${data.status}`, 'info');
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]); // Reconnect if user changes

  return { socket, isConnected, lastUpdate };
};
