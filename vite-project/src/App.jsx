import  { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import './App.css';

const App = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskText, setTaskText] = useState('');
  const [taskId, setTaskId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contractAddress = '0xD9eFa84AD07Eb993343Eecf7c9fDD3189A37B0D6';

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function handleAddTask() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        if (!taskTitle || !taskText) {
          throw new Error('Please enter both title and text for the task.');
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const isDeleted = false;
        const tx = await contract.addTask(taskText, taskTitle, isDeleted);
        console.log(taskText)
        await tx.wait();
        setTaskTitle('');
        setTaskText('');
        console.log('Task added successfully');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleDeleteTask() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        if (!taskId) {
          throw new Error('Please enter a task ID to delete.');
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        setTaskId('');
        console.log('Task deleted successfully');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getTasks() {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      setError('');
      try {
        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const tasks = await contract.getMyTask();
        console.log(tasks)
        setTasks(tasks);
        console.log('Tasks fetched successfully');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="App">
      <h1>Task Management</h1>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Add Task</h2>
        <input 
          type="text" 
          placeholder="Task Title" 
          value={taskTitle} 
          onChange={(e) => setTaskTitle(e.target.value)} 
          disabled={loading}
        />
        <textarea
          placeholder="Task Description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleAddTask} disabled={loading}>
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </div>

      <div>
        <h2>Delete Task</h2>
        <input 
          type="number" 
          placeholder="Task ID" 
          value={taskId} 
          onChange={(e) => setTaskId(e.target.value)} 
          disabled={loading}
        />
        <button onClick={handleDeleteTask} disabled={loading}>
          {loading ? 'Deleting Task...' : 'Delete Task'}
        </button>
      </div>

      <div>
        <h2>All Tasks</h2>
        <button onClick={getTasks} disabled={loading}>
          {loading ? 'Fetching Tasks...' : 'Get Tasks'}
          <h3> </h3>
        </button>

        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <strong>{task.taskTitle}</strong>: {task.taskText} (ID: {task.id}, Deleted: {task.isDeleted ? 'Yes' : 'No'})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
