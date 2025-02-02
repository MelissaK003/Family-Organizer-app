import React, { useContext, useEffect, useState } from 'react';
import { EventContext } from '../context/EventContext';
import { UserContext } from '../context/UserContext';

const Events = () => {
  const { events, fetchEvents, toggleEventAttendance } = useContext(EventContext);
  const { current_user, authToken } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
  });

  useEffect(() => {
    if (current_user) {
      fetchEvents();
    }
  }, [current_user, fetchEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...newEvent,
          user_id: current_user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setNewEvent({ title: '', description: '', event_date: '' });
      setShowForm(false);
      fetchEvents();

    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/event/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }

        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleAttendance = async (eventId) => {
    try {
      await toggleEventAttendance(eventId);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-yellow-500 focus:border-yellow-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="event_date"
                value={newEvent.event_date}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition-colors"
            >
              Add Event
            </button>
          </form>
        </div>
      )}
      
      {/* Events Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div 
              key={event.id} 
              className="bg-yellow-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col h-full"
            >
              {/* Content Section */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString()}
                  </span>
                  {event.created_by === current_user.id && (
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              
              {/* Button Section - Always at bottom */}
              <div className="pt-4 mt-auto">
                <button
                  onClick={() => handleAttendance(event.id)}
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    event.is_attending
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {event.is_attending ? 'Cancel Attendance' : 'Confirm Attendance'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No events found
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;