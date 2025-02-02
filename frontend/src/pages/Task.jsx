import React, { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Task() {
  const { addTask } = useContext(TaskContext);
  const { current_user } = useContext(UserContext);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assigned_to: '' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title && newTask.deadline && newTask.assigned_to) {
      addTask(
        newTask.title,
        newTask.description,
        newTask.deadline,
        newTask.assigned_to 
      );
      // Reset form
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        assigned_to: ''
      });
    }
  };

  return (
    <div className="bg-yellow-500 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add Task</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={newTask.deadline}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">Assigned To </label>
          <input
            type="text"
            id="assigned_to"
            name="assigned_to"
            value={newTask.assigned_to}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter full name"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
