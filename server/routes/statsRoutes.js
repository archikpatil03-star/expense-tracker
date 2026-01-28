const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTotals } = require('../controllers/statsController');

router.use(authMiddleware);

router.get('/totals', getTotals);

module.exports = router;
