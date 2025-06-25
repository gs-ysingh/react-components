import React, { useState, useEffect } from 'react';

// Types for form configuration
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
  defaultValue?: any;
}

export interface FormConfig {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
  loading?: boolean;
}

export interface FormProps extends FormConfig {
  initialValues?: Record<string, any>;
}

interface FormErrors {
  [key: string]: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  onReset,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = true,
  className = '',
  loading = false,
  initialValues = {}
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form data only on mount
  useEffect(() => {
    const initData: Record<string, any> = {};
    fields.forEach(field => {
      if (initialValues[field.name] !== undefined) {
        initData[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        initData[field.name] = field.defaultValue;
      } else {
        initData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(initData);
    // eslint-disable-next-line
  }, []); // Only run on mount

  // Optional: Expose a reset function if you want to reset the form from outside
  const resetForm = () => {
    const resetData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        resetData[field.name] = field.defaultValue;
      } else {
        resetData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(resetData);
    setErrors({});
    setTouched({});
    if (onReset) onReset();
  };

  // Validation function
  const validateField = (field: FormField, value: any): string | null => {
    // Required field validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // Type-specific validations
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Custom validation rules
    if (field.validation) {
      const { minLength, maxLength, pattern, custom } = field.validation;

      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters long`;
      }

      if (maxLength && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters long`;
      }

      if (pattern && !pattern.test(value)) {
        return `${field.label} format is invalid`;
      }

      if (custom) {
        const customError = custom(value);
        if (customError) {
          return customError;
        }
      }
    }

    return null;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle input blur
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Validate field on blur
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formData[fieldName]);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const touchedFields: Record<string, boolean> = {};
      fields.forEach(field => {
        touchedFields[field.name] = true;
      });
      setTouched(touchedFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    const resetData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        resetData[field.name] = field.defaultValue;
      } else {
        resetData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(resetData);
    setErrors({});
    setTouched({});
    
    if (onReset) {
      onReset();
    }
  };

  // Render individual form field
  const renderField = (field: FormField) => {
    const { name, label, type, placeholder, options, required } = field;
    const value = formData[name] ?? (field.type === 'checkbox' ? false : '');
    const hasError = touched[name] && errors[name];

    const commonProps = {
      id: name,
      name: name,
      required: required,
      onBlur: () => handleBlur(name),
      disabled: loading
    };

    let inputElement: React.ReactNode;

    switch (type) {
      case 'textarea':
        inputElement = (
          <textarea
            {...commonProps}
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        );
        break;

      case 'select':
        inputElement = (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;

      case 'checkbox':
        inputElement = (
          <input
            {...commonProps}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(name, e.target.checked)}
          />
        );
        break;

      default:
        inputElement = (
          <input
            {...commonProps}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        );
    }

    return (
      <div 
        key={name} 
        className={`form-field ${hasError ? 'error' : ''} ${type === 'checkbox' ? 'checkbox-field' : ''}`}
      >
        <label htmlFor={name}>
          {label}
          {required && <span style={{ color: '#f44336' }}> *</span>}
        </label>
        {inputElement}
        {hasError && <div className="error-message">{errors[name]}</div>}
      </div>
    );
  };

  return (
    <form 
      className={`form ${className} ${loading ? 'loading' : ''}`} 
      onSubmit={handleSubmit}
      noValidate
    >
      {fields.map(renderField)}
      
      <div className="form-actions">
        {showReset && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            {resetLabel}
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form;
