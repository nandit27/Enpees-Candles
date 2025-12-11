const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['general', 'trade', 'bulk'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: String,
    company: String,
    message: String,
    quantity: Number,
    totalQuantity: Number,
    items: [{
        productName: String,
        quantity: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
