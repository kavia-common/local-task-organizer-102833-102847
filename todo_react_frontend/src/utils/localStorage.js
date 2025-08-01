const TASKS_KEY = 'todo_tasks';

// PUBLIC_INTERFACE
export const loadTasks = () => {
  /**
   * Load tasks from localStorage
   * Returns an array of tasks or empty array if none exist
   */
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// PUBLIC_INTERFACE
export const saveTasks = (tasks) => {
  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of task objects to save
   */
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// PUBLIC_INTERFACE
export const clearTasks = () => {
  /**
   * Clear all tasks from localStorage
   */
  try {
    localStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks from localStorage:', error);
  }
};
