https://github.com/FaizalDananjayaimport { useState } from 'react';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const messages = [];
    if (password.length < 10) messages.push('Password must be at least 10 characters long');
    if (password.length > 24) messages.push('Password must be at most 24 characters long');
    if (/\s/.test(password)) messages.push('Password cannot contain spaces');
    if (!/\d/.test(password)) messages.push('Password must contain at least one number');
    if (!/[A-Z]/.test(password)) messages.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) messages.push('Password must contain at least one lowercase letter');
    return messages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validation = validatePassword(password);
    if (validation.length > 0 || !username) {
      setValidationMessages(validation);
      return;
    }

    try {
      const response = await fetch('https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:HENNGECHALLENGE`)
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setUserWasCreated(true);
      } else if (response.status === 401 || response.status === 403) {
        setError('Not authenticated to access this resource');
      } else if (response.status === 500) {
        setError('Something went wrong, please try again');
      } else {
        const data = await response.json();
        if (data.error === 'invalid_password') {
          setError('Sorry, the entered password is not allowed, please try a different one');
        } else {
          setError('Something went wrong, please try again');
        }
      }
    } catch (err) {
      setError('Something went wrong, please try again');
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label style={formLabel} htmlFor="username">Username</label>
        <input
          style={formInput}
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!username}
          aria-required="true"
        />

        <label style={formLabel} htmlFor="password">Password</label>
        <input
          style={formInput}
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setValidationMessages(validatePassword(e.target.value));
          }}
          aria-invalid={validationMessages.length > 0}
          aria-required="true"
        />

        {validationMessages.length > 0 && (
          <div style={validationWrapper}>
            {validationMessages.map((message, i) => (
              <div key={i} style={validationMessage}>{message}</div>
            ))}
          </div>
        )}

        {error && <div style={errorMessage}>{error}</div>}

        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

const validationWrapper: CSSProperties = {
  margin: '8px 0',
  padding: '8px',
  backgroundColor: '#fff3f3',
  borderRadius: '4px',
};

const validationMessage: CSSProperties = {
  color: '#d32f2f',
  fontSize: '14px',
};

const errorMessage: CSSProperties = {
  color: '#d32f2f',
  fontSize: '14px',
  margin: '8px 0',
  textAlign: 'center',
};
