const Order = require('../models/Order');
const mailService = require('../services/mailService');

const orderController = {
    // Get all orders (Admin)
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },

    // Get single order by ID
    getOrderById: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ error: 'Failed to fetch order' });
        }
    },

    // Update order status to CONFIRMED
    confirmOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Update status
            order.status = 'CONFIRMED';
            order.timeline.confirmed = {
                completed: true,
                timestamp: new Date()
            };
            await order.save();

            // Send confirmation email
            const emailData = {
                customerName: order.customer.name,
                customerEmail: order.customer.email,
                orderId: order.orderId,
                total: order.totals.total,
                items: order.items
            };
            await mailService.sendOrderConfirmedMail(emailData);

            res.json(order);
        } catch (error) {
            console.error('Error confirming order:', error);
            res.status(500).json({ error: 'Failed to confirm order' });
        }
    },

    // Update order status to SHIPPED
    shipOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { trackingId, trackingLink } = req.body;

            if (!trackingId) {
                return res.status(400).json({ error: 'Tracking ID is required' });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Update status
            order.status = 'SHIPPED';
            order.trackingId = trackingId;
            order.trackingLink = trackingLink || '';
            order.timeline.shipped = {
                completed: true,
                timestamp: new Date()
            };
            await order.save();

            // Send shipped email
            const emailData = {
                customerName: order.customer.name,
                customerEmail: order.customer.email,
                orderId: order.orderId,
                trackingId: trackingId,
                trackingLink: trackingLink
            };
            await mailService.sendOrderShippedMail(emailData);

            res.json(order);
        } catch (error) {
            console.error('Error shipping order:', error);
            res.status(500).json({ error: 'Failed to ship order' });
        }
    },

    // Update order status to DELIVERED
    deliverOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Update status
            order.status = 'DELIVERED';
            order.timeline.delivered = {
                completed: true,
                timestamp: new Date()
            };
            await order.save();

            // Send delivered email
            const emailData = {
                customerName: order.customer.name,
                customerEmail: order.customer.email,
                orderId: order.orderId
            };
            await mailService.sendOrderDeliveredMail(emailData);

            res.json(order);
        } catch (error) {
            console.error('Error delivering order:', error);
            res.status(500).json({ error: 'Failed to deliver order' });
        }
    },

    // Cancel order
    cancelOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { reason } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Update status
            order.status = 'CANCELLED';
            order.cancellationReason = reason || 'No reason provided';
            order.timeline.cancelled = {
                completed: true,
                timestamp: new Date()
            };
            await order.save();

            // Send cancellation email
            const emailData = {
                customerName: order.customer.name,
                customerEmail: order.customer.email,
                orderId: order.orderId,
                reason: reason
            };
            await mailService.sendOrderCancelledMail(emailData);

            res.json(order);
        } catch (error) {
            console.error('Error cancelling order:', error);
            res.status(500).json({ error: 'Failed to cancel order' });
        }
    },

    // Get user's orders
    getUserOrders: async (req, res) => {
        try {
            const userEmail = req.user.email; // Assuming auth middleware sets req.user
            const orders = await Order.find({ 'customer.email': userEmail }).sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }
};

module.exports = orderController;
