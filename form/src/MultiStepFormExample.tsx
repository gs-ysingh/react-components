import React, { useMemo } from 'react';
import { Form, FormStep } from './Form';

const MultiStepFormExample: React.FC = () => {
  const steps = useMemo<FormStep[]>(() => [
    {
      title: 'Personal Info',
      description: 'Enter your personal details',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    {
      title: 'Account Details',
      description: 'Set up your account',
      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
      ],
    },
    {
      title: 'Preferences',
      description: 'Choose your preferences',
      fields: [
        { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', defaultValue: true },
        { name: 'theme', label: 'Theme', type: 'select', required: true, options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ] },
      ],
    },
  ], []);

  const handleSubmit = (data: Record<string, any>) => {
    alert('Multi-step form submitted!\n' + JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Multi-Step Form Example</h2>
      <Form
        steps={steps}
        onSubmit={handleSubmit}
        submitLabel="Finish"
        nextLabel="Next"
        previousLabel="Back"
        showStepIndicator={true}
      />
    </div>
  );
};

export default MultiStepFormExample;
