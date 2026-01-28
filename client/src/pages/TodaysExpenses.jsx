import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const TodaysExpenses = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', amount: '', date: '' });

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const catRes = await fetch(`${API_URL}/api/categories`, { headers });
            const catData = await catRes.json();
            setCategories(catData);

            const expRes = await fetch(`${API_URL}/api/expenses?date=${today}`, { headers });
            const expData = await expRes.json();
            setExpenses(expData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await fetch(`${API_URL}/api/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setEditForm({
            description: expense.description || '',
            amount: expense.amount,
            date: expense.date.split('T')[0]
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/expenses/${editingExpense.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...editForm,
                    category_id: editingExpense.category_id
                })
            });

            if (response.ok) {
                setEditingExpense(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const groupedExpenses = expenses.reduce((acc, expense) => {
        const cat = categories.find(c => c.id === expense.category_id);
        const catName = cat ? cat.name : 'Uncategorized';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(expense);
        return acc;
    }, {});

    const totalToday = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <header className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/record-expenses')}
                        className="btn"
                        style={{ background: 'var(--bg-card)', padding: '0.5rem 1rem' }}
                    >
                        ←
                    </button>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Today's Expenses</h1>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Total: ₹{totalToday.toFixed(2)}
                </div>
            </header>

            {expenses.length === 0 ? (
                <div className="card text-center text-muted">
                    No expenses recorded for today ({today}).
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {Object.entries(groupedExpenses).map(([categoryName, categoryExpenses]) => (
                        <div key={categoryName} className="card">
                            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: '600' }}>
                                {categoryName}
                            </h3>
                            <div className="grid gap-3">
                                {categoryExpenses.map(expense => (
                                    <div key={expense.id} className="flex justify-between items-center py-2">
                                        {editingExpense?.id === expense.id ? (
                                            <form onSubmit={handleUpdate} className="flex gap-2 w-full items-center">
                                                <input
                                                    className="input"
                                                    style={{ margin: 0, flex: 2 }}
                                                    value={editForm.description}
                                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                    placeholder="Description"
                                                />
                                                <input
                                                    className="input"
                                                    type="number"
                                                    step="0.01"
                                                    style={{ margin: 0, flex: 1, minWidth: '80px' }}
                                                    value={editForm.amount}
                                                    onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                                                />
                                                <button type="submit" className="btn btn-sm">Save</button>
                                                <button type="button" className="btn btn-sm" style={{ background: 'var(--text-muted)' }} onClick={() => setEditingExpense(null)}>Cancel</button>
                                            </form>
                                        ) : (
                                            <>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{expense.description || 'No description'}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span style={{ fontWeight: '600' }}>₹{parseFloat(expense.amount).toFixed(2)}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(expense)}
                                                            className="btn-icon"
                                                            style={{ color: 'var(--primary)', cursor: 'pointer', border: 'none', background: 'none' }}
                                                        >
                                                            ✎
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="btn-icon"
                                                            style={{ color: 'var(--danger)', cursor: 'pointer', border: 'none', background: 'none' }}
                                                        >
                                                            🗑
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodaysExpenses;
