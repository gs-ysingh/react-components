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
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Type your message',
    },
  ], []);

  const handleSubmit = (data: Record<string, any>) => {
    alert('Form submitted!\n' + JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Contact Us</h2>
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Send" />
    </div>
  );
};

export default SimpleFormExample;
