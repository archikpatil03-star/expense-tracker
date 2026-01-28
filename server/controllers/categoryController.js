const db = require('../db');

const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories WHERE user_id = ?', [req.user.id]);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {

        const [existing] = await db.query('SELECT id FROM categories WHERE name = ? AND user_id = ?', [name, req.user.id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const [result] = await db.query('INSERT INTO categories (name, user_id) VALUES (?, ?)', [name, req.user.id]);
        res.status(201).json({ id: result.insertId, name, user_id: req.user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {

        const [existing] = await db.query('SELECT id FROM categories WHERE name = ? AND user_id = ? AND id != ?', [name, req.user.id, id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Category Name already exists' });
        }

        const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ? AND user_id = ?', [name, id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found or not authorized' });
        }
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found or not authorized' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
