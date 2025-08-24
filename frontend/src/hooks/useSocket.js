import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('authToken');
      if (token) {
        const newSocket = io('http://localhost:5000', {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from server');
        });

        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated]);

  return socket;
};