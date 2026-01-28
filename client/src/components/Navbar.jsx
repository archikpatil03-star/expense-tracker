import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    Expense<span style={{ color: 'var(--text-main)' }}>Tracker</span>
                </Link>
                <div>
                    {user ? (
                        <div className="profile-dropdown-container" ref={dropdownRef}>
                            <div
                                className="profile-avatar"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {getInitials(user.username)}
                            </div>

                            {isDropdownOpen && (
                                <div className="profile-menu">
                                    <div className="profile-menu-header">
                                        <span className="profile-username">{user.username}</span>
                                        <span className="profile-label">Manage Account</span>
                                    </div>
                                    <button
                                        className="profile-menu-item"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            logout();
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        !isAuthPage && <Link to="/login" className="btn">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
