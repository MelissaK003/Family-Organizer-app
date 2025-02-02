import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const { current_user, authToken } = useContext(UserContext);

    const fetchTasks = async () => {
        try {
            const response = await fetch('https://family-organizer-app.onrender.com/tasks', {
                headers: { 
                    'Authorization': `Bearer ${authToken}`
                 }
            });
            const data = await response.json();
            response.ok ? setTasks(data) : toast.error(data.error || 'Failed to fetch tasks');
        } catch (error) {
            toast.error('Network error while fetching tasks');
        }
    };

    const addTask = async (title, description, deadline, assigned_to) => {
        try {
            const response = await fetch('https://family-organizer-app.onrender.com/task', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ title, description, deadline, assigned_to })
            });
            const data = await response.json();
            response.ok ? (toast.success(data.success), fetchTasks()) : toast.error(data.error || 'Failed to add task');
        } catch (error) {
            toast.error('Network error while adding task');
        }
    };

    const updateTask = async (taskId, updateData) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/task/${taskId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) throw new Error('Failed to update task');
            const data = await response.json();
            toast.success(data.success);
            fetchTasks();
        } catch (error) {
            toast.error('Network error while updating task');
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/task/${taskId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${authToken}`
                 }
            });
            if (!response.ok) throw new Error('Failed to delete task');
            toast.success("Task deleted successfully!");
            fetchTasks();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    useEffect(() => { if (authToken && current_user) fetchTasks(); }, [authToken, current_user]);

    return (
        <TaskContext.Provider value={{ 
            tasks, 
            fetchTasks, 
            addTask, 
            updateTask, 
            deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
