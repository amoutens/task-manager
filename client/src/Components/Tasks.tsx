import React, { useEffect, useState } from 'react';
import { Task } from '../Interfaces/Task';
import { useNavigate } from 'react-router-dom';
import { lighten } from 'polished';
import '../assets/scrollbar.css' 
import { useAuth } from './AuthProvider';
import { EditButton } from './Buttons/EditButton';
import { DeleteButton } from './Buttons/DeleteButton';
import '../assets/dropdown.css'

export const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [status, setStatus] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("Open");
  const [isOpen, setIsOpen] = useState(false);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value); 

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { login: authenticate } = useAuth();

  
  const bgColorTaskCard = {
    OPEN: 'rgb(231, 56, 56, 70%)',
    IN_PROGRESS: 'rgb(115, 13, 115, 70%)',
    DONE: 'rgb(56, 157, 45, 70%)'
  }
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option: string) => {
    const statusMapping = {
      'In progress': 'IN_PROGRESS',
      'Done': 'DONE',
      'Open': 'OPEN'
    };
    setStatus(statusMapping[option]);
    setStatusValue(option);
    setIsOpen(false);
  };
  
  
  useEffect(() => {
    console.log("Status changed to:", status);
  }, [status]);
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('isFirstVisit');
  
    if (!isFirstVisit) {
      localStorage.removeItem('token');
      localStorage.setItem('isFirstVisit', 'true'); 
      alert('Please log in again.');
      window.location.href = '/'; 
      return;
    }

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
    console.log('Task Data:', taskData);
  
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
        console.log('Updated Task:', updatedTask);
  
        if (editTaskId) {
          setTasks(tasks.map(task => task.id === editTaskId ? updatedTask : task));
          setEditTaskId(null);
        } else {
          setTasks([...tasks, updatedTask]);
        }
  
        setTitle('');
        setDescription('');
        // Ensure status isn't being reset here
        // setStatus('OPEN');
      } else {
        throw new Error('Failed to save task');
      }
    } catch (error) {
      alert('An unexpected error occurred');
      console.error(error);
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
    setEditTaskId(task.id); 
  };
  return (
    <div className="task-page">
      <div className='scroll'></div>
      <h1>Tasks</h1>
      <input type="text" name="title" id="title" placeholder='Title' value={title} onChange={handleTitleChange}/>
      <input type="text" name="description" id="description" placeholder='Description' value={description} onChange={handleDescriptionChange}/>


      <div className="dropdown">
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {statusValue}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleOptionClick("Open")}>Open</li>
          <li onClick={() => handleOptionClick("In progress")}>In progress</li>
          <li onClick={() => handleOptionClick("Done")}>Done</li>
        </ul>
      )}
    </div>
    
      {/* <label htmlFor="status">Status</label>
      <select name="status" id="status" value={status} onChange={handleStatusChange}>
        <option  className='open-status' value="OPEN">Open</option>
        <option className='inprogress-status' value="IN_PROGRESS">In progress</option>
        <option className='done-status' value="DONE">Done</option>
      </select> */}
      <button onClick={() => handleClick()}>{editTaskId ? 'Edit task' : "Add new task"}</button>
      <ul>
        {tasks.map((task) => (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ 
            backgroundColor:  bgColorTaskCard[task.status],
            border: `2px solid ${lighten(0.1, bgColorTaskCard[task.status])}`,
            boxShadow: isHovered ? `0px 0px 10px ${lighten(0.1,bgColorTaskCard[task.status])}` : ''
        }}><li key={task.id}> 
        <p>{task.title} 
        <span onClick={() => handleEdit(task)}><EditButton /></span>
        <span onClick={() => handleDelete(task.id)}><DeleteButton/></span>
        </p> 
        <span>{task.description}</span> 
        <span className='status-span'>{task.status}</span></li>
          </div>

        ))}
      </ul>
    </div>
  );
};
