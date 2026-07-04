import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ id, message, type = 'success', onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return '✓';
        }
    };

    return (
        <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={handleClose}>✕</button>
        </div>
    );
};

export default Toast;