import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import RoomJoin from './components/RoomJoin';
import Signup from './components/Signup';
import ChatPage from './components/ChatPage';
import MeetingsList from './components/MeetingsList';
import MeetingRoom from './components/MeetingRoom';
import ConnectionTest from './components/ConnectionTest';
import './components/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/room" element={<RoomJoin />} />
                <Route path="/MeetingRoom" element={<MeetingRoom />} />
                <Route path="/ChatPage" element={<ChatPage />} />
                <Route path="/meetings" element={<MeetingsList />} />
                <Route path="/test-connection" element={<ConnectionTest />} />
            </Routes>
        </Router>
    );
}

export default App;
