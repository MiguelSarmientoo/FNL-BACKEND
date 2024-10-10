//routes/activity.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/add', authMiddleware.verifyToken, activityController.addActivity);
router.get('/list', authMiddleware.verifyToken, activityController.getUserActivities);

module.exports = router;
