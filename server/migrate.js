require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Inquiry = require('./models/Inquiry');
const Category = require('./models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enpees-candles';

const migrateData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Inquiry.deleteMany({});
        await Category.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create default categories
        const defaultCategories = [
            { name: 'seasonal', description: 'Seasonal candles for special occasions' },
            { name: 'premium', description: 'Premium quality candles' },
            { name: 'decorative', description: 'Decorative candles for home decor' },
            { name: 'christmas special', description: 'Special Christmas collection' },
            { name: 'general', description: 'General collection' }
        ];

        await Category.insertMany(defaultCategories);
        console.log('✅ Created default categories');

        // Migrate products
        const productsFile = path.join(__dirname, 'products.json');
        if (fs.existsSync(productsFile)) {
            const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
            
            const products = productsData.map(p => ({
                name: p.name,
                description: p.description || 'No description available',
                price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0,
                stock: typeof p.stock === 'number' ? p.stock : parseInt(p.stock) || 50,
                category: p.collection ? p.collection.toLowerCase().replace(' collection', '').trim() : 'general',
                image: p.image,
                featured: p.featured || false,
                colors: ['Natural Beige', 'Ivory White', 'Soft Pink', 'Charcoal Grey'],
                fragrances: ['Lavender', 'Vanilla', 'Sandalwood', 'Rose', 'Citrus']
            }));

            await Product.insertMany(products);
            console.log(`✅ Migrated ${products.length} products`);
        }

        // Migrate orders
        const ordersFile = path.join(__dirname, 'orders.json');
        if (fs.existsSync(ordersFile)) {
            const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
            
            if (ordersData.length > 0) {
                const orders = ordersData
                    .filter(o => o.customer && o.customer.name && o.customer.mobile && o.customer.email && o.customer.address1)
                    .map(o => ({
                        orderId: o.id || Date.now().toString(),
                        customer: {
                            name: o.customer.name,
                            mobile: o.customer.mobile,
                            email: o.customer.email,
                            address1: o.customer.address1,
                            address2: o.customer.address2 || '',
                            landmark: o.customer.landmark || '',
                            city: o.customer.city || 'Unknown',
                            state: o.customer.state || 'Unknown',
                            pincode: o.customer.pincode || '000000'
                        },
                        items: (o.items || []).map(item => ({
                            // Skip productId for old string IDs, will be null
                            name: item.name,
                            price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
                            quantity: item.quantity || 1,
                            color: item.color || 'Natural Beige',
                            fragrance: item.fragrance || 'Lavender',
                            image: item.image
                        })),
                        totals: o.totals || { subtotal: 0, giftWrap: 0, shipping: 0, discount: 0, codCharge: 0, gst: 0, total: 0 },
                        status: o.status || 'Pending',
                        paymentMethod: o.paymentMethod || 'online',
                        courierCompany: o.courierCompany || 'Standard',
                        giftWrapApplied: o.giftWrapApplied || false,
                        coupon: o.coupon || null,
                        termsAccepted: o.termsAccepted !== false,
                        createdAt: o.date || new Date()
                    }));

                if (orders.length > 0) {
                    await Order.insertMany(orders);
                    console.log(`✅ Migrated ${orders.length} orders`);
                } else {
                    console.log('⚠️  No valid orders to migrate (missing required customer fields)');
                }
            }
        }

        // Migrate inquiries
        const inquiriesFile = path.join(__dirname, 'inquiries.json');
        if (fs.existsSync(inquiriesFile)) {
            const inquiriesData = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
            
            const allInquiries = [];
            
            if (inquiriesData.general) {
                allInquiries.push(...inquiriesData.general.map(i => ({ ...i, type: 'general' })));
            }
            if (inquiriesData.trade) {
                allInquiries.push(...inquiriesData.trade.map(i => ({ ...i, type: 'trade' })));
            }
            if (inquiriesData.bulk) {
                allInquiries.push(...inquiriesData.bulk.map(i => ({ ...i, type: 'bulk' })));
            }

            if (allInquiries.length > 0) {
                await Inquiry.insertMany(allInquiries);
                console.log(`✅ Migrated ${allInquiries.length} inquiries`);
            }
        }

        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
