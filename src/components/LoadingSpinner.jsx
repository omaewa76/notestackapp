import React from 'react';

const LoadingSpinner = ({ message = 'Memuat...' }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingSpinner;