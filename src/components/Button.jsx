import React from 'react';

const Button = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', fullWidth = false }) => {
    const variants = { primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger' };
    return (
        <button type={type} className={`btn ${variants[variant]} ${fullWidth ? 'btn-fullwidth' : ''}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;