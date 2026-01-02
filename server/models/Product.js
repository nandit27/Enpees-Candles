const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    offerPrice: {
        type: Number,
        default: null,
        min: 0,
        validate: {
            validator: function(value) {
                // Allow null/undefined or positive numbers
                return value === null || value === undefined || value >= 0;
            },
            message: 'Offer price must be a positive number or null'
        }
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        required: true,
        default: 'general'
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    colors: [{
        type: String
    }],
    fragrances: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
productSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Product', productSchema);
