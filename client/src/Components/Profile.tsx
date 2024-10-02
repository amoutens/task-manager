import React, { useEffect, useState } from 'react';
import { User } from '../Interfaces/User';
import '../assets/profile-page.css'

export const Profile = () => {
    const [userInfo, setUserInfo] = useState<User| undefined>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/auth/username', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      return response.text().then((text) => {
        return text ? JSON.parse(text) : {};
      });
    })
    .then((data) => {
      setUserInfo(data)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <div className='main'>
    <div className='main-container-profile'>
    
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-female-icon.png" alt="profile_avatar" />
      <span><h1>Profile settings</h1>
        <div>{userInfo? `Username: ${userInfo.username}`: ''}
      </div>
      <div>{userInfo? `Total Tasks: ${userInfo.tasks.length}`: ''}</div>
      <div>
      <button className='btn-username'>Change username</button>
      <button className='btn-pass'>Change password</button>
      </div>
      <button className='btn-account'>Delete account</button></span>
      
    </div></div>
    
  );
};
