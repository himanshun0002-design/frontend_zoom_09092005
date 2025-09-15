import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../config/serverConfig';
import './MeetingsList.css';

function MeetingsList() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

const fetchMeetings = async () => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/chat/meetings/`);
        if (!response.ok) throw new Error('Failed to load meetings');
        const data = await response.json();

        // Get the logged-in user's username (assuming it's stored in localStorage)
        const loggedInUser = localStorage.getItem('username');

        // Filter meetings for the current user only
        const userMeetings = data.filter(meeting => meeting.username === loggedInUser);

        setMeetings(userMeetings);
    } catch (err) {
        console.error('Failed to fetch meetings:', err);
        setError('Failed to load meetings.');
    } finally {
        setLoading(false);
    }
};


    const cancelMeeting = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this meeting?')) return;

        console.log('Attempting to cancel meeting with id:', id);

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/chat/meetings/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                console.log('Meeting deleted successfully on server');
                setMeetings(meetings.filter(m => m.id !== id));
                setShowModal(false);
                alert('Meeting cancelled successfully.');
            } else {
                let errorMessage = 'Unknown error';
                try {
                    const data = await response.json();
                    if (data.error) errorMessage = data.error;
                } catch (_) { }
                console.error('Failed to delete meeting:', errorMessage);
                alert('Failed to cancel meeting: ' + errorMessage);
            }
        } catch (err) {
            console.error('Error cancelling meeting:', err);
            alert('Server error while cancelling meeting.');
        }
    };

    const showMeetingDetails = (meeting) => {
        setSelectedMeeting(meeting);
        setShowModal(true);
    };

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInPrevMonth = firstDay.getDay();
        const totalDays = 42; // 6 weeks
        const calendar = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < daysInPrevMonth; i++) {
            const day = prevMonthLastDay - (daysInPrevMonth - i - 1);
            const date = new Date(year, month - 1, day);
            calendar.push({
                date,
                isCurrentMonth: false,
                meetings: meetings.filter(m => isSameDay(new Date(m.datetime), date))
            });
        }

        // Current month days
        const daysInMonth = lastDay.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            calendar.push({
                date,
                isCurrentMonth: true,
                meetings: meetings.filter(m => isSameDay(new Date(m.datetime), date))
            });
        }

        // Next month days
        const remainingDays = totalDays - calendar.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i);
            calendar.push({
                date,
                isCurrentMonth: false,
                meetings: meetings.filter(m => isSameDay(new Date(m.datetime), date))
            });
        }

        return calendar;
    };

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    if (loading) return (
        <div className="meetings-container">
            <div className="loading-spinner"></div>
            <p>Loading meetings...</p>
        </div>
    );

    if (error) return (
        <div className="meetings-container">
            <div className="error-message">
                <p>{error}</p>
                <button className="retry-button" onClick={fetchMeetings}>Retry</button>
            </div>
        </div>
    );

    const calendarDays = generateCalendar();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="meetings-container">
            <div className="header-section">
                <h2 className="meetings-title">Scheduled Meetings</h2>
                <div className="view-toggle">
                    <button
                        className={viewMode === 'calendar' ? 'toggle-active' : ''}
                        onClick={() => setViewMode('calendar')}
                    >
                        Calendar View
                    </button>
                    <button
                        className={viewMode === 'list' ? 'toggle-active' : ''}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <>
                    <div className="calendar-nav">
                        <button className="nav-button today-button" onClick={goToToday}>Today</button>
                        <div className="month-nav">
                            <button className="nav-button" onClick={() => changeMonth(-1)}>←</button>
                            <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                            <button className="nav-button" onClick={() => changeMonth(1)}>→</button>
                        </div>
                        <button className="nav-button add-button">+ New Meeting</button>
                    </div>

                    {meetings.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <h3>No meetings scheduled</h3>
                            <p>You don't have any meetings scheduled for this period.</p>
                            <button className="primary-button">Schedule a Meeting</button>
                        </div>
                    ) : (
                        <div className="calendar-wrapper">
                            <div className="calendar">
                                <div className="calendar-header">
                                    {dayNames.map(day => (
                                        <div key={day} className="calendar-day-header">{day}</div>
                                    ))}
                                </div>
                                <div className="calendar-grid">
                                    {calendarDays.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${isSameDay(day.date, new Date()) ? 'today' : ''}`}
                                        >
                                            <div className="day-number">{day.date.getDate()}</div>
                                            <div className="day-meetings">
                                                {day.meetings.slice(0, 3).map(meeting => (
                                                    <div
                                                        key={meeting.id}
                                                        className="meeting-badge"
                                                        onClick={() => showMeetingDetails(meeting)}
                                                    >
                                                        <div className="meeting-time">
                                                            {new Date(meeting.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className="meeting-title">{meeting.username}</div>
                                                    </div>
                                                ))}
                                                {day.meetings.length > 3 && (
                                                    <div className="more-meetings">
                                                        +{day.meetings.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="list-view">
                    <div className="list-header">
                        <h3>All Scheduled Meetings</h3>
                        <button className="primary-button">+ New Meeting</button>
                    </div>
                    <div className="meetings-list">
                        {meetings.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📅</div>
                                <h3>No meetings scheduled</h3>
                                <p>You don't have any meetings scheduled.</p>
                            </div>
                        ) : (
                            meetings.map(meeting => (
                                <div key={meeting.id} className="meeting-item">
                                    <div className="meeting-date">
                                        <div className="date-day">{new Date(meeting.datetime).getDate()}</div>
                                        <div className="date-month">{new Date(meeting.datetime).toLocaleString('default', { month: 'short' })}</div>
                                    </div>
                                    <div className="meeting-info">
                                        <h4 className="meeting-title">{meeting.username}</h4>
                                        <p className="meeting-time">
                                            {new Date(meeting.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="meeting-actions">
                                        <button
                                            className="action-button details"
                                            onClick={() => showMeetingDetails(meeting)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showModal && selectedMeeting && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <h3>Meeting Details</h3>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">User:</span>
                                <span className="detail-value">{selectedMeeting.username}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">{new Date(selectedMeeting.datetime).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">{new Date(selectedMeeting.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {selectedMeeting.description && (
                                <div className="detail-row">
                                    <span className="detail-label">Description:</span>
                                    <span className="detail-value">{selectedMeeting.description}</span>
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            <button className="btn-danger" onClick={() => cancelMeeting(selectedMeeting.id)}>Cancel Meeting</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MeetingsList;
