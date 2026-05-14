/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const normalizedMessage = String(message || '').trim();
    if (!normalizedMessage) return;

    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const alreadyVisible = prev.some(
        (toast) => toast.message === normalizedMessage && toast.type === type,
      );

      if (alreadyVisible) {
        return prev;
      }

      return [...prev.slice(-2), { id, message: normalizedMessage, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* MOVED TO TOP CENTER */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`
              px-6 py-3 rounded-lg shadow-2xl font-medium text-sm cursor-pointer
              transform transition-all duration-500 ease-in-out
              animate-toast-slide-in
              ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${toast.type === 'info' ? 'bg-brand-gold text-black' : ''}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
