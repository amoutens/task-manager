import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../Interfaces/User';
import { useAuth } from './AuthProvider';
export const Authorization = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (e) => setLogin(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/auth/signin', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: login, password }), 
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Sign in failed');
      })
      .then((data) => {
        authenticate(data.accessToken);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Login or password is incorrect');
      });
  };
  

  return (
    <div>
        <p>Sign In</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};
