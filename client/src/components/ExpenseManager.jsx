import { useState } from 'react';
import API_URL from '../config/api';

const ExpenseManager = ({ expenses, categories, token, onUpdate }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ description, amount, category_id: categoryId || null, date }),
            });
            if (res.ok) {
                setDescription('');
                setAmount('');
                onUpdate();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete expense?')) return;
        try {
            const res = await fetch(`${API_URL}/api/expenses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const getCategoryName = (id) => {

        const cat = categories.find(c => c.id == id);
        return cat ? cat.name : 'Uncategorized';
    };

    return (
        <div className="card">
            <h3 className="mb-4">Recent Expenses</h3>

            { }
            <div className="mb-4 p-4" style={{ background: 'var(--bg-body)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <h4 className="label mb-4" style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Add New Transaction</h4>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label className="label">Description</label>
                        <input
                            className="input"
                            style={{ marginBottom: 0 }}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Lunch"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Amount (₹)</label>
                        <input
                            className="input"
                            style={{ marginBottom: 0 }}
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Category</label>
                        <select
                            className="input"
                            style={{ marginBottom: 0, cursor: 'pointer' }}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Date</label>
                        <input
                            className="input"
                            style={{ marginBottom: 0 }}
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" style={{ height: '45px' }}>Add Transaction</button>
                </form>
            </div>

            { }
            <div className="table-container">
                <div className="flex justify-between items-center p-2 mb-2" style={{ borderBottom: '2px solid var(--border)', fontWeight: '600', color: 'var(--text-muted)' }}>
                    <span style={{ flex: 2 }}>Description</span>
                    <span style={{ flex: 1 }}>Amount</span>
                    <span style={{ flex: 1 }}>Category</span>
                    <span style={{ flex: 1 }}>Date</span>
                    <span style={{ width: '40px' }}></span>
                </div>

                {expenses.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No expenses recorded yet.</div>
                ) : (
                    expenses.map((exp) => (
                        <div key={exp.id} className="table-row">
                            <span style={{ flex: 2, fontWeight: '500' }}>{exp.description}</span>
                            <span style={{ flex: 1, color: 'var(--text-main)' }}>₹{Number(exp.amount).toFixed(2)}</span>
                            <span style={{ flex: 1 }}>
                                <span className="badge">{getCategoryName(exp.category_id)}</span>
                            </span>
                            <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {new Date(exp.date).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                className="btn btn-danger btn-icon"
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseManager;
