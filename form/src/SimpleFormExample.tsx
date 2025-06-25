import React, { useMemo } from 'react';
import { Form, FormField } from './Form';

const SimpleFormExample: React.FC = () => {
  const fields = useMemo<FormField[]>(() => [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter your password',
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Enter your age',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      required: false,
      placeholder: 'Tell us about yourself',
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select country' },
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'in', label: 'India' },
      ],
    },
    {
      name: 'subscribe',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
  ], []);

  const handleSubmit = (data: Record<string, any>) => {
    alert('Form submitted!\n' + JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>All Input Types Example</h2>
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Send" />
    </div>
  );
};

export default SimpleFormExample;
