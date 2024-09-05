import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../Interfaces/User';
import { useAuth } from './AuthProvider';
export const Authorization = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        setError('');
        authenticate(data.accessToken);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Login or password is incorrect');
      });
  };
  

  return (
    <div className='sign-form'>
      <div className='sign-form-container'><p>Sign In</p>
      <form onSubmit={handleSubmit}>
        <p>Input your username</p>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={handleLoginChange}
        />
        <p>Input your password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error !== '' ? <p className='error'>{error}</p> : ''}
        <p className='question'>Don't have an account? <a href='/signup'> Sign up</a></p>
        <button className={error === ''? '': 'button-error'} type="submit">Sign in</button>
      </form></div>
        
    </div>
  );
};
