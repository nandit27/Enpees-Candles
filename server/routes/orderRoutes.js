const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// Admin routes (protected)
router.get('/admin/orders', orderController.getAllOrders);
router.get('/admin/orders/:id', orderController.getOrderById);
router.patch('/admin/orders/:id/confirm', orderController.confirmOrder);
router.patch('/admin/orders/:id/ship', orderController.shipOrder);
router.patch('/admin/orders/:id/deliver', orderController.deliverOrder);
router.patch('/admin/orders/:id/cancel', orderController.cancelOrder);

// User routes (protected)
router.get('/user/orders', authMiddleware, orderController.getUserOrders);
router.get('/user/orders/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
