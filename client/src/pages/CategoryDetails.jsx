import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config/api';

const CategoryDetails = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [category, setCategory] = useState(null);
    const [expenses, setExpenses] = useState([]);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const catRes = await fetch(`${API_URL}/api/categories`, { headers });
            const cats = await catRes.json();
            const currentCat = cats.find(c => c.id == id);
            setCategory(currentCat);

            const expRes = await fetch(`${API_URL}/api/expenses?category_id=${id}`, { headers });
            const exps = await expRes.json();
            setExpenses(exps);

        } catch (err) {
            console.error(err);
            setError('Failed to load data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, token]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description,
                    amount,
                    category_id: id,
                    date
                }),
            });

            if (res.ok) {
                setDescription('');
                setAmount('');
                fetchData();
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to add expense');
        }
    };

    const handleDeleteExpense = async (expId) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await fetch(`${API_URL}/api/expenses/${expId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (!category) return <div className="container p-4">Loading category...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link to="/categories" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Back to Categories</Link>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '0.5rem' }}>{category.name}</h2>
                </div>
            </div>

            { }
            <div className="card mb-6">
                <h4 className="mb-4 text-muted">Add New Expense</h4>
                {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label className="label">Description</label>
                        <input
                            className="input" style={{ marginBottom: 0 }}
                            value={description} onChange={e => setDescription(e.target.value)}
                            required placeholder="e.g. Taxi"
                        />
                    </div>
                    <div>
                        <label className="label">Amount</label>
                        <input
                            className="input" style={{ marginBottom: 0 }}
                            type="number" step="0.01"
                            value={amount} onChange={e => setAmount(e.target.value)}
                            required placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="label">Date</label>
                        <input
                            className="input" style={{ marginBottom: 0 }}
                            type="date"
                            value={date} onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" style={{ height: '46px' }}>Add</button>
                </form>
            </div>

            { }
            <div className="card">
                <h3 className="mb-4">Transactions History</h3>
                <div className="flex flex-col gap-2">
                    {expenses.length === 0 ? (
                        <p className="text-muted text-center py-4">No expenses in this category yet.</p>
                    ) : (
                        expenses.map(exp => (
                            <div key={exp.id} className="flex justify-between items-center p-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div className="flex flex-col">
                                    <span style={{ fontWeight: '500' }}>{exp.description}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(exp.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>₹{Number(exp.amount).toFixed(2)}</span>
                                    <button
                                        onClick={() => handleDeleteExpense(exp.id)}
                                        className="btn btn-danger btn-icon"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;
