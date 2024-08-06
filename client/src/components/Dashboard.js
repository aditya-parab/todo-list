import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', { name: newTask }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTasks([...tasks, res.data]);
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(task => task._id === id);
      const res = await axios.put(`/api/tasks/${id}`, { completed: !task.completed }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  }).filter(task => task.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-5">
      <h2>Task Dashboard</h2>
      <form onSubmit={addTask}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">Add Task</button>
          </div>
        </div>
      </form>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <select className="form-control" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <ul className="list-group">
        {filteredTasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
          />
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;