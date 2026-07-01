import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (sessionId, handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !sessionId) return;

    socketRef.current = io('/', { auth: { token }, transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join:session', sessionId);
    });

    Object.entries(handlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    return () => {
      socketRef.current?.emit('leave:session', sessionId);
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit };
};
