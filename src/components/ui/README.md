# Reusable UI Components

A collection of reusable React components built for the chat application to reduce code duplication and improve maintainability.

## Components

### 1. **Alert Component**
Displays error/success messages with auto-close and dismiss functionality.

```jsx
import { Alert } from './components/ui';

// Usage in Login/Signup
{(error || success) && (
  <Alert 
    type={success ? 'success' : 'error'}
    message={error || message}
    onClose={() => dispatch(clearMessage())}
    dismissible={true}
    autoClose={true}
    autoCloseDuration={5000}
  />
)}
```

---

### 2. **FormInput Component**
Reusable text input with label, validation feedback, and error states.

```jsx
import { FormInput } from './components/ui';

// Usage in Login/Signup forms
<FormInput 
  label="Username"
  name="username"
  type="text"
  placeholder="e.g. saad123"
  value={form.username}
  onChange={onChange}
  required={true}
  error={errors?.username}
  className="mb-4"
/>
```

---

### 3. **FormSelect Component**
Reusable select dropdown with label and validation.

```jsx
import { FormSelect } from './components/ui';

// Usage in Signup form
<FormSelect 
  label="Gender"
  name="gender"
  value={form.gender}
  onChange={onChange}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]}
  required={true}
/>
```

---

### 4. **AuthButton Component**
Reusable button for authentication forms with loading states.

```jsx
import { AuthButton } from './components/ui';

// Usage in Login/Signup
<AuthButton 
  loading={loading}
  loadingText="Logging in..."
  variant="primary"
  type="submit"
>
  Login
</AuthButton>
```

---

### 5. **UserAvatar Component**
Display user avatar with online/offline status indicator.

```jsx
import { UserAvatar } from './components/ui';

// In Home chat sidebar
<UserAvatar 
  name={user.name}
  status={user.status}
  src={user.profilePhoto}
  size="md"
  showStatus={true}
/>

// For chat header
<UserAvatar 
  name="Active User"
  size="lg"
  status="online"
/>
```

---

### 6. **MessageBubble Component**
Display individual chat messages with different styling for sent/received.

```jsx
import { MessageBubble } from './components/ui';

// Received message
<MessageBubble 
  content="Hello! How can I help you?"
  timestamp="12:45 PM"
  isSent={false}
  sender={{
    name: "Patel Mernstack",
    avatar: null,
    status: "online"
  }}
/>

// Sent message
<MessageBubble 
  content="I'm looking to build a clean Chat UI with React."
  timestamp="12:46 PM"
  isSent={true}
  status="delivered"
/>
```

---

## Quick Import

Instead of individual imports, you can import all at once:

```jsx
import { Alert, FormInput, FormSelect, AuthButton, UserAvatar, MessageBubble } from './components/ui';
```

## Benefits

✅ **DRY (Don't Repeat Yourself)** - Eliminates duplicate code
✅ **Consistency** - Same styling across the app
✅ **Maintainability** - Update once, changes apply everywhere
✅ **Scalability** - Easy to add new components
✅ **Type-safe** - Predictable component interfaces
✅ **Accessibility** - Built-in focus states and labels

## Future Enhancements

- Add PropTypes or TypeScript for better type safety
- Create a Storybook for component documentation
- Add more variants (loading skeleton, empty states, etc.)
