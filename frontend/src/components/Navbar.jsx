import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    // Don't show navbar on auth pages
    if (['/login', '/register'].includes(location.pathname)) return null;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div className="logo-icon">📄</div>
                ResumeAI
            </div>

            {isLoggedIn && (
                <div className="navbar-nav">
                    {[
                        { path: '/', label: 'Home' },
                        { path: '/builder', label: 'Builder' },
                        { path: '/history', label: 'History' },
                        { path: '/about', label: 'About' },
                    ].map(({ path, label }) => (
                        <div
                            key={path}
                            className={`nav-link ${isActive(path) ? 'active' : ''}`}
                            onClick={() => navigate(path)}
                            style={{ cursor: 'pointer' }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}

            <div className="navbar-actions">
                {isLoggedIn ? (
                    <>
                        <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                            {localStorage.getItem('userEmail') || 'User'}
                        </span>
                        <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Sign up free</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
