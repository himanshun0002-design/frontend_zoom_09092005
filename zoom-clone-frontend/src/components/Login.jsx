import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaUser, FaLock, FaSignInAlt, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { getApiBaseUrl } from '../config/serverConfig';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/chat/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                login(username);  // ⚡ Store username in context
                navigate('/room');
            } else {
                setError(data.error || 'Login failed. Try again.');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="app-logo">
                    <FaVideo size={32} />
                    <h1>MeetEasy</h1>
                </div>

                <h2 className="login-title">Welcome Back!</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        placeholder="Username"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="login-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </div>
        </div>
    );
}

export default Login;
