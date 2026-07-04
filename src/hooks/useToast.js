import { useState, useCallback } from 'react';

let toastId = 0;

export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = TOAST_TYPES.SUCCESS, duration = 3000) => {
        const id = ++toastId;
        const newToast = { id, message, type, duration };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        return showToast(message, TOAST_TYPES.SUCCESS, duration);
    }, [showToast]);

    const showError = useCallback((message, duration) => {
        return showToast(message, TOAST_TYPES.ERROR, duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration) => {
        return showToast(message, TOAST_TYPES.WARNING, duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration) => {
        return showToast(message, TOAST_TYPES.INFO, duration);
    }, [showToast]);

    return {
        toasts,
        showToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        TOAST_TYPES,
    };
};