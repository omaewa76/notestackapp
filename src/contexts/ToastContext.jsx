import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext();

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const { toasts, showToast, removeToast, showSuccess, showError, showWarning, showInfo, TOAST_TYPES } = useToast();

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, TOAST_TYPES }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};