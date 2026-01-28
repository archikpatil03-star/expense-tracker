import { useState } from 'react';
import API_URL from '../config/api';

const CategoryManager = ({ categories, token, onUpdate }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory }),
            });
            if (res.ok) {
                setNewCategory('');
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
        if (!window.confirm('Delete category?')) return;
        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card">
            <h3 className="mb-4">Categories</h3>
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input
                    className="input"
                    style={{ marginBottom: 0 }}
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category"
                    required
                />
                <button type="submit" className="btn">+</button>
            </form>
            <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                        <span>{cat.name}</span>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="btn btn-danger btn-icon"
                            style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
                {categories.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No categories yet.</p>}
            </div>
        </div>
    );
};

export default CategoryManager;
