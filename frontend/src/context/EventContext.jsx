import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [userAttendingEvents, setUserAttendingEvents] = useState([]);
    const { authToken, current_user } = useContext(UserContext);

    const fetchEvents = async () => {
        if (!current_user) return;
        try {
            const response = await fetch('https://family-organizer-app.onrender.com/events', {
                headers: { 
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events');
        }
    };

    const UserAttendingEvents = async () => {
        if (!current_user) return;
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/event_attendances/user/${current_user.id}`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUserAttendingEvents(data.events || []);
        } catch (error) {
            console.error('Error fetching user attending events:', error);
            toast.error('Failed to fetch attended events');
        }
    };

    const addEvent = async (title, description, event_date, user_id) => {
        try {
            const response = await fetch('https://family-organizer-app.onrender.com/event', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ title, description, event_date, created_by: user_id })
            });
            if (!response.ok) throw new Error('Failed to add event');
            const data = await response.json();
            toast.success(data.success || "Event added successfully!");
            fetchEvents();
        } catch (error) {
            console.error('Error adding event:', error);
            toast.error('Failed to add event');
        }
    };

    const EventAttendanceStatus = async (eventId) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/event_attendance/${eventId}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: current_user.id })
            });
            if (!response.ok) throw new Error('Failed to update attendance');
            const data = await response.json();
            toast.success(data.message || "Attendance updated successfully!");
            fetchEvents();
            UserAttendingEvents();
        } catch (error) {
            console.error('Error updating attendance:', error);
            toast.error('Failed to update attendance');
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(`https://family-organizer-app.onrender.com/event/${eventId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${authToken}`
                 }
            });
            if (!response.ok) throw new Error('Failed to delete event');
            toast.success("Event deleted successfully!");
            fetchEvents();
            UserAttendingEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        }
    };

    useEffect(() => {
        if (authToken && current_user) {
            fetchEvents();
            UserAttendingEvents();
        }
    }, [authToken, current_user]);

    return (
        <EventContext.Provider value={{
            events, 
            userAttendingEvents, 
            fetchEvents, 
            UserAttendingEvents,
            addEvent, 
            deleteEvent, 
            EventAttendanceStatus
        }}>
            {children}
        </EventContext.Provider>
    );
};

export default EventProvider;
