import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const Registration = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const handleLoginChange = (e) => setLogin(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: login, password }),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            const errorData = await response.json();
            setErrors(errorData.message);
        }
    } catch (error) {
        setErrors(['An unexpected error occurred']);
    }
};
  console.log(errors)
  

  return (
    <div className='sign-form'>
      <div className={errors.length !== 0? 'sign-form-container error' : 'sign-form-container'}><p>Sign Up</p>
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
         {errors.length > 0 && (
                <ul className='error'>
                    {errors.map((err, index) => (
                        <li
                            key={index}
                            className={`${errors.length === 1 ? 'li-error': ''}`}
                        >
                            {err}
                        </li>
                    ))}
                </ul>
            )}
         <p className='question'>Already have an account? <a href='/login'> Sign in</a></p>
        <button className={errors.length === 0 ? '' : 'button-error'}  type="submit">Sign up</button>
      </form></div>
      
    </div>
  );
};
