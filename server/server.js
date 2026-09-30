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
const Fragrance = require('./models/Fragrance');
const User = require('./models/User');

// Parse a string-list field (FormData sends JSON or comma-separated strings;
// JSON bodies send real arrays). Always returns an array of trimmed names.
const parseNameList = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
        } catch (e) { /* not JSON, fall through to comma split */ }
        return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
    return undefined;
};

// Parse per-product wax colours. Accepts [{ name, hex }] (what admin sends),
// plain name strings (legacy), or "Name:#hex, Name2" text. Normalises to
// [{ name, hex }] so every product carries its own palette.
const parseColorList = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    let items = [];
    if (Array.isArray(value)) {
        items = value;
    } else if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) items = parsed;
            else items = String(value).split(',');
        } catch (e) {
            items = String(value).split(',');
        }
    } else {
        return undefined;
    }
    return items.map((item) => {
        if (item && typeof item === 'object') {
            const name = String(item.name || '').trim();
            if (!name) return null;
            return { name, hex: String(item.hex || '').trim() };
        }
        const text = String(item || '').trim();
        if (!text) return null;
        const sep = text.includes('|') ? '|' : text.includes(':') && /#[0-9a-fA-F]{3,6}\s*$/.test(text) ? ':' : null;
        if (sep) {
            const idx = text.lastIndexOf(sep);
            return { name: text.slice(0, idx).trim(), hex: text.slice(idx + 1).trim() };
        }
        return { name: text, hex: '' };
    }).filter(Boolean);
};

// Parse the specifications object (wax, fragrance, burningTime).
const parseSpecifications = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    try {
        const obj = typeof value === 'string' ? JSON.parse(value) : value;
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined;
        const specs = {};
        if (obj.wax !== undefined) specs.wax = String(obj.wax);
        if (obj.fragrance !== undefined) specs.fragrance = String(obj.fragrance);
        if (obj.burningTime !== undefined) specs.burningTime = String(obj.burningTime);
        return specs;
    } catch (e) {
        return undefined;
    }
};

const DEFAULT_FRAGRANCES = [
    'Woody Flora',
    'Peach Miami',
    'Jasmine',
    'Mogra',
    'Berry Blast',
    'Kesar Chandan',
    'British Rose',
    'Vanilla',
    'English Lavender',
];

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
    'https://www.enpeescandles.com',
    'https://enpeescandles.com',
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
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
}));

// Handle preflight requests
app.options('*', cors());

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

// Separate storage for payment screenshots
const paymentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'enpees-candles/payments',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'],
        transformation: [{ width: 2000, height: 2000, crop: 'limit' }]
    }
});

const upload = multer({ storage: cloudinaryStorage });
const uploadPayment = multer({ storage: paymentStorage });

// Serve product images from public folder (for existing images)
app.use('/products', express.static(path.join(__dirname, 'public/products')));

// Auth routes
app.use('/api/auth', authRoutes);

// Order routes
app.use('/api', orderRoutes);

// ===== FRAGRANCE ENDPOINTS =====

// GET /api/fragrances - Public list, seeded with house defaults on first call
app.get('/api/fragrances', async (req, res) => {
    try {
        let fragrances = await Fragrance.find().sort({ name: 1 });
        if (fragrances.length === 0) {
            fragrances = await Fragrance.insertMany(
                DEFAULT_FRAGRANCES.map((name) => ({ name })),
                { ordered: false }
            ).catch(() => Fragrance.find().sort({ name: 1 }));
            if (!Array.isArray(fragrances)) fragrances = await Fragrance.find().sort({ name: 1 });
        }
        res.json(fragrances);
    } catch (error) {
        console.error('Error fetching fragrances:', error);
        res.status(500).json({ error: 'Failed to fetch fragrances' });
    }
});

// POST /api/fragrances - Add a fragrance (admin only)
app.post('/api/fragrances', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: 'Fragrance name is required' });
        }
        const fragrance = new Fragrance({ name: String(name).trim() });
        await fragrance.save();
        res.status(201).json(fragrance);
    } catch (error) {
        console.error('Error creating fragrance:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Fragrance already exists' });
        }
        res.status(500).json({ error: 'Failed to create fragrance' });
    }
});

// PATCH /api/fragrances/:id - Rename a fragrance (admin only)
app.patch('/api/fragrances/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: 'Fragrance name is required' });
        }
        const fragrance = await Fragrance.findByIdAndUpdate(
            req.params.id,
            { name: String(name).trim() },
            { new: true, runValidators: true }
        );
        if (!fragrance) return res.status(404).json({ error: 'Fragrance not found' });
        res.json(fragrance);
    } catch (error) {
        console.error('Error renaming fragrance:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Fragrance already exists' });
        }
        res.status(500).json({ error: 'Failed to rename fragrance' });
    }
});

// DELETE /api/fragrances/:id - Delete a fragrance (admin only)
app.delete('/api/fragrances/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const fragrance = await Fragrance.findByIdAndDelete(req.params.id);
        if (!fragrance) return res.status(404).json({ error: 'Fragrance not found' });
        res.json({ message: 'Fragrance deleted successfully' });
    } catch (error) {
        console.error('Error deleting fragrance:', error);
        res.status(500).json({ error: 'Failed to delete fragrance' });
    }
});

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

// GET /api/orders/track/:orderId - Public route to track order by orderId
app.get('/api/orders/track/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    try {
        // Generate order ID: hrminssddmmyy (single number, IST timezone)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istTime = new Date(now.getTime() + istOffset);
        
        const hr = String(istTime.getUTCHours()).padStart(2, '0');
        const min = String(istTime.getUTCMinutes()).padStart(2, '0');
        const sec = String(istTime.getUTCSeconds()).padStart(2, '0');
        const day = String(istTime.getUTCDate()).padStart(2, '0');
        const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
        const year = String(istTime.getUTCFullYear()).slice(-2);
        const orderId = `${hr}${min}${sec}${day}${month}${year}`;

        const orderData = {
            orderId,
            ...req.body,
            user: req.user ? req.user._id : null,
            status: 'PENDING'
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
app.post('/api/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        // If an image file was uploaded to Cloudinary, use its URL
        const imageUrl = (req.files && req.files.image && req.files.image[0]) ? req.files.image[0].path : req.body.image;

        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price) || 0,
            stock: parseInt(req.body.stock) || 0,
            category: req.body.category || 'general',
            image: imageUrl
        };

        // Additional product images (gallery)
        if (req.files && req.files.images && req.files.images.length > 0) {
            productData.images = req.files.images.map(f => f.path);
        }

        // Add offerPrice if provided and valid
        if (req.body.offerPrice && req.body.offerPrice !== '' && req.body.offerPrice !== 'null') {
            productData.offerPrice = parseFloat(req.body.offerPrice);
        }

        // Add dimensions if provided
        if (req.body.dimensions) {
            try {
                productData.dimensions = JSON.parse(req.body.dimensions);
            } catch (e) {
                // If parsing fails, it might be an old format string, ignore it
                console.log('Could not parse dimensions as JSON');
            }
        }

        // Customisable per-product options (fragrance + colour lists)
        const fragrances = parseNameList(req.body.fragrances);
        if (fragrances !== undefined) productData.fragrances = fragrances;
        const colors = parseColorList(req.body.colors);
        if (colors !== undefined) productData.colors = colors;

        // Customisable per-product specifications (wax, base scent, burn time)
        const specifications = parseSpecifications(req.body.specifications);
        if (specifications !== undefined) {
            productData.specifications = { ...productData.specifications, ...specifications };
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to create product',
            message: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : []
        });
    }
});

// PATCH /api/products/:id - Update product
app.patch('/api/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = {};

        // Only include fields that are present
        if (req.body.name) updates.name = req.body.name;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.price) updates.price = parseFloat(req.body.price);
        if (req.body.stock !== undefined) updates.stock = parseInt(req.body.stock);
        if (req.body.category) updates.category = req.body.category;
        
        // Handle featured status
        if (req.body.featured !== undefined) {
            updates.featured = req.body.featured === true || req.body.featured === 'true';
        }
        
        // Handle dimensions - parse JSON if it's a string
        if (req.body.dimensions !== undefined) {
            try {
                updates.dimensions = typeof req.body.dimensions === 'string' 
                    ? JSON.parse(req.body.dimensions) 
                    : req.body.dimensions;
            } catch (e) {
                console.log('Could not parse dimensions as JSON');
            }
        }

        // Handle offerPrice - can be null, empty string, or a number
        if (req.body.offerPrice !== undefined) {
            if (req.body.offerPrice === '' || req.body.offerPrice === 'null' || req.body.offerPrice === null) {
                updates.offerPrice = null;
            } else {
                updates.offerPrice = parseFloat(req.body.offerPrice);
            }
        }

        // Customisable per-product options (fragrance + colour lists)
        const fragrances = parseNameList(req.body.fragrances);
        if (fragrances !== undefined) updates.fragrances = fragrances;
        const colors = parseColorList(req.body.colors);
        if (colors !== undefined) updates.colors = colors;

        // Customisable per-product specifications (wax, base scent, burn time)
        const specifications = parseSpecifications(req.body.specifications);
        if (specifications !== undefined) {
            Object.entries(specifications).forEach(([key, val]) => {
                updates[`specifications.${key}`] = val;
            });
        }

        // If an image file was uploaded to Cloudinary, update the image URL
        if (req.files && req.files.image && req.files.image[0]) {
            updates.image = req.files.image[0].path;
        }

        // Handle additional gallery images - append or replace
        if (req.files && req.files.images && req.files.images.length > 0) {
            const newUrls = req.files.images.map(f => f.path);
            if (req.body.replaceImages === 'true') {
                updates.images = newUrls;
            } else {
                updates.$push = { images: { $each: newUrls } };
            }
        }

        updates.updatedAt = Date.now();

        const updateOps = { $set: updates };
        if (updates.$push) {
            updateOps.$push = updates.$push;
            delete updates.$push;
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            updateOps,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to update product',
            message: error.message 
        });
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
app.post('/api/payments/confirm', uploadPayment.single('screenshot'), async (req, res) => {
    try {
        console.log('📸 Payment screenshot upload request received');
        console.log('Body:', req.body);
        console.log('File:', req.file ? 'File received' : 'No file');
        
        if (!req.file) {
            console.log('❌ No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!req.body.orderData) {
            console.log('❌ No order data provided');
            return res.status(400).json({ error: 'Order data is required' });
        }
        
        const screenshotUrl = req.file.path; // Cloudinary URL
        console.log('✅ File uploaded to Cloudinary:', screenshotUrl);
        
        // Parse order data
        const orderData = JSON.parse(req.body.orderData);
        
        // Generate order ID: hrminssddmmyy (single number, IST timezone)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istTime = new Date(now.getTime() + istOffset);
        
        const hr = String(istTime.getUTCHours()).padStart(2, '0');
        const min = String(istTime.getUTCMinutes()).padStart(2, '0');
        const sec = String(istTime.getUTCSeconds()).padStart(2, '0');
        const day = String(istTime.getUTCDate()).padStart(2, '0');
        const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
        const year = String(istTime.getUTCFullYear()).slice(-2);
        const orderId = `${hr}${min}${sec}${day}${month}${year}`;

        // Create order with payment screenshot
        const newOrderData = {
            orderId,
            ...orderData,
            paymentScreenshot: screenshotUrl,
            status: 'PENDING'
        };

        const newOrder = new Order(newOrderData);
        await newOrder.save();
        console.log(`✅ Order created: ${orderId}`);

        // Update stock for each item
        for (const item of orderData.items) {
            if (item.productId || item.id) {
                const productId = item.productId || item.id;
                await Product.findByIdAndUpdate(productId, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Send order placed email to customer and admin
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
        
        res.json({ success: true, order: newOrder, fileUrl: screenshotUrl });
    } catch (error) {
        console.error('❌ Error uploading payment confirmation:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to confirm payment', details: error.message });
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

// POST /api/inquiries/reply - Send reply to inquiry
app.post('/api/inquiries/reply', async (req, res) => {
    try {
        const mailService = require('./services/mailService');
        const { recipientEmail, customerName, originalMessage, replyMessage } = req.body;

        if (!recipientEmail || !replyMessage) {
            return res.status(400).json({ error: 'Recipient email and reply message are required' });
        }

        const inquiryData = {
            customerName: customerName || 'Valued Customer',
            originalMessage: originalMessage || ''
        };

        const result = await mailService.sendInquiryReply(recipientEmail, inquiryData, replyMessage);

        if (result.success) {
            res.json({ message: 'Reply sent successfully', result });
        } else {
            res.status(500).json({ error: 'Failed to send reply', details: result.error });
        }
    } catch (error) {
        console.error('Error sending inquiry reply:', error);
        res.status(500).json({ error: 'Failed to send reply' });
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
