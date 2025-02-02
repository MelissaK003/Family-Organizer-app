import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const { current_user, authToken } = useContext(UserContext);

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/tasks', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTasks(data);
            } else {
                toast.error(data.error || 'Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Network error while fetching tasks');
        }
    };

    // Add new task
    const addTask = async (title, description, deadline, assigned_to) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    deadline,
                    assigned_to
                })
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                fetchTasks();  // Re-fetch tasks after successfully adding
            } else {
                toast.error(data.error || 'Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            toast.error('Network error while adding task');
        }
    };

    // Update task
    const updateTask = async (taskId, updateData) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/task/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(errorData.error || 'Failed to update task');
            }

            const data = await response.json();
            toast.success(data.success);
            fetchTasks();  // Re-fetch tasks after updating
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Network error while updating task');
        }
    };

    // Delete task - similar to how deleteEvent was implemented in EventContext
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/task/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            toast.success("Task deleted successfully!");
            fetchTasks(); // Re-fetch tasks after deletion
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    // Fetch tasks when component changes
    useEffect(() => {
        if (authToken && current_user) {
            fetchTasks(); // Fetch tasks only if user is logged in
        }
    }, [authToken, current_user]); // Re-run fetch when authToken or current_user changes

    return (
        <TaskContext.Provider value={{
            tasks,
            fetchTasks,
            addTask,
            updateTask,
            deleteTask
        }}>
            {children}
        </TaskContext.Provider>
    );
};
