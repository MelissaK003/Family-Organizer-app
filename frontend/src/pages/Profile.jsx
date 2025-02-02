import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';
import { EventContext } from '../context/EventContext';

export default function Profile() {
    const { tasks = [], fetchTasks, deleteTask } = useContext(TaskContext);
    const { current_user } = useContext(UserContext);
    const { userAttendingEvents, fetchUserAttendingEvents } = useContext(EventContext);
    
    const [assignedTasks, setAssignedTasks] = useState([]);

    // Fetch tasks assigned to the current user
    useEffect(() => {
        if (current_user) {
            fetchTasks();
        }
    }, [current_user]);

    // Filter tasks assigned to the current user
    useEffect(() => {
        if (current_user) {
            const userAssignedTasks = tasks.filter(task => task.assigned_to === current_user.id);
            setAssignedTasks(userAssignedTasks);
        }
    }, [tasks, current_user]);

    // Handle task deletion
    const handleDeleteTask = (taskId) => {
        if (taskId) {
            deleteTask(taskId);
        } else {
            console.error('Task ID is undefined');
        }
    };

    // Format date for better display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-8">
            {/* Tasks Section */}
            <div className="bg-yellow-100 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    My Assigned Tasks
                </h1>
                {assignedTasks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                                    <p className="text-gray-700 mb-2">{task.description}</p>
                                    <p className="text-gray-600 mb-4"><strong>Deadline:</strong> {task.deadline}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tasks assigned to you at the moment.</p>
                )}
            </div>

            {/* Events Section */}
            <div className="bg-blue-100 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Events I'm Attending
                </h1>
                {userAttendingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userAttendingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="p-4 bg-white rounded-lg shadow-lg"
                            >
                                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                                <p className="text-gray-700 mb-2">{event.description}</p>
                                <p className="text-gray-600">
                                    <strong>Date:</strong> {formatDate(event.event_date)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You haven't confirmed attendance for any events yet.</p>
                )}
            </div>
        </div>
    );
}