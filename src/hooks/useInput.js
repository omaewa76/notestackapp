import { useState, useCallback } from 'react';
import { sanitizeInput, escapeHtml } from '../utils/sanitize';

export const useInput = (initialValue = '', validationRules = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((e) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    setValue(sanitizedValue);
    if (error) setError('');
  }, [error]);

  const onBlur = useCallback(() => {
    setTouched(true);

    if (validationRules.required && !value.trim()) {
      setError(validationRules.requiredMessage || escapeHtml('Field harus diisi'));
    } else if (validationRules.minLength && value.length < validationRules.minLength) {
      setError(validationRules.minLengthMessage || escapeHtml(`Minimal ${validationRules.minLength} karakter`));
    } else if (validationRules.email && !/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value)) {
      setError(escapeHtml('Email tidak valid'));
    } else if (validationRules.maxLength && value.length > validationRules.maxLength) {
      setError(validationRules.maxLengthMessage || escapeHtml(`Maksimal ${validationRules.maxLength} karakter`));
    }
  }, [value, validationRules]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  }, [initialValue]);

  const setValueManually = useCallback((newValue) => {
    setValue(sanitizeInput(newValue));
  }, []);

  return {
    value,
    error,
    touched,
    onChange,
    onBlur,
    reset,
    setValue: setValueManually,
    isValid: !error && touched,
    bind: { value, onChange, onBlur },
  };
};