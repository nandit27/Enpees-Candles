require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orderRoutes');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Inquiry = require('./models/Inquiry');
const Category = require('./models/Category');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3001',
    'https://enpees-candles.vercel.app',
    'https://enpees-candles-cxjs.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Configure Cloudinary Storage for Multer
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'enpees-candles/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage: cloudinaryStorage });

// Serve product images from public folder (for existing images)
app.use('/products', express.static(path.join(__dirname, 'public/products')));

// Auth routes
app.use('/api/auth', authRoutes);

// Order routes
app.use('/api', orderRoutes);

// ===== CATEGORY ENDPOINTS =====

// GET /api/categories - Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST /api/categories - Create new category (admin only)
app.post('/api/categories', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// DELETE /api/categories/:id - Delete category (admin only)
app.delete('/api/categories/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Helper to read data
const readData = (file) => {
    if (!fs.existsSync(file)) {
        return [];
    }
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// GET /api/orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    try {
        // Get today's order count for sequential ID
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrderCount = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // Generate order ID: DDMMYY + sequential number
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const datePrefix = day + month + year;
        const sequential = String(todayOrderCount + 1).padStart(3, '0');
        const orderId = datePrefix + sequential;

        const orderData = {
            orderId,
            ...req.body,
            user: req.user ? req.user._id : null,
            status: 'PLACED'
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Update stock for each item
        for (const item of req.body.items) {
            if (item.productId || item.id) {
                const productId = item.productId || item.id;
                await Product.findByIdAndUpdate(productId, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Send order placed email only for COD orders
        // For online payments, email will be sent after payment screenshot upload
        if (newOrder.paymentMethod === 'cod') {
            const mailService = require('./services/mailService');
            const emailData = {
                customerName: newOrder.customer.name,
                customerEmail: newOrder.customer.email,
                orderId: newOrder.orderId,
                total: newOrder.totals.total,
                items: newOrder.items
            };
            mailService.sendOrderPlacedMail(emailData).catch(err => 
                console.error('Error sending order placed email:', err)
            );
        }

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST /api/products
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        // If an image file was uploaded to Cloudinary, use its URL
        const imageUrl = req.file ? req.file.path : req.body.image;

        const productData = {
            ...req.body,
            image: imageUrl,
            price: parseFloat(req.body.price) || 0,
            stock: parseInt(req.body.stock) || 0,
            category: req.body.category || 'general'
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PATCH /api/products/:id - Update product
app.patch('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = { ...req.body };

        // If an image file was uploaded to Cloudinary, update the image URL
        if (req.file) {
            updates.image = req.file.path;
        }

        // Parse numeric fields
        if (updates.price) updates.price = parseFloat(updates.price);
        if (updates.stock) updates.stock = parseInt(updates.stock);

        const product = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Endpoint to accept payment confirmation screenshot
app.post('/api/payments/confirm', upload.single('screenshot'), async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const screenshotUrl = req.file.path; // Cloudinary URL
        
        // Update order with payment screenshot
        if (orderId) {
            const order = await Order.findOneAndUpdate(
                { orderId: orderId },
                { paymentScreenshot: screenshotUrl },
                { new: true }
            );
            
            if (order) {
                console.log(`✅ Payment screenshot uploaded for order ${orderId}: ${screenshotUrl}`);
                
                // Send order placed email after payment confirmation
                const mailService = require('./services/mailService');
                const emailData = {
                    customerName: order.customer.name,
                    customerEmail: order.customer.email,
                    orderId: order.orderId,
                    total: order.totals.total,
                    items: order.items
                };
                mailService.sendOrderPlacedMail(emailData).catch(err => 
                    console.error('Error sending order placed email:', err)
                );
                
                res.json({ success: true, fileUrl: screenshotUrl, orderId });
            } else {
                console.log(`⚠️ Order not found: ${orderId}`);
                res.status(404).json({ error: 'Order not found' });
            }
        } else {
            console.log(`⚠️ No orderId provided`);
            res.json({ success: true, fileUrl: screenshotUrl, orderId: null });
        }
    } catch (error) {
        console.error('Error uploading payment confirmation:', error);
        res.status(500).json({ error: 'Failed to upload confirmation' });
    }
});

const INQUIRIES_FILE = path.join(__dirname, 'inquiries.json');

// GET /api/inquiries - Get all inquiries (for admin)
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        
        // Group by type for compatibility
        const grouped = {
            general: inquiries.filter(i => i.type === 'general'),
            trade: inquiries.filter(i => i.type === 'trade'),
            bulk: inquiries.filter(i => i.type === 'bulk')
        };
        
        res.json(grouped);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// POST /api/inquiries/general - Submit general contact inquiry
app.post('/api/inquiries/general', async (req, res) => {
    try {
        const newInquiry = new Inquiry({
            type: 'general',
            ...req.body
        });
        await newInquiry.save();
        res.status(201).json({ message: 'General inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting general inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// POST /api/inquiries/trade - Submit trade inquiry
app.post('/api/inquiries/trade', async (req, res) => {
    try {
        const newInquiry = new Inquiry({
            type: 'trade',
            ...req.body
        });
        await newInquiry.save();
        res.status(201).json({ message: 'Trade inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting trade inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// POST /api/inquiries/bulk - Submit bulk order inquiry
app.post('/api/inquiries/bulk', async (req, res) => {
    try {
        // Validate total quantity from items or direct quantity field
        const totalQuantity = req.body.totalQuantity || parseInt(req.body.quantity) || 0;

        if (totalQuantity <= 100) {
            return res.status(400).json({ error: 'Total quantity must be more than 100 pieces' });
        }

        const newInquiry = new Inquiry({
            type: 'bulk',
            ...req.body
        });
        await newInquiry.save();
        res.status(201).json({ message: 'Bulk order inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting bulk order inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: MongoDB`);
        console.log(`========================================\n`);
    });
}

// Export for Vercel
module.exports = app;
