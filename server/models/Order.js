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
        offerPrice: Number,  // Discounted price if offer is active
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
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    timeline: {
        placed: {
            completed: { type: Boolean, default: true },
            timestamp: { type: Date, default: Date.now }
        },
        confirmed: {
            completed: { type: Boolean, default: false },
            timestamp: Date
        },
        shipped: {
            completed: { type: Boolean, default: false },
            timestamp: Date
        },
        delivered: {
            completed: { type: Boolean, default: false },
            timestamp: Date
        },
        cancelled: {
            completed: { type: Boolean, default: false },
            timestamp: Date
        }
    },
    trackingId: String,
    trackingLink: String,
    cancellationReason: String,
    unavailableItems: [{ type: mongoose.Schema.Types.ObjectId }],
    isPartialOrder: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'cod'],
        default: 'online'
    },
    paymentScreenshot: {
        type: String,
        default: null
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
orderSchema.pre('save', function() {
    if (!this.orderId) {
        const date = new Date();
        const hr = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        // Format: hrminddmmyyss (single number without dashes)
        this.orderId = `${hr}${min}${sec}${day}${month}${year}`;
    }
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Order', orderSchema);
