import React, { useEffect, useState } from 'react';
import { Task } from '../Interfaces/Task';
import { useNavigate } from 'react-router-dom';

export const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [status, setStatus] = useState<string>("OPEN");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log(status);
  // }, [status]);
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
      });
  }, []);

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    const taskData = { title, description, status };

    try {
      const method = editTaskId ? 'PATCH' : 'POST';
      const endpoint = editTaskId ? `http://localhost:3000/tasks/${editTaskId}` : 'http://localhost:3000/tasks';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        
        if (editTaskId) {
          setTasks(tasks.map(task => task.id === editTaskId ? updatedTask : task));
          setEditTaskId(null);
        } else {
          setTasks([...tasks, updatedTask]);
        }

        setTitle('');
        setDescription('');
        setStatus('OPEN');
      } else {
        throw new Error('Failed to save task');
      }
    } catch (error) {
      alert('An unexpected error occurred');
    }
  };
  const handleDelete = async (taskId: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId)); 
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      alert('An unexpected error occurred while deleting the task');
    }
  };
  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditTaskId(task.id); // Set the task id to be edited
  };
  return (
    <div className="task-page">
      <h1>Tasks</h1>
      <input type="text" name="title" id="title" placeholder='Title' value={title} onChange={handleTitleChange}/>
      <input type="text" name="description" id="description" placeholder='Description' value={description} onChange={handleDescriptionChange}/>
      <label htmlFor="status">Status</label>
      <select name="status" id="status" value={status} onChange={handleStatusChange}>
        <option  className='open-status' value="OPEN">Open</option>
        <option className='inprogress-status' value="IN_PROGRESS">In progress</option>
        <option className='done-status' value="DONE">Done</option>
      </select>
      <button onClick={() => handleClick()}>{editTaskId ? 'Edit task' : "Add new task"}</button>
      <ul>
        {tasks.map((task) => (
          <><li key={task.id}> {task.title} {task.description} {task.status}</li>
          <button onClick={() => handleEdit(task)}>Edit</button>
          <button onClick={() => handleDelete(task.id)}>Delete</button></>

        ))}
      </ul>
    </div>
  );
};
