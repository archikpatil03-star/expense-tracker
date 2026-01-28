const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllExpenses, createExpense, updateExpense, deleteExpense, getAvailableMonths, getAvailableDays } = require('../controllers/expenseController');

router.use(authMiddleware);

router.get('/months', getAvailableMonths);
router.get('/days', getAvailableDays);
router.get('/', getAllExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
