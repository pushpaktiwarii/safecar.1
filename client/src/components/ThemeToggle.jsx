import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    // On mount, read from localStorage or default to dark
    useEffect(() => {
        const savedTheme = localStorage.getItem('aidlyn-theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('aidlyn-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                zIndex: 9999,
                color: 'var(--text-main)',
                transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border)';
            }}
        >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
}
