const db = require('../db');

const getTotals = async (req, res) => {
    const userId = req.user.id;

    try {

        const [totalResult] = await db.query('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?', [userId]);
        const total = totalResult[0].total || 0;

        const [todayResult] = await db.query('SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND DATE(date) = CURDATE()', [userId]);
        const total_today = todayResult[0].total || 0;

        const [monthResult] = await db.query('SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE())', [userId]);
        const total_month = monthResult[0].total || 0;

        const [categoryTotals] = await db.query(`
      SELECT c.id, c.name, SUM(e.amount) as total
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      GROUP BY c.id, c.name
    `, [userId]);

        res.json({
            total,
            total_today,
            total_month,
            category_totals: categoryTotals
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getTotals };
