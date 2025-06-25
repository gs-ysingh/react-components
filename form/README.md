# Reusable Form Component

A flexible and powerful React form component built with TypeScript that provides validation, error handling, and customizable field types.

## Features

- 🎯 **Type-safe** - Built with TypeScript for better development experience
- 🔧 **Flexible** - Support for multiple field types (text, email, password, textarea, select, checkbox, etc.)
- ✅ **Validation** - Built-in validation with custom validation support
- 🎨 **Customizable** - Easy to style and customize
- 📱 **Responsive** - Mobile-friendly design
- 🔄 **Loading States** - Built-in loading states for async operations
- 🎪 **Easy to Use** - Simple configuration-based approach

## Installation

```bash
npm install
```

## Usage

### Basic Example

```typescript
import React from 'react';
import { Form, FormField } from './Form';

const MyComponent = () => {
  const fields: FormField[] = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Enter your message'
    }
  ];

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form data:', data);
  };

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Send Message"
    />
  );
};
```

### Advanced Example with Validation

```typescript
const advancedFields: FormField[] = [
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: {
      minLength: 8,
      custom: (value: string) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return null;
      }
    }
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    required: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' }
    ]
  }
];
```

## Field Types

### Text Input
```typescript
{
  name: 'firstName',
  label: 'First Name',
  type: 'text',
  required: true,
  placeholder: 'Enter first name'
}
```

### Email Input
```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true
}
```

### Password Input
```typescript
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true
}
```

### Number Input
```typescript
{
  name: 'age',
  label: 'Age',
  type: 'number',
  required: true
}
```

### Textarea
```typescript
{
  name: 'description',
  label: 'Description',
  type: 'textarea',
  placeholder: 'Enter description'
}
```

### Select Dropdown
```typescript
{
  name: 'category',
  label: 'Category',
  type: 'select',
  required: true,
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]
}
```

### Checkbox
```typescript
{
  name: 'agree',
  label: 'I agree to terms',
  type: 'checkbox',
  required: true
}
```

### Date Input
```typescript
{
  name: 'birthDate',
  label: 'Birth Date',
  type: 'date',
  required: true
}
```

## Validation Options

### Built-in Validations
- `required` - Field is required
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `pattern` - Regular expression pattern
- Email validation (automatic for email type)

### Custom Validation
```typescript
{
  name: 'username',
  label: 'Username',
  type: 'text',
  validation: {
    custom: (value: string) => {
      if (value.includes(' ')) {
        return 'Username cannot contain spaces';
      }
      return null; // No error
    }
  }
}
```

## Form Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `FormField[]` | Yes | - | Array of field configurations |
| `onSubmit` | `(data: Record<string, any>) => void \| Promise<void>` | Yes | - | Form submission handler |
| `onReset` | `() => void` | No | - | Reset handler |
| `submitLabel` | `string` | No | "Submit" | Submit button text |
| `resetLabel` | `string` | No | "Reset" | Reset button text |
| `showReset` | `boolean` | No | `true` | Show reset button |
| `className` | `string` | No | "" | Additional CSS class |
| `loading` | `boolean` | No | `false` | Loading state |
| `initialValues` | `Record<string, any>` | No | `{}` | Initial form values |

## Styling

The component comes with built-in CSS classes that you can customize:

- `.form` - Main form container
- `.form-field` - Individual field container
- `.form-field.error` - Field with error state
- `.error-message` - Error message text
- `.form-actions` - Button container
- `.btn` - Button base class
- `.btn-primary` - Primary button (submit)
- `.btn-secondary` - Secondary button (reset)

## Running the Demo

```bash
npm start
```

This will start the development server and show examples of the form component in action.

## License

MIT
