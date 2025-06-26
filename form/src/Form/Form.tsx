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

// Multi-step form types
export interface FormStep {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface MultiStepFormConfig extends Omit<FormConfig, 'fields'> {
  steps: FormStep[];
  onStepChange?: (currentStep: number, totalSteps: number, data: Record<string, any>) => void;
  nextLabel?: string;
  previousLabel?: string;
  showStepIndicator?: boolean;
}

export type ExtendedFormProps =
  | (FormProps & { steps?: undefined })
  | (MultiStepFormConfig & { fields?: undefined });

function isMultiStepProps(props: any): props is MultiStepFormConfig {
  return Array.isArray(props.steps);
}

const Form: React.FC<FormProps | MultiStepFormConfig> = (props) => {
  const isMultiStep = isMultiStepProps(props);
  const steps = isMultiStep ? props.steps : undefined;
  const fields = isMultiStep ? steps![0].fields : props.fields;
  const totalSteps = isMultiStep ? steps!.length : 1;
  const [currentStep, setCurrentStep] = useState(0);

  // State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form data only on mount
  useEffect(() => {
    const allFields = isMultiStep
      ? steps!.flatMap((step) => step.fields)
      : fields || [];
    const initData: Record<string, any> = {};
    allFields.forEach((field) => {
      if ('initialValues' in props && props.initialValues && props.initialValues[field.name] !== undefined) {
        initData[field.name] = props.initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        initData[field.name] = field.defaultValue;
      } else {
        initData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(initData);
  }, []);

  useEffect(() => {
    if (isMultiStep && props.onStepChange) {
      props.onStepChange(currentStep, totalSteps, formData);
    }
    // eslint-disable-next-line
  }, [currentStep]);

  const currentFields = isMultiStep ? steps![currentStep].fields : fields;

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

  // Multi-step form specific: Validate only current step
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};
    currentFields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Multi-step form specific: Go to next step
  const handleNext = () => {
    if (!validateCurrentStep()) {
      const touchedFields: Record<string, boolean> = {};
      currentFields.forEach((field) => {
        touchedFields[field.name] = true;
      });
      setTouched(touchedFields);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  // Multi-step form specific: Go to previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // ...existing handleSubmit, but for multi-step only submit on last step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMultiStep && currentStep < totalSteps - 1) {
      handleNext();
      return;
    }
    if (!validateCurrentStep()) {
      const touchedFields: Record<string, boolean> = {};
      currentFields.forEach((field) => {
        touchedFields[field.name] = true;
      });
      setTouched(touchedFields);
      return;
    }
    try {
      await props.onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    const allFields = isMultiStep
      ? steps!.flatMap((step) => step.fields)
      : fields || [];
    const resetData: Record<string, any> = {};
    allFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        resetData[field.name] = field.defaultValue;
      } else {
        resetData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    setFormData(resetData);
    setErrors({});
    setTouched({});
    if (isMultiStep) setCurrentStep(0);
    if (props.onReset) props.onReset();
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
      disabled: props.loading
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

  // Step indicator for multi-step
  const renderStepIndicator = () => {
    if (!isMultiStep || !props.showStepIndicator) return null;
    return (
      <div className="step-indicator stepper-horizontal">
        {steps!.map((step, idx) => (
          <div
            key={idx}
            className={`stepper-step${idx === currentStep ? ' active' : ''}${idx < currentStep ? ' completed' : ''}`}
          >
            <div className="stepper-circle">
              {idx < currentStep ? <span>&#10003;</span> : idx + 1}
            </div>
            <div className="stepper-title">{step.title}</div>
            {idx < steps!.length - 1 && <div className="stepper-bar" />}
          </div>
        ))}
      </div>
    );
  };

  // Navigation for multi-step
  const renderNavigation = () => {
    if (!isMultiStep) {
      return (
        <div className="form-actions">
          {props.showReset && (
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={props.loading}>
              {props.resetLabel || 'Reset'}
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={props.loading}
          >
            {props.loading ? '' : props.submitLabel || 'Submit'}
          </button>
        </div>
      );
    }
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;
    return (
      <div className="form-navigation">
        <div className="nav-buttons">
          {!isFirstStep && (
            <button type="button" className="btn btn-secondary" onClick={handlePrevious} disabled={props.loading}>
              {props.previousLabel || 'Previous'}
            </button>
          )}
          {props.showReset && (
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={props.loading}>
              {props.resetLabel || 'Reset'}
            </button>
          )}
          {!isLastStep ? (
            <button type="button" className="btn btn-primary" onClick={handleNext} disabled={props.loading}>
              {props.nextLabel || 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={props.loading}
            >
              {props.loading ? '' : props.submitLabel || 'Submit'}
            </button>
          )}
        </div>
        <div className="step-counter">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    );
  };

  // Render fields for current step or all fields
  const renderFields = () => {
    if (isMultiStep) {
      return (
        <div className="step-fields">
          {currentFields.map(renderField)}
        </div>
      );
    }
    return <div className="form-fields">{fields.map(renderField)}</div>;
  };

  return (
    <form
      className={`form ${props.className || ''} ${props.loading ? 'loading' : ''} ${isMultiStep ? 'multi-step-form' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {renderStepIndicator()}
      {renderFields()}
      {renderNavigation()}
    </form>
  );
};

export default Form;
