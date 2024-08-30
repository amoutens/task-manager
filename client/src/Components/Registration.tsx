import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../Interfaces/User';
import { useAuth } from './AuthProvider';
export const Registration = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (e) => setLogin(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/auth/signup', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: login, password }), 
    })
    .then(async (response) => {
        const text = await response.text();
        if (response.ok) {
          
          const token = text;
          console.log('Success:', token);
          navigate('/login');
        } else {
          throw new Error(text || 'Sign up failed');
        }
      })
    //   .then((data) => {
    //     authenticate(data.accessToken);
    //     navigate('/tasks');
    //   })
      .catch((error) => {
        console.error('Error:', error);
        alert(error.message); 
      });
  };
  
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Sign Up</p>
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
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};
