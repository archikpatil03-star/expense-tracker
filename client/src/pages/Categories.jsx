import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Categories = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory }),
            });
            const data = await res.json();
            if (res.ok) {
                setNewCategory('');
                fetchCategories();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to add category');
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete category?')) return;
        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (cat, e) => {
        e.stopPropagation();
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/categories/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName }),
            });
            const data = await res.json();
            if (res.ok) {
                setEditingId(null);
                setEditName('');
                fetchCategories();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to update category');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Manage Categories</h2>
                <Link to="/" className="btn" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>Back to Dashboard</Link>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            <div className="card mb-4">
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        className="input"
                        style={{ marginBottom: 0 }}
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                        required
                    />
                    <button type="submit" className="btn">Add Category</button>
                </form>
            </div>

            <div className="grid gap-2">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="card flex justify-between items-center"
                        style={{ padding: '1rem', cursor: 'pointer', marginBottom: '0.5rem', transition: 'transform 0.1s' }}
                        onClick={() => navigate(`/categories/${cat.id}`)}
                    >
                        {editingId === cat.id ? (
                            <form onSubmit={handleUpdate} className="flex gap-2 w-full" onClick={e => e.stopPropagation()}>
                                <input
                                    className="input"
                                    style={{ marginBottom: 0 }}
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="btn btn-success">Save</button>
                                <button type="button" className="btn btn-danger" onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{cat.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => startEdit(cat, e)}
                                        className="btn"
                                        style={{ background: 'var(--bg-input)', padding: '4px 10px', fontSize: '0.9rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(cat.id, e)}
                                        className="btn btn-danger"
                                        style={{ padding: '4px 10px', fontSize: '0.9rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {categories.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No categories found.</p>}
            </div>
        </div>
    );
};

export default Categories;
