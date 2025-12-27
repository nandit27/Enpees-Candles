const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin routes (protected)
router.get('/admin/orders', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get('/admin/orders/:id', authMiddleware, adminMiddleware, orderController.getOrderById);
router.patch('/admin/orders/:id/confirm', authMiddleware, adminMiddleware, orderController.confirmOrder);
router.patch('/admin/orders/:id/ship', authMiddleware, adminMiddleware, orderController.shipOrder);
router.patch('/admin/orders/:id/deliver', authMiddleware, adminMiddleware, orderController.deliverOrder);
router.patch('/admin/orders/:id/cancel', authMiddleware, adminMiddleware, orderController.cancelOrder);
router.patch('/admin/orders/:id/partial', authMiddleware, adminMiddleware, orderController.partialOrder);

// User routes (protected)
router.get('/user/orders', authMiddleware, orderController.getUserOrders);
router.get('/user/orders/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
