import React, { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Hero.css';
import { AuthContext } from '../../context/AuthContext';  // ✅ Import AuthContext
import { getApiBaseUrl } from '../../config/serverConfig';

function Hero() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const { username } = useContext(AuthContext);  // ✅ Get current logged-in username

    const handleScheduleClick = () => {
        setShowCalendar(true);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleConfirm = async () => {
        if (!selectedDate || !username) {
            alert('You must be logged in to schedule a meeting.');
            return;
        }

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/chat/schedule/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,             // from AuthContext
                    datetime: selectedDate.toISOString(),
                }),
            });


            const data = await response.json();

            if (response.status === 201) {
                alert('Meeting successfully scheduled for: ' + selectedDate.toLocaleString());
            } else {
                alert('Failed: ' + (data.error || 'Something went wrong'));
            }

        } catch (err) {
            console.error('Schedule error:', err);
            alert('Server error, try again later');
        }

        setShowCalendar(false);
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Connect with Anyone, Anytime</h1>
                <p>MeetEasy provides crystal-clear video conferencing with screen sharing, recording, and real-time collaboration tools for productive meetings.</p>

                {/* ⚡ Display current username */}
                {username ? (
                    <p><strong>Logged in as:</strong> {username}</p>
                ) : (
                    <p style={{ color: 'red' }}>Please login to schedule a meeting</p>
                )}

                <div className="hero-buttons">
                    <button className="btn btn-primary btn-large" onClick={() => alert('Start Meeting clicked')}>
                        <i className="fas fa-video"></i> Start Meeting
                    </button>
                    <button className="btn btn-secondary btn-large" onClick={handleScheduleClick}>
                        <i className="fas fa-calendar-plus"></i> Schedule
                    </button>
                </div>

                {showCalendar && (
                    <div className="calendar-overlay">
                        <div className="calendar-popup">
                            <div className="popup-header">
                                <h3>Schedule a Meeting</h3>
                                <button className="close-btn" onClick={() => setShowCalendar(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="popup-content">
                                <div className="datepicker-container">
                                    <label>Select Date & Time</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        placeholderText="Choose date and time"
                                        minDate={new Date()}
                                        calendarClassName="meeteasy-calendar"
                                    />
                                </div>
                                <div className="selected-time">
                                    {selectedDate && (
                                        <p>Selected: {selectedDate.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                            <div className="popup-actions">
                                <button className="btn btn-cancel" onClick={() => setShowCalendar(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-confirm"
                                    onClick={handleConfirm}
                                    disabled={!selectedDate || !username}
                                >
                                    Schedule Meeting
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="hero-decoration">
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
                <div className="decoration-circle"></div>
            </div>
        </section>
    );
}

export default Hero;
