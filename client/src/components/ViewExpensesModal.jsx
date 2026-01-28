import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewExpensesModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-content card"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleNavigation('/expenses/today')}
                        style={{ justifyContent: 'flex-start', padding: '1.25rem' }}
                    >
                        <span style={{ marginRight: '1rem', fontSize: '1.2rem' }}>📅</span> Today's Expenses
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => handleNavigation('/expenses/month')}
                        style={{ justifyContent: 'flex-start', padding: '1.25rem' }}
                    >
                        <span style={{ marginRight: '1rem', fontSize: '1.2rem' }}>🗓️</span> This Month's Expenses
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => handleNavigation('/expenses/all')}
                        style={{ justifyContent: 'flex-start', padding: '1.25rem' }}
                    >
                        <span style={{ marginRight: '1rem', fontSize: '1.2rem' }}>♾️</span> All-Time Expenses
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewExpensesModal;
