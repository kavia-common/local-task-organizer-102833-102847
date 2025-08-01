import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { loadTasks, saveTasks } from './utils/localStorage';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(() => {
    // Auto-detect theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterTag, setFilterTag] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...taskData
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  // PUBLIC_INTERFACE
  const updateTask = (taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // PUBLIC_INTERFACE
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // PUBLIC_INTERFACE
  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task
    ));
  };

  // PUBLIC_INTERFACE
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // PUBLIC_INTERFACE
  const openEditForm = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // PUBLIC_INTERFACE
  const closeForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Get unique tags for filter dropdown
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => !filterTag || (task.tags && task.tags.includes(filterTag)))
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'createdAt' || sortBy === 'expiryDate') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (sortBy === 'importance') {
        const importanceOrder = { high: 3, medium: 2, low: 1 };
        aValue = importanceOrder[aValue] || 0;
        bValue = importanceOrder[bValue] || 0;
      } else if (sortBy === 'timeEstimate') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Todo Organizer</h1>
          <div className="header-controls">
            <button 
              className="btn btn-primary"
              onClick={() => setShowTaskForm(true)}
            >
              + Add Task
            </button>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-controls">
            <select 
              value={filterTag} 
              onChange={(e) => setFilterTag(e.target.value)}
              className="filter-select"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              <button 
                className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                onClick={() => handleSort('title')}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'importance' ? 'active' : ''}`}
                onClick={() => handleSort('importance')}
              >
                Importance {sortBy === 'importance' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'expiryDate' ? 'active' : ''}`}
                onClick={() => handleSort('expiryDate')}
              >
                Due Date {sortBy === 'expiryDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'createdAt' ? 'active' : ''}`}
                onClick={() => handleSort('createdAt')}
              >
                Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <TaskList 
          tasks={filteredAndSortedTasks}
          onToggleComplete={toggleTaskComplete}
          onEditTask={openEditForm}
          onDeleteTask={deleteTask}
        />
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? updateTask : addTask}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

export default App;
