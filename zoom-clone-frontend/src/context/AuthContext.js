import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const login = (name) => {
        setUsername(name);
        localStorage.setItem('username', name);
    };

    const logout = () => {
        setUsername(null);
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
