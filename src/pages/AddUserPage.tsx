import React, { useState } from 'react';
import { TextField, Button, MenuItem, Alert } from '@mui/material';

const roles = [
  { value: 'waiter', label: 'Waiter' },
  { value: 'cook', label: 'Cook' },
];

const AddUserPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create user');
      setSuccess(true);
      setForm({ name: '', username: '', password: '', email: '', role: '' });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <TextField label="Username" name="username" value={form.username} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <TextField select label="Role" name="role" value={form.role} onChange={handleChange} required>
          {roles.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">Add User</Button>
        {success && <Alert severity="success">User created!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </form>
    </div>
  );
};

export default AddUserPage; 