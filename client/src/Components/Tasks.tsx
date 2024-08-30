import React, { useEffect, useState } from 'react';
import { Task } from '../Interfaces/Task';

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You are not authenticated');
      window.location.href = '/'; 
      return;
    }

    fetch('http://localhost:3000/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch tasks');
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch tasks');
      });
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <button>Add new task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} {task.description}</li>
        ))}
      </ul>
    </div>
  );
};
