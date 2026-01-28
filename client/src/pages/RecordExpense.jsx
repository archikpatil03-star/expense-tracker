import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const RecordExpense = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.amount || !formData.date) {
            setError('Amount and date are required');
            return;
        }

        try {
            const body = {
                description: formData.description || '',
                amount: formData.amount,
                date: formData.date,
                category_id: selectedCategory.id
            };

            const response = await fetch(`${API_URL}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setSuccessMessage('Expense added successfully!');
                setFormData({
                    description: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0]
                });
                fetchCategories();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save expense');
            }
        } catch (error) {
            setError('Error saving expense');
        }
    };

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
            setError('');
            setSuccessMessage('');
        } else {
            navigate('/');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <header className="mb-6 flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        ← Back
                    </button>
                    <h1>
                        {selectedCategory ? `Add to ${selectedCategory.name}` : 'Select Category'}
                    </h1>
                </div>
                <button
                    onClick={() => navigate('/categories')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                    Manage Categories
                </button>
            </header>

            {categories.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        No categories found. Create a category to start tracking expenses.
                    </p>
                    <button
                        className="btn"
                        onClick={() => navigate('/categories')}
                    >
                        Create First Category
                    </button>
                </div>
            ) : selectedCategory ? (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        New Transaction
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="p-3 mb-4 text-danger bg-danger-subtle border border-danger rounded">{error}</div>}
                        {successMessage && <div className="p-3 mb-4 text-success bg-success-subtle border border-success rounded">{successMessage}</div>}

                        <div className="mb-4">
                            <label className="label">Amount (₹) <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                style={{ fontSize: '1.5rem', fontWeight: '700', padding: '1rem' }}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-4">
                            <label className="label">Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="label">Description (Optional)</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., Grocery shopping"
                            />
                        </div>

                        <button type="submit" className="btn w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                            Save Expense
                        </button>
                    </form>
                </div>

            ) : (
                <div className="stats-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="stat-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div className="stat-label">
                                {category.name}
                            </div>
                            <div className="stat-value">
                                ₹{(category.total || 0).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                {category.expense_count || 0} expenses
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default RecordExpense;
