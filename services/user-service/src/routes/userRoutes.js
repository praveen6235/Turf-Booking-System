const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('@turf-booking/common');

const router = express.Router();

router.use(protect);

router.get('/me', userController.getUser);
router.patch('/me', userController.updateUser);

// Admin-only endpoints
router.use(restrictTo('Admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
