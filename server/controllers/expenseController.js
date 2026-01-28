const db = require('../db');

const getAllExpenses = async (req, res) => {
    const { category_id } = req.query;
    const userId = req.user.id;

    try {
        let query = 'SELECT * FROM expenses WHERE user_id = ?';
        let params = [userId];

        if (category_id) {
            query += ' AND category_id = ?';
            params.push(category_id);
        }

        if (req.query.date) {
            query += ' AND DATE(date) = ?';
            params.push(req.query.date);
        }

        if (req.query.month) {
            query += ' AND DATE_FORMAT(date, "%Y-%m") = ?';
            params.push(req.query.month);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const [expenses] = await db.query(query, params);
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createExpense = async (req, res) => {
    const { description, amount, category_id, date } = req.body;
    const userId = req.user.id;

    if (!amount || !date) {
        return res.status(400).json({ error: 'Amount and date are required' });
    }

    try {

        if (category_id) {
            const [category] = await db.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [category_id, userId]);
            if (category.length === 0) {
                return res.status(400).json({ error: 'Invalid category' });
            }
        }

        const [result] = await db.query(
            'INSERT INTO expenses (description, amount, category_id, user_id, date) VALUES (?, ?, ?, ?, ?)',
            [description, amount, category_id || null, userId, date]
        );

        res.status(201).json({ id: result.insertId, description, amount, category_id, user_id: userId, date });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { description, amount, category_id, date } = req.body;
    const userId = req.user.id;

    console.log('=== UPDATE EXPENSE REQUEST ===');
    console.log('Expense ID:', id);
    console.log('User ID:', userId);
    console.log('Payload:', { description, amount, category_id, date });

    try {

        if (category_id !== null && category_id !== undefined) {
            console.log('Validating category:', category_id);
            const [category] = await db.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [category_id, userId]);
            console.log('Category validation result:', category);
            if (category.length === 0) {
                console.log('Category validation FAILED - category not found or unauthorized');
                return res.status(400).json({ error: 'Invalid category' });
            }
            console.log('Category validation PASSED');
        } else {
            console.log('No category validation needed (category_id is null/undefined)');
        }

        console.log('Executing UPDATE query...');
        const [result] = await db.query(
            'UPDATE expenses SET description = ?, amount = ?, category_id = ?, date = ? WHERE id = ? AND user_id = ?',
            [description, amount, category_id || null, date, id, userId]
        );

        console.log('UPDATE result:', result);
        console.log('Affected rows:', result.affectedRows);

        if (result.affectedRows === 0) {
            console.log('UPDATE FAILED - no rows affected');
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        console.log('UPDATE SUCCESSFUL');
        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('UPDATE ERROR:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const [result] = await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAvailableMonths = async (req, res) => {
    const userId = req.user.id;
    try {
        const [months] = await db.query(
            'SELECT DISTINCT DATE_FORMAT(date, "%Y-%m") as month FROM expenses WHERE user_id = ? ORDER BY month DESC',
            [userId]
        );
        res.json(months.map(m => m.month));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAvailableDays = async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month) return res.status(400).json({ error: 'Month is required' });

    try {
        const [days] = await db.query(
            'SELECT DISTINCT DATE_FORMAT(date, "%Y-%m-%d") as day FROM expenses WHERE user_id = ? AND DATE_FORMAT(date, "%Y-%m") = ? ORDER BY day DESC',
            [userId, month]
        );
        res.json(days.map(d => d.day));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense, getAvailableMonths, getAvailableDays };
