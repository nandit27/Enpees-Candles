const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for guest checkout
    },
    customer: {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        address1: { type: String, required: true },
        address2: String,
        landmark: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false  // Made optional for migration compatibility
        },
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        fragrance: String,
        image: String
    }],
    totals: {
        subtotal: Number,
        giftWrap: Number,
        shipping: Number,
        discount: Number,
        codCharge: Number,
        gst: Number,
        total: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'cod'],
        default: 'online'
    },
    courierCompany: String,
    giftWrapApplied: {
        type: Boolean,
        default: false
    },
    coupon: String,
    termsAccepted: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate order ID before saving
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        // Generate sequential number (001, 002, etc.)
        // In production, you'd query DB for today's count
        const datePrefix = day + month + year;
        const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        this.orderId = datePrefix + randomSuffix;
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
