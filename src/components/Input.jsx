import React from 'react';

const Input = ({ label, type = 'text', value, onChange, onBlur, placeholder, required = false, error = '', icon = null }) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label} {required && <span className="required">*</span>}</label>}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input type={type} className={`input-field ${error ? 'input-error' : ''}`} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;