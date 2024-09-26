import React, { useEffect, useState } from 'react';
import { Task } from '../Interfaces/Task';
import { Status } from '../Interfaces/Status';
import { useNavigate } from 'react-router-dom';
import { darken, lighten } from 'polished';
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
  const [status, setStatus] = useState<string>("OPEN");
  const [statusValue, setStatusValue] = useState<string>("Open");
  const [isOpen, setIsOpen] = useState(false);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value); 

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { login: authenticate } = useAuth();

  const [statuses, setStatuses] = useState<Status[]>([]);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const statusMapping : { [key: string]: string } = {
    'In progress': 'IN_PROGRESS',
    'Done': 'DONE',
    'Open': 'OPEN'
  };
  const handleOptionClick = (option: string) => {
    
    if(Object.keys(statusMapping).includes(`${option}`))
      {
        setStatus(statusMapping[option]);
      }
    else {
      setStatus(option)
    };
    
    
    setStatusValue(option);
    setIsOpen(false);
  };
  
  
  useEffect(() => {
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
    console.log('update task info', taskData)
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
        setStatus('OPEN');
        setStatusValue('Open')
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
    setStatus(task.status.name);
    setEditTaskId(task.id); 
    if (Object.values(statusMapping).includes(task.status.name)) {
      for (const key in statusMapping) {
          if (statusMapping[key] === task.status.name) {
              setStatusValue(key);
              break; 
          }
      }
    } else {
        setStatusValue(task.status.name); 
    }
    
  };
  const bgColorTaskCard = {
    OPEN: 'rgb(231, 56, 56, 70%)',
    IN_PROGRESS: 'rgb(115, 13, 115, 70%)',
    DONE: 'rgb(56, 157, 45, 70%)',
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated');
      window.location.href = '/'; 
      return;
    }
    fetch('http://localhost:3000/status', {
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
        throw new Error('Failed to fetch statuses');
      })
      .then((data) => {
        setStatuses(data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  return (
    <div className="task-page">
      <div className='scroll'></div>
      <input type="text" name="title" id="title" placeholder='Title' value={title} onChange={handleTitleChange}/>
      <input type="text" name="description" id="description" placeholder='Description' value={description} onChange={handleDescriptionChange}/>


      <div className="dropdown">
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {statusValue}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleOptionClick("Open")} 
          style={{
            backgroundColor: bgColorTaskCard.OPEN,
            border: `3px solid ${lighten(0.1, bgColorTaskCard.OPEN)}`
            }}>
          Open</li>
          <li onClick={() => handleOptionClick("In progress")} 
          style={{backgroundColor: bgColorTaskCard.IN_PROGRESS,
            border: `3px solid ${lighten(0.1, bgColorTaskCard.IN_PROGRESS)}`
          }}>
          In progress</li>
          <li onClick={() => handleOptionClick("Done")}  
          style={{backgroundColor: bgColorTaskCard.DONE,
            border: `3px solid ${lighten(0.1, bgColorTaskCard.DONE)}`
          }}>
          Done</li>
          {statuses.map((stat) => (
           <li onClick={() => handleOptionClick(stat.name)}  
           style={{backgroundColor: stat.color,
             border: `3px solid ${lighten(0.1, stat.color)}`
           }}>
           {stat.name}</li>

        ))}
        </ul>
      )}
    </div>
    
      <button onClick={() => handleClick()}>{editTaskId ? 'Edit task' : "Add new task"}</button>
      <ul>
        {tasks.map((task) => (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ 
            backgroundColor:  task.status.color,
            border: `2px solid ${lighten(0.1, task.status.color) }`,
            boxShadow: isHovered ? `0px 0px 10px ${lighten(0.1,task.status.color)}` : ''
        }}><li key={task.id}> 
        <p>{task.title} 
        <span onClick={() => handleEdit(task)}><EditButton /></span>
        <span onClick={() => handleDelete(task.id)}><DeleteButton/></span>
        </p> 
        <span>{task.description}</span> 
        <span className='status-span'>{task.status.name}</span></li>
          </div>

        ))}
      </ul>
    </div>
  );
};
