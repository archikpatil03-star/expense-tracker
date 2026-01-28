import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TotalsDisplay from '../components/TotalsDisplay';
import ViewExpensesModal from '../components/ViewExpensesModal';
import API_URL from '../config/api';

const Dashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [totals, setTotals] = useState({ total: 0, category_totals: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const statsRes = await fetch(`${API_URL}/api/stats/totals`, { headers });
            const statsData = await statsRes.json();
            setTotals(statsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        <div className="dashboard-container">

            { }
            <TotalsDisplay totals={totals} />

            { }
            <div className="dashboard-actions-grid">
                <button
                    className="dashboard-action-card action-card-view"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="action-icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                    </div>
                    <div className="action-btn-title">View Expenses</div>
                    <div className="action-btn-description">Analyze your spending history</div>
                </button>

                <button
                    className="dashboard-action-card action-card-record"
                    onClick={() => navigate('/record-expenses')}
                >
                    <div className="action-icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 6h8v2h-8v-2z M8 10h8v2h-3.5c0 2.5 2 4.5 4.5 4.5v2c-3.1 0-5.6-2.1-6.6-5H8v-2h2.2c0.2-1.3 0.3-2 0.3-2H8v-2z" />
                        </svg>
                    </div>
                    <div className="action-btn-title">Record Expenses</div>
                    <div className="action-btn-description">Track a new transaction</div>
                </button>
            </div>

            <ViewExpensesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
